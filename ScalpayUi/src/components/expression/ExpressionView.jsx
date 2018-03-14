import {Layout, Menu, Popover, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import reactStringReplace from "react-string-replace";
import {ExpType, Func, DataType} from "~/utils/store";
import editExpressionModal from "~/modals/editExpressionModal";
import guid from "~/utils/guid";
import cs from "classnames";
import moment from "moment";
import "./ExpressionView.less";

@observer
export default class ExpressionView extends Component {
    static defaultProps = {
        expression: {
            returnType: null,
            expType: null,
            funcName: null,
            funcArgs: [],
            value: null,
            var: null
        },
        item: {},
        topLevel: false,
        allowEdit: false,
        allowSubEdit: false,
        onChange: (expression) => {}
    };

    @observable isBracketHovered = false;
    @observable expression = this.props.expression;

    componentWillReceiveProps(nextProps) {
        this.expression = nextProps.expression;
    }

    render = () => {
        const editProps = {
            onClick: this.props.allowEdit ? this.handleClick : undefined,
            className: this.props.allowEdit ? "expression editable" : "expression"
        };
        switch (this.expression.expType) {
            case ExpType.Value:
                let display = null;
                switch (this.expression.returnType) {
                    case DataType.Bool:
                        display = JSON.stringify(this.expression.value);
                        break;
                    case DataType.DateTime:
                        let mom = moment(this.expression.value);
                        display =
                            <Popover
                                content={"Local Time: " + mom.format("YYYY-MM-DD HH:mm:ss")}
                            >
                                <span>
                                <Icon type="date"/>
                                    &nbsp;{mom.utc().format("YYYY-MM-DD HH:mm:ss")}
                                </span>
                            </Popover>;
                        break;
                    case DataType.Duration:
                        let duration = moment.duration(this.expression.value);
                        let displayText = "";
                        if (duration.asDays() >= 1) {
                            displayText = duration.asDays().toFixed(2) + " days";
                        } else if (duration.asHours() >= 1) {
                            displayText = duration.asHours().toFixed(2) + " hours";
                        } else if (duration.asMinutes() >= 1) {
                            displayText = duration.asMinutes().toFixed(2) + " minutes";
                        } else {
                            displayText = duration.asSeconds().toFixed(2) + " seconds";
                        }
                        displayText = displayText.replace(".00", "");

                        let detailTextArray = [];
                        duration.years() && detailTextArray.push(duration.years() + " years");
                        duration.months() && detailTextArray.push(duration.months() + " months");
                        duration.days() && detailTextArray.push(duration.days() + " days");
                        duration.hours() && detailTextArray.push(duration.hours() + " hours");
                        duration.minutes() && detailTextArray.push(duration.minutes() + " minutes");
                        duration.seconds() && detailTextArray.push(duration.seconds() + " seconds");
                        let detailText = detailTextArray.length ? detailTextArray.join(", ") : "0 seconds";

                        display =
                            <Popover content={detailText}>
                                <span><Icon type="duration"/>&nbsp;{displayText}</span>
                            </Popover>;
                        break;
                    case DataType.Number:
                        display = this.expression.value;
                        break;
                    case DataType.NumberList:
                        display =
                            <Popover
                                content={this.expression.value.length ? <div className="expression-list-view">
                                    {this.expression.value.map((number, index) =>
                                        <div key={index} className="text">{number}</div>)}
                                </div> : "<Empty>"}
                            >
                                <span><Icon type="number-list"/>&nbsp;[...{this.expression.value.length}]</span>
                            </Popover>;
                        break;
                    case DataType.String:
                        display =
                            <span><Icon type="left-quote"/>{this.expression.value}<Icon type="right-quote"/></span>;
                        break;
                    case DataType.StringDict:
                        display = <Popover
                            content={Object.keys(this.expression.value).length ? <div className="expression-list-view">
                                {Object.entries(this.expression.value).map(([key, value], index) => <div key={index}>
                                    <span className="text">{key}</span>
                                    :&nbsp;
                                    <span className="text">{value}</span>
                                </div>)}
                            </div> : "<Empty>"}
                        >
                            <span>
                                <Icon type="string-dict"/>
                                {" {..." + Object.keys(this.expression.value).length + "}"}
                            </span>
                        </Popover>;
                        break;
                    case DataType.StringList:
                        display =
                            <Popover
                                content={this.expression.value.length ? <div className="expression-list-view">
                                    {this.expression.value.map((str, index) => <div key={index}
                                                                                    className="text">{str}</div>)}
                                </div> : "<Empty>"}
                            >
                                <span>
                                    <Icon type="string-list"/>
                                    &nbsp;[...{this.expression.value.length}]
                                </span>
                            </Popover>;
                        break;
                }
                return <span {...editProps}>{display}</span>;
            case ExpType.Var:
                return <span {...editProps}>
                    <Popover content={"Data Type: " + this.expression.returnType}>
                        <span><Icon type="var"/>&nbsp;{this.expression.var}</span>
                    </Popover>
                </span>;
            case ExpType.Func:
                return <span {...editProps}>
                    {!this.props.topLevel?
                        <span
                            className={cs("bracket", {"hover": this.isBracketHovered})}
                            onMouseEnter={() => this.isBracketHovered = true}
                            onMouseLeave={() => this.isBracketHovered = false}
                        >
                            {"("}</span>
                        : null}
                    {
                        reactStringReplace(Func[this.expression.returnType][this.expression.funcName].displayExp, /{(\d+)}/, (argsIndex) => {
                            return <ExpressionView
                                key={argsIndex}
                                allowEdit={this.props.allowSubEdit}
                                expression={this.expression.funcArgs[argsIndex]}
                                item={this.props.item}
                                onChange={(expression) => this.expression.funcArgs[argsIndex] = expression}/>
                        })
                    }
                    {!this.props.topLevel?
                        <span
                            className={cs("bracket", {"hover": this.isBracketHovered})}
                            onMouseEnter={() => this.isBracketHovered = true}
                            onMouseLeave={() => this.isBracketHovered = false}
                        >
                            {")"}</span>
                        : null}
                </span>;
        }
        return null;
    };

    handleClick = () => {
        editExpressionModal.open(this.expression, this.props.item, (exp) => {
            this.expression = exp;
            this.props.onChange(exp);
        });
    }
}