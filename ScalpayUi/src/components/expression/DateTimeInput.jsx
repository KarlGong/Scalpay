import {Layout, Menu, Input, Icon, DatePicker, TimePicker, Tooltip} from "antd";
import React, {Component} from "react";
import moment from "moment";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import Validator from "~/utils/Validator";
import cs from "classnames";

@observer
export default class DateTimeInput extends Component {
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
                    errors.push(new Error("date time is required"));
                }
                callback(errors);
            }
        });
    }

    render = () => {
        return <Tooltip
            placement="topLeft"
            title={this.validator.getResult("value").message}>
            <span>
            <DatePicker
                showTime
                className={cs(this.props.className, this.validator.getResult("value").status)}
                defaultValue={this.props.defaultValue && moment(this.props.defaultValue).utc()}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select Date Time"
                onChange={(value) => {
                    let val = value && value.utc().format();
                    this.item.value = val;
                    this.validator.validate("value");
                    this.props.onChange(val);
                }}
                onOk={(value) => {
                    let val = value && value.utc().format();
                    this.item.value = val;
                    this.validator.validate("value");
                    this.props.onChange(val);
                }}
            />
            </span>
        </Tooltip>
    };

    validate = () => {
        return this.validator.validateAll();
    };
}