import {InputNumber, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import cs from "classnames";
import Validator from "~/utils/Validator";
import ComponentValidator from "~/utils/ComponentValidator";

@observer
export default class NumberInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        onChange: (value) => {},
        defaultValue: 0,
        min: -Infinity,
        max: Infinity,
        precision: null,
        step: 1,
        setValidator: (validator) => {}
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
        this.props.setValidator(new ComponentValidator(this.validator));
    }

    render = () => {
        let precisionProps = {};
        if (this.props.precision || this.props.precision === 0) {
            precisionProps = {precision: this.props.precision};
        }
        return <Tooltip
            placement="topLeft"
            title={this.validator.getResult("value").message}>
            <InputNumber
                placeholder="Number"
                style={this.props.style}
                className={cs(this.props.className, this.validator.getResult("value").status)}
                defaultValue={this.props.defaultValue}
                min={this.props.min}
                max={this.props.max}
                {...precisionProps}
                step={this.props.step}
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
}