import {Layout, Menu, Input, Icon, InputNumber, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import Validator from "~/utils/Validator";

@observer
export default class StringInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        defaultValue: "",
        onChange: (value) => {
        }
    };

    constructor(props) {
        super(props);
        this.item = {value: this.props.defaultValue};
        this.validator = new Validator(this.item, {
            value: (rule, value, callback, source, options) => {
                let errors = [];
                if (value === null || value === undefined) {
                    errors.push(new Error("value is required"));
                }
                callback(errors);
            }
        });
    }

    render = () => {
        return <Tooltip
            placement="topLeft"
            title={this.validator.getResult("value").message}>
            <Input
                placeholder="String"
                style={this.props.style}
                className={cs(this.props.className, this.validator.getResult("value").status)}
                defaultValue={this.props.defaultValue}
                onChange={(e) => {
                    this.item.value = e.target.value;
                    this.validator.resetResult("value");
                    this.props.onChange(e.target.value);
                }}
                onBlur={() => {
                    this.validator.validate("value");
                }}
            />
        </Tooltip>
    };

    validate = () => {
        return this.validator.validateAll();
    };
}