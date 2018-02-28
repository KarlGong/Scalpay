import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {ExpType, Func} from "~/utils/store";
import editExpressionModal from "~/modals/editExpressionModal";

@observer
export default class ExpressionView extends Component {
    static defaultProps = {
        expression: {
            return: null,
            type: null,
            name: null,
            args: [],
            value: null,
            var: null
        },
        item: {},
        onChange: (expression) => {}
    };

    @observable expression = Object.assign({}, this.props.expression);

    render = () => {
        switch (this.expression.type) {
            case ExpType.Value:
                return <span onClick={this.handleClick}>{this.expression.value}</span>;
            case ExpType.Var:
                return <span onClick={this.handleClick}>{this.expression.var}</span>;
            case ExpType.Func:
                return <span onClick={this.handleClick}>
                    {
                        Func[this.expression.return].filter(f => f.name === this.expression.name)[0]
                            .exp.replace(/{(\w+)::(\d+)}/, (match, dataType, argsIndex) => {
                        return <ExpressionView expression={this.expression.args[argsIndex]}
                                               item={this.props.item}/>
                    })}
                </span>;
            default:
                return <span onClick={this.handleClick}>{"<" + this.expression.return + ">"}</span>;
        }
    };

    handleClick = () => {
        editExpressionModal.open(this.expression, this.props.item, (exp) => {
            this.expression = exp;
            this.props.onChange(exp);
        });
    }
}