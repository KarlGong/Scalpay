import {Form, Input} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {untracked} from "mobx";
import ProjectSelect from "~/components/ProjectSelect";
import "./itemModal.less";
import Validator from "~/utils/Validator";
import ComponentValidator from "~/utils/ComponentValidator";

@observer
export default class BasicPanel extends Component {
    static defaultProps = {
        item: {},
        addMode: false,
        setValidator: (validator) => {}
    };

    item = this.props.item; // observable

    constructor(props) {
        super(props);
        this.validator = new Validator(this.item, {
            projectKey: {required: true, message: "project is required"},
            partialItemKey: (rule, value, callback, source, options) => {
                let errors = [];
                if (!value) {
                    errors.push(new Error("item key is required"));
                }
                if (!/^[a-zA-Z0-9-_.]+?$/.test(value)) {
                    errors.push(new Error("item key can only contain alphanumeric characters, - , _ and ."))
                }
                callback(errors);
            },
            name: {required: true}
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
                <Form.Item label="Project"
                           {...formItemLayout}
                           validateStatus={this.validator.getResult("projectKey").status}
                           help={this.validator.getResult("projectKey").message}
                >
                    <ProjectSelect
                        style={{width: "300px"}}
                        disabled={!this.props.addMode}
                        defaultValue={untracked(() => this.item.projectKey)}
                        onChange={(value) => {
                            this.item.projectKey = value;
                            this.item.itemKey = this.item.projectKey + "." + this.item.partialItemKey;
                            this.validator.resetResult("projectKey");
                        }}
                        onBlur={() => this.validator.validate("projectKey")}
                    />
                </Form.Item>
                <Form.Item label="Item Key"
                           {...formItemLayout}
                           validateStatus={this.validator.getResult("partialItemKey").status}
                           help={this.validator.getResult("partialItemKey").message}
                >
                    <Input
                        addonBefore={this.item.projectKey + "."}
                        style={{width: "500px"}}
                        disabled={!this.props.addMode}
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
                <Form.Item label="Name"
                           {...formItemLayout}
                           validateStatus={this.validator.getResult("name").status}
                           help={this.validator.getResult("name").message}
                >
                    <Input
                        style={{width: "500px"}}
                        defaultValue={untracked(() => this.item.name)}
                        onChange={(e) => {
                            this.item.name = e.target.value;
                            this.validator.resetResult("name")
                        }}
                        onBlur={() => this.validator.validate("name")}
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
            </Form>
        </div>
    };
}