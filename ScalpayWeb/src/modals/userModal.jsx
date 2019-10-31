import {Checkbox, Form, Input, message, Modal} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked} from "mobx";
import axios from "axios";
import {Privilege} from "~/utils/store";
import {render, unmountComponentAtNode} from "react-dom";
import Validator from "~/utils/Validator";
import UserInfo from "~/components/UserInfo";

function add(onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<EditUserModal addMode onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

function edit(user, onSuccess) {
    const hide = message.loading("Loading user...", 0);

    const target = document.createElement("div");
    document.body.appendChild(target);

    axios.get("/api/users/" + user.username)
        .then(res =>
            render(<EditUserModal user={res.data.data} onSuccess={onSuccess} afterClose={() => {
                unmountComponentAtNode(target);
                target.remove()
            }}/>, target))
        .finally(() => hide());
}

@observer
class EditUserModal extends Component {
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

    @observable user = this.props.loginParams;
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
                <Form.Item label="Privileges">
                    <Checkbox.Group
                        defaultValue={untracked(() => toJS(this.user.privileges))}
                        onChange={e => this.user.privileges = e}>
                        <Checkbox value={Privilege.projectManage}>Manage Projects</Checkbox>
                        <Checkbox value={Privilege.itemManage}>Manage Items</Checkbox>
                        <Checkbox value={Privilege.userManage}>Manage Users</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
            </Form>
        </Modal>
    };

    handleOk = () => {
        if (this.props.addMode) {
            this.validator
                .validateAll()
                .then(() => {
                    this.loading = true;
                    axios.put("/api/users", this.user)
                        .then(res => {
                            let user = res.data.data;
                            this.loading = false;
                            this.visible = false;
                            message.success(<span>User <UserInfo username={user.username}/> is added successfully!</span>);
                            this.props.onSuccess(user);
                        }, () => this.loading = false)
                });
        } else {
            this.validator
                .validateAll()
                .then(() => {
                    this.loading = true;
                    axios.post("/api/users/" + this.user.username, this.user)
                        .then(res => {
                            let user = res.data.data;
                            this.loading = false;
                            this.visible = false;
                            message.success(<span>User <UserInfo username={user.username}/> is updated successfully!</span>);
                            this.props.onSuccess(user);
                        }, () => this.loading = false)
                });
        }
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {add, edit};