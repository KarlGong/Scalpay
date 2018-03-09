import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import reactStringReplace from "react-string-replace";
import {ExpType, Func, DataType} from "~/utils/store";
import editExpressionModal from "~/modals/editExpressionModal";
import guid from "~/utils/guid";
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
        allowEdit: false,
        allowSubEdit: false,
        onChange: (expression) => {}
    };

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
                let display = JSON.stringify(this.expression.value);
                // switch (this.expression.returnType) {
                //     case DataType.Bool:
                //         display = this.expression.value;
                //         break;
                //     case DataType.DateTime:
                //         display = this.expression.value;
                //         break;
                //     case DataType.Duration:
                //         display = this.expression.value;
                //         break;
                //     case DataType.Number:
                //         display = this.expression.value;
                //         break;
                //     case DataType.NumberList:
                //         display = this.expression.value;
                //         break;
                //     case DataType.String:
                //         display = this.expression.value;
                //         break;
                //     case DataType.StringDict:
                //         display = this.expression.value;
                //         break;
                //     case DataType.StringList:
                //         display = this.expression.value;
                //         break;
                // }
                return <span {...editProps}>{display}</span>;
            case ExpType.Var:
                return <span {...editProps}>{this.expression.var}</span>;
            case ExpType.Func:
                return <span {...editProps}>
                    <span>(</span>
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
                    <span>)</span>
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