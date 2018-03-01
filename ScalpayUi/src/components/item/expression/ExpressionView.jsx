import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import reactStringReplace from "react-string-replace";
import {ExpType, Func, DataType} from "~/utils/store";
import editExpressionModal from "~/modals/editExpressionModal";

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
        onChange: (expression) => {}
    };

    @observable expression = Object.assign({}, this.props.expression);

    render = () => {
        switch (this.expression.expType) {
            case ExpType.Value:
                let display = "";
                switch (this.expression.returnType) {
                    case DataType.Bool:
                        display = this.expression.value ? "True" : "False";
                        break;
                    case DataType.DateTime:
                        display = this.expression.value;
                        break;
                    case DataType.Duration:
                        display = this.expression.value;
                        break;
                    case DataType.Number:
                        display = this.expression.value;
                        break;
                    case DataType.NumberList:
                        display = this.expression.value;
                        break;
                    case DataType.String:
                        display = this.expression.value;
                        break;
                    case DataType.StringDict:
                        display = this.expression.value;
                        break;
                    case DataType.StringList:
                        display = this.expression.value;
                        break;
                }
                return <span onClick={this.handleClick}>{display}</span>;
            case ExpType.Var:
                return <span onClick={this.handleClick}>{this.expression.var}</span>;
            case ExpType.Func:
                return <span onClick={this.handleClick}>
                    {
                        reactStringReplace(Func[this.expression.returnType][this.expression.funcName].displayExp, /{(\d+)}/, (argsIndex) => {
                            return <ExpressionView
                                key={argsIndex}
                                expression={this.expression.funcArgs[argsIndex]}
                                item={this.props.item}
                                onChange={(expression) => this.expression.funcArgs[argsIndex] = expression}/>
                        })
                    }
                </span>;
            default:
                return <span onClick={this.handleClick}>{"<" + this.expression.returnType + ">"}</span>;
        }
    };

    handleClick = () => {
        editExpressionModal.open(this.expression, this.props.item, (exp) => {
            this.expression = exp;
            this.props.onChange(exp);
        });
    }
}