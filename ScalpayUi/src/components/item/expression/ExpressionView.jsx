import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {ExpType} from "~/utils/store";

@observer
export default class ExpressionView extends Component {
    static defaultProps = {
        expression: {}
    };

    render = () => {
        switch (this.props.expression.type) {
            case ExpType.Value:
                return <span>{this.props.expression.value}</span>;
            case ExpType.Var:
                return <span>{this.props.expression.var}</span>;
            case ExpType.Func:
                return <span>
                    {this.props.expression.exp.replace(/{(\w+)::(\d+)}/, (match, dataType, argsIndex) => {
                        return <ExpressionView/>
                    })}
                </span>;
            default: return null
        }
    }
}