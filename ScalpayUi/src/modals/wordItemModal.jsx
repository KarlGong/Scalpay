import {Input, Icon, Modal, Form, Radio, Row, Col, Collapse, Button, message, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import {render, unmountComponentAtNode} from "react-dom";
import ProjectSelect from "~/components/ProjectSelect";
import {DataType, ItemType, ConfigItemMode, DefaultExp} from "~/utils/store";
import DataTypeSelect from "~/components/DataTypeSelect";
import ExpressionView from "~/components/expression/ExpressionView";
import DragListView from "react-drag-listview";
import guid from "~/utils/guid";
import ComponentValidator from "~/utils/ComponentValidator";
import "./configItemModal.less";
import ItemInfo from "~/components/ItemInfo";
import Validator from "~/utils/Validator";
import event from "~/utils/event";

function add(onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<AddWordItemModal onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

function edit(item, onSuccess) {
    const hide = message.loading("Loading word item...", 0);

    const target = document.createElement("div");
    document.body.appendChild(target);

    axios.get("/api/items/word/" + item.itemKey)
        .then(res =>
            render(<EditWordItemModal item={item} onSuccess={onSuccess} afterClose={() => {
                unmountComponentAtNode(target);
                target.remove()
            }}/>, target))
        .finally(() => hide());
}

function del(user, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<DeleteWordItemModal user={user} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

@observer
class AddWordItemModal extends Component {
    static defaultProps = {
        onSuccess: (user) => {},
        afterClose: () => {}
    };

    basicInfo = {
        projectKey: null
    };

    validator = new Validator(this.basicInfo, {
        projectKey: {required: true, message: "project is required"}
    });
    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title="Add Word Item"
            okText="Add Word Item"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Form>
                <Form.Item label="Project"
                           validateStatus={this.validator.getResult("projectKey").status}
                           help={this.validator.getResult("projectKey").message}>
                    <Input
                        onChange={(e) => {
                        }} onBlur={() => this.validator.validate("projectKey")}
                    />
                </Form.Item>
                <Form.Item label="Language">

                </Form.Item>
                <Form.Item label="Email"
                           validateStatus={this.validator.getResult("email").status}
                           help={this.validator.getResult("email").message}>
                    <Input
                        defaultValue={untracked(() => this.user.email)}
                        onChange={(e) => {
                            this.user.email = e.target.value;
                            this.validator.resetResult("email");
                        }} onBlur={() => this.validator.validate("email")}/>
                </Form.Item>

            </Form>
        </Modal>
    };

    handleOk = () => {
        this.validator
            .validateAll()
            .then(() => {
                this.loading = true;
                axios.put("/api/users", this.user)
                    .then(res => {
                        let user = res.data.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>User</span>);
                        this.props.onSuccess(user);
                    }, () => this.loading = false)
            });
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

@observer
class EditWordItemModal extends Component {
    static defaultProps = {
        user: {
            username: null,
            fullName: null,
            email: null,
            privileges: []
        },
        addMode: false,
        onSuccess: (user) => {},
        afterClose: () => {}
    };

    @observable user = this.props.user;
    validator = new Validator(this.user, {
        username: (rule, value, callback, source, options) => {
            let errors = [];
            if (!value) {
                errors.push(new Error("username is required"));
            }
            if (!/^[a-zA-Z0-9-_.]+?$/.test(value)) {
                errors.push(new Error("username can only contain alphanumeric characters, - , _ and ."))
            }
            callback(errors);
        },
        fullName: {required: true},
        email: {type: "email", required: true}
    });
    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title={this.props.addMode ? "Add User" : "Edit User"}
            okText={this.props.addMode ? "Add User" : "Update User"}
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Form>
                <Form.Item label="Username"
                           validateStatus={this.validator.getResult("username").status}
                           help={this.validator.getResult("username").message}>
                    <Input
                        disabled={!this.props.addMode}
                        defaultValue={untracked(() => this.user.username)}
                        onChange={(e) => {
                            this.user.username = e.target.value;
                            this.validator.resetResult("username");
                        }} onBlur={() => this.validator.validate("username")}
                    />
                </Form.Item>
                <Form.Item label="Full Name"
                           validateStatus={this.validator.getResult("fullName").status}
                           help={this.validator.getResult("fullName").message}>
                    <Input
                        defaultValue={untracked(() => this.user.fullName)}
                        placeholder=""
                        onChange={(e) => {
                            this.user.fullName = e.target.value;
                            this.validator.resetResult("fullName");
                        }} onBlur={() => this.validator.validate("fullName")}/>
                </Form.Item>
                <Form.Item label="Email"
                           validateStatus={this.validator.getResult("email").status}
                           help={this.validator.getResult("email").message}>
                    <Input
                        defaultValue={untracked(() => this.user.email)}
                        onChange={(e) => {
                            this.user.email = e.target.value;
                            this.validator.resetResult("email");
                        }} onBlur={() => this.validator.validate("email")}/>
                </Form.Item>

            </Form>
        </Modal>
    };

    handleOk = () => {
        this.validator
            .validateAll()
            .then(() => {
                this.loading = true;
                axios.put("/api/users", this.user)
                    .then(res => {
                        let user = res.data.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>User</span>);
                        this.props.onSuccess(user);
                    }, () => this.loading = false)
            });
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

@observer
class DeleteWordItemModal extends Component {
    static defaultProps = {
        user: {},
        onSuccess: (user) => {},
        afterClose: () => {}
    };

    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title={<span>
                <Icon type="question-circle" style={{color: "#ff4d4f"}}/> Are you sure to delete this user?
            </span>}
            okText="Delete User"
            okType="danger"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            All the data of this user will be deleted.
        </Modal>
    };

    handleOk = () => {
        this.loading = true;
        axios.delete("/api/users/" + this.props.user.username)
            .then(() => {
                this.loading = false;
                this.visible = false;
                message.success(<span>
                        User  is deleted successfully!
                    </span>);
                this.props.onSuccess(this.props.user);
            }, () => this.loading = false);
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {add, edit, del};