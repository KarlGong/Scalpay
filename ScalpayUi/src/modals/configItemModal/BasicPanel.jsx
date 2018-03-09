import {Input, Icon, Modal, Form, Radio, Row, Col, Collapse, Button, message, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action, computed} from "mobx";
import axios from "axios";
import cs from "classnames";
import {render, unmountComponentAtNode} from "react-dom";
import ProjectSelect from "~/components/ProjectSelect";
import {DataType, ItemType, ConfigItemMode, DefaultExp} from "~/utils/store";
import DataTypeSelect from "~/components/DataTypeSelect";
import ExpressionView from "~/components/expression/ExpressionView";
import DragListView from "react-drag-listview";
import guid from "~/utils/guid";
import event from "~/utils/event";
import "./configItemModal.less";
import ItemInfo from "~/components/ItemInfo";
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
        this.item.partialItemKey = this.item.itemKey && this.item.itemKey.split(".").slice(2).join(".");
        this.props.setValidator(new ComponentValidator(this.validator));
    }

    render = () => {
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 20
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
                            this.item.itemKey = "config." + this.item.projectKey + "." + this.item.partialItemKey;
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
                        addonBefore={"config." + this.item.projectKey + "."}
                        style={{width: "500px"}}
                        disabled={!this.props.addMode}
                        // config.foo.bar to bar
                        defaultValue={untracked(() => this.item.partialItemKey)}
                        onChange={(e) => {
                            this.item.partialItemKey = e.target.value;
                            // bar to config.foo.bar
                            this.item.itemKey = "config." + this.item.projectKey + "." + this.item.partialItemKey;
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