import {Select, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {Func} from "~/const";
import Validator from "~/utils/Validator";
import cs from "classnames";
import ComponentValidator from "~/utils/ComponentValidator";
import "./FunctionSelect.less";

@observer
export default class FunctionSelect extends Component {
    static defaultProps = {
        returnType: "",
        defaultValue: undefined,
        onChange: (functionName) => { },
        setValidator: (validator) => {}
    };

    constructor(props) {
        super(props);
        this.item = {value: this.props.defaultValue};
        this.validator = new Validator(this.item, {
            value: (rule, value, callback, source, options) => {
                let errors = [];
                if (!value) {
                    errors.push(new Error("function is required"));
                }
                callback(errors);
            }
        });
        this.props.setValidator(new ComponentValidator(this.validator));
    }

    render() {
        return <span className="function-select">
            <Tooltip
                placement="topLeft"
                title={this.validator.getResult("value").message}>
                <Select
                    className={cs("input", this.validator.getResult("value").status)}
                    showSearch
                    placeholder="Function"
                    dropdownMatchSelectWidth={false}
                    defaultValue={this.props.defaultValue || undefined}
                    onChange={(value) => {
                        this.item.value = value;
                        this.validator.resetResult("value");
                        this.props.onChange(value);
                    }}
                    onBlur={() => {
                        this.validator.validate("value");
                    }}>
                    {
                        Object.entries(Func[this.props.returnType]).map(([name, func]) => {
                            return <Select.Option value={name} key={name}>{func.displayName}</Select.Option>
                        })
                    }
                </Select>
            </Tooltip>
        </span>
    };
}