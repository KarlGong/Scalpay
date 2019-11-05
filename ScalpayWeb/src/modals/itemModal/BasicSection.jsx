import {Form, Input, Modal} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {untracked} from "mobx";
import "./itemModal.less";
import Validator from "~/utils/Validator";
import ComponentValidator from "~/utils/ComponentValidator";
import DataTypeSelect from "~/components/DataTypeSelect";
import {DefaultExp} from "~/const";
import guid from "~/utils/guid";

@observer
export default class BasicSection extends Component {
    static defaultProps = {
        item: {},
        setValidator: (validator) => {}
    };

    item = this.props.item; // observable, changes affect the input item, onXXChange can solve this, but it's too complex

    constructor(props) {
        super(props);
        this.validator = new Validator(this.item, {
            partialItemKey: (rule, value, callback, source, options) => {
                let errors = [];
                if (!value) {
                    errors.push(new Error("item key is required"));
                }
                if (!/^[a-zA-Z0-9-_.]+?$/.test(value)) {
                    errors.push(new Error("item key can only contain alphanumeric characters, - , _ and ."))
                }
                callback(errors);
            }
        });
        this.item.partialItemKey = this.item.itemKey && this.item.itemKey.split(".").slice(1).join(".");
        this.props.setValidator(new ComponentValidator(this.validator));
    }

    render = () => {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            },
        };

        return <div className="basic-panel">
            <Form>
                <Form.Item label="Item Key"
                           {...formItemLayout}
                           validateStatus={this.validator.getResult("partialItemKey").status}
                           help={this.validator.getResult("partialItemKey").message}
                >
                    <Input
                        addonBefore={this.item.projectKey + "."}
                        style={{width: "500px"}}
                        // foo.bar to bar
                        defaultValue={untracked(() => this.item.partialItemKey)}
                        onChange={(e) => {
                            this.item.partialItemKey = e.target.value;
                            // bar to foo.bar
                            this.item.itemKey = this.item.projectKey + "." + this.item.partialItemKey;
                            this.validator.resetResult("partialItemKey")
                        }}
                        onBlur={() => this.validator.validate("partialItemKey")}
                    />
                </Form.Item>
                <Form.Item label="Description"
                           {...formItemLayout}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Optional"
                        style={{width: "500px"}}
                        defaultValue={untracked(() => this.item.description)}
                        onChange={(e) => this.item.description = e.target.value}
                    />
                </Form.Item>
                <Form.Item label="Result Data Type"
                           {...formItemLayout}
                >
                    <DataTypeSelect
                        key={this.resultDataTypeResetKey}
                        style={{width: "150px"}}
                        defaultValue={untracked(() => this.item.resultDataType)}
                        onChange={(dataType) => {
                            Modal.confirm({
                                title: "Are you sure to change the result data type?",
                                content: "The result expression of all rules will be reset.",
                                okText: "Change",
                                okType: "danger",
                                cancelText: "No",
                                onOk: () => {
                                    this.item.resultDataType = dataType;
                                    this.item.rules.map(rule => {
                                        rule.result = DefaultExp[dataType];
                                    });
                                    this.item.defaultResult = DefaultExp[dataType];
                                },
                                onCancel: () => {
                                    this.resultDataTypeResetKey = guid();
                                },
                            });
                        }}/>
                </Form.Item>
            </Form>
        </div>
    };
}