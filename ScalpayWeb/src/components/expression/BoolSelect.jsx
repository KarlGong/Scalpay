import {Radio, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import cs from "classnames";
import Validator from "~/utils/Validator";
import ComponentValidator from "~/utils/ComponentValidator";
import "./BoolSelect.less";

@observer
export default class BoolSelect extends Component {
    static defaultProps = {
        defaultValue: true,
        onChange: (value) => {
        },
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

    render() {
        return <span className="bool-select">
            <Tooltip
                placement="topLeft"
                title={this.validator.getResult("value").message}>
                <Radio.Group
                    className={cs("input", this.validator.getResult("value").status)}
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
        </span>
    };
}