import {Checkbox, Form, Input, message, Drawer, Button, Radio, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked} from "mobx";
import axios from "axios";
import {render, unmountComponentAtNode} from "react-dom";
import Validator from "~/utils/Validator";
import UserInfo from "~/components/UserInfo";
import {Permission, Role} from "~/const";

function add(onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<UserModal addMode onSuccess={onSuccess} afterClose={() => {
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
            render(<UserModal user={res.data} onSuccess={onSuccess} afterClose={() => {
                unmountComponentAtNode(target);
                target.remove()
            }}/>, target))
        .finally(() => hide());
}

@observer
class UserModal extends Component {
    static defaultProps = {
        user: {
            username: null,
            fullName: null,
            email: null,
            role: Role.User,
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

    render() {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            },
        };
        return <Drawer
            title={this.props.addMode ? "Add User" : "Edit User"}
            visible={this.visible}
            width={500}
            maskClosable={false}
            onClose={this.handleCancel}
            afterVisibleChange={visible => !visible && this.props.afterClose()}
        >
            <Form {...formItemLayout}>
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
                <Form.Item label="Role">
                    <Select style={{width: "120px"}} onChange={value => this.user.role = value} defaultValue={this.user.role}>
                        {
                            Object.entries(Role).map(([key, value]) => <Select.Option key={value} value={value}>{key}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    borderTop: "1px solid #e9e9e9",
                    padding: "10px 16px",
                    background: "#fff",
                    textAlign: "right",
                }}
            >
                <Button onClick={this.handleCancel} style={{marginRight: 8}}>
                    Cancel
                </Button>
                <Button onClick={this.handleOk} type="primary" loading={this.isSubmitting}>
                    Submit
                </Button>
            </div>
        </Drawer>
    };

    handleOk = () => {
        if (this.props.addMode) {
            this.validator
                .validateAll()
                .then(() => {
                    this.loading = true;
                    axios.post("/api/users", this.user)
                        .then(res => {
                            let user = res.data;
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
                    axios.put("/api/users/" + this.user.username, this.user)
                        .then(res => {
                            let user = res.data;
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