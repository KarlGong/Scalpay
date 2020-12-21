import {Button, Input, Tooltip} from "antd";
import {CloseCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import guid from "~/utils/guid";
import Validator from "~/utils/Validator";
import cs from "classnames";
import ComponentValidator from "~/utils/ComponentValidator";
import "./StringDictInput.less";

@observer
export default class StringDictInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        defaultValue: {},
        onChange: (value) => { },
        setValidator: (validator) => {}
    };

    constructor(props) {
        super(props);
        this.items = observable(Object.entries(this.props.defaultValue).map(([dictKey, dictValue]) => {
            return {key: guid(), dictKey: dictKey, dictValue: dictValue}
        }));

        this.validatorDescriptor = {
            dictKey: (rule, value, callback, source, options) => {
                let errors = [];
                if (value === null || value === undefined) {
                    errors.push(new Error("key is required"));
                }
                if (this.items.filter(item => item.dictKey === value).length > 1) {
                    errors.push(new Error("duplicating key: " + value));
                }
                callback(errors);
            },
            dictValue: (rule, value, callback, source, options) => {
                let errors = [];
                if (value === null || value === undefined) {
                    errors.push(new Error("value is required"));
                }
                callback(errors);
            }
        };

        this.validators = this.items.map((item) => new Validator(item, this.validatorDescriptor));
        this.setValidator();
    }

    render() {
        return <div className={cs("string-dict-input", this.props.className)} style={this.props.style}>
            {
                this.items.map((item, index) => {
                    return <div key={item.key} className="item">
                        <Tooltip
                            placement="topLeft"
                            title={this.validators[index].getResult("dictKey").message}>
                            <Input
                                className={cs("input-key", this.validators[index].getResult("dictKey").status)}
                                defaultValue={untracked(() => item.dictKey)}
                                onChange={(e) => {
                                    item.dictKey = e.target.value;
                                    this.validators[index].resetResult("dictKey");
                                    this.handleChange();
                                }}
                                onBlur={(e) => this.validators[index].validate("dictKey")}
                            />
                        </Tooltip>
                        <Tooltip
                            placement="topLeft"
                            title={this.validators[index].getResult("dictValue").message}>
                            <Input
                                className={cs("input-value", this.validators[index].getResult("dictValue").status)}
                                defaultValue={untracked(() => item.dictValue)}
                                onChange={(e) => {
                                    item.dictValue = e.target.value;
                                    this.validators[index].resetResult("dictValue");
                                    this.handleChange();
                                }}
                                onBlur={(e) => this.validators[index].validate("dictValue")}
                            />
                        </Tooltip>
                        <CloseCircleOutlined
                            className="delete"
                            onClick={() => {
                                this.items.splice(index, 1);
                                this.validators.splice(index, 1);
                                this.setValidator();
                                this.handleChange();
                            }}
                        />
                    </div>
                })
            }
            <Button
                type="dashed"
                className="add"
                onClick={() => {
                    this.items.push({key: guid(), dictKey: "", dictValue: ""});
                    this.validators.push(new Validator(this.items.slice(-1)[0], this.validatorDescriptor));
                    this.setValidator();
                    this.handleChange();
                }}>
                <PlusOutlined /> Add Key Value Pair
            </Button>
        </div>
    };

    handleChange = () => {
        let dict = {};
        this.items.map(item => dict[item.dictKey] = item.dictValue);
        this.props.onChange(dict);
    };

    setValidator = () => {
        this.props.setValidator(new ComponentValidator(this.validators));
    };
}