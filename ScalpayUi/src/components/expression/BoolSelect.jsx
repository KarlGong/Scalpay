import {Layout, Menu, Input, Icon, Radio, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import Validator from "~/utils/Validator";
import ComponentValidator from "~/utils/ComponentValidator";

@observer
export default class BoolSelect extends Component {
    static defaultProps = {
        style: {},
        className: "",
        onChange: (value) => {
        },
        defaultValue: true,
        setValidator: (validator) => {}
    };

    constructor(props) {
        super(props);
        this.item = {value: this.props.defaultValue};
        this.validator = new Validator(this.item, {
            value: (rule, value, callback, source, options) => {
                let errors = [];
                if (value === undefined || value === null) {
                    errors.push(new Error("value is required"));
                }
                callback(errors);
            }
        });
        this.props.setValidator(new ComponentValidator(this.validator))
    }

    render = () => {
        return <Tooltip
            placement="topLeft"
            title={this.validator.getResult("value").message}>
            <Radio.Group
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
                }}>
                <Radio.Button value={true}>True</Radio.Button>
                <Radio.Button value={false}>False</Radio.Button>
            </Radio.Group>
        </Tooltip>
    };
}