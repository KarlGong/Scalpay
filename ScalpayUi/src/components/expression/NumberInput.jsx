import {Layout, Menu, Input, Icon, InputNumber, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import Validator from "~/utils/Validator";

@observer
export default class NumberInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        onChange: (value) => {},
        defaultValue: 0
    };

    constructor(props){
        super(props);
        this.item = {value: this.props.defaultValue};
        this.validator = new Validator(this.item, {
            value: (rule, value, callback, source, options) => {
                let errors = [];
                if (!value && value !== 0) {
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
            <InputNumber
                placeholder="Number"
                style={this.props.style}
                className={cs(this.props.className, this.validator.getResult("value").status)}
                defaultValue={this.props.defaultValue}
                step={1}
                onChange={(value) => {
                    this.item.value = value;
                    this.validator.resetResult("value");
                    this.props.onChange(value);
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