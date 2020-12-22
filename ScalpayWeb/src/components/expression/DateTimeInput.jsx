import {DatePicker, Space, Tooltip} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import moment from "moment";
import {observer} from "mobx-react";
import Validator from "~/utils/Validator";
import cs from "classnames";
import ComponentValidator from "~/utils/ComponentValidator";
import "./DateTimeInput.less";

@observer
export default class DateTimeInput extends Component {
    static defaultProps = {
        defaultValue: "",
        onChange: (value) => { },
        setValidator: (validator) => {}
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
        this.props.setValidator(new ComponentValidator(this.validator));
    }

    render() {
        return <span className="datetime-input">
            <Space>
                <Tooltip
                    placement="topLeft"
                    title={this.validator.getResult("value").message}>
                    <span>
                        <DatePicker
                            showTime
                            allowClear={false}
                            className={cs("input", this.validator.getResult("value").status)}
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
                <Tooltip title="UTC time"><QuestionCircleOutlined className="tooltip-icon"/></Tooltip>
            </Space>
        </span>
    };
}