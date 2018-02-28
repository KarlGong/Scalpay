import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {ExpType} from "~/utils/store";
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
        item: {}
    };

    render = () => {
        switch (this.props.expression.type) {
            case ExpType.Value:
                return <span onClick={this.handleClick}>{this.props.expression.value}</span>;
            case ExpType.Var:
                return <span onClick={this.handleClick}>{this.props.expression.var}</span>;
            case ExpType.Func:
                return <span onClick={this.handleClick}>
                    {this.props.expression.exp.replace(/{(\w+)::(\d+)}/, (match, dataType, argsIndex) => {
                        return <ExpressionView expression={this.props.expression.args[argsIndex]} item={this.props.item} />
                    })}
                </span>;
            default: return <span onClick={this.handleClick}>{this.props.expression.return}</span>;
        }
    };

    handleClick = () => {
        editExpressionModal.open(this.props.expression, this.props.item, (exp) => {
            Object.assign(this.props.expression, exp);
        })
    }
}