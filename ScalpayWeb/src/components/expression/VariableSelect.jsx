import {Select, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import Validator from "~/utils/Validator";
import cs from "classnames";
import ComponentValidator from "~/utils/ComponentValidator";

@observer
export default class VariableSelect extends Component {
    static defaultProps = {
        style: {},
        className: "",
        defaultValue: undefined,
        variables: [],
        onChange: (variableName) => {},
        setValidator: (validator) => {}
    };

    constructor(props) {
        super(props);
        this.item = {value: this.props.defaultValue};
        this.validator = new Validator(this.item, {
            value: (rule, value, callback, source, options) => {
                let errors = [];
                if (!value) {
                    errors.push(new Error("variable is required"));
                }
                callback(errors);
            }
        });
        this.props.setValidator(new ComponentValidator(this.validator));
    }

    render = () => {
        return <Tooltip
            placement="topLeft"
            title={this.validator.getResult("value").message}>
            <Select
                style={this.props.style}
                className={cs(this.props.className, this.validator.getResult("value").status)}
                defaultValue={this.props.defaultValue || undefined}
                showSearch
                placeholder="Variable"
                dropdownMatchSelectWidth={false}
                onChange={(value) => {
                    this.item.value = value;
                    this.validator.resetResult("value");
                    this.props.onChange(value);
                }}
                onBlur={() => {
                    this.validator.validate("value");
                }}>
                {
                    this.props.variables.map((variable) =>
                        <Select.Option value={variable.name} key={variable.name}>{variable.name}</Select.Option>
                    )
                }
            </Select>
        </Tooltip>
    };
}