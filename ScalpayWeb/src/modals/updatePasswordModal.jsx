import {Form, Input, message, Modal} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import {render, unmountComponentAtNode} from "react-dom";
import Validator from "~/utils/Validator";

function open(username, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(<UpdatePasswordModal username={username} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}


@observer
class UpdatePasswordModal extends Component {
    static defaultProps = {
        username: "",
        onSuccess: (project) => {
        },
        afterClose: () => {
        }
    };

    fields = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    };
    validator = new Validator(this.fields, {
        currentPassword: {required: true, message: "current password is required"},
        newPassword: (rule, value, callback, source, options) => {
            let errors = [];
            if (!value) {
                errors.push(new Error("new password is required"));
            }
            callback(errors);
        },
        confirmPassword: (rule, value, callback, source, options) => {
            let errors = [];
            if (!value) {
                errors.push(new Error("please enter the new password again"));
            }
            if (source.newPassword !== value) {
                errors.push(new Error("it doesn't match the new password you entered"))
            }
            callback(errors);
        }
    });
    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title="Update Password"
            okText="Update Password"
            cancelText="Cancel"
            visible={this.visible}
            confirmLoading={this.loading}
            maskClosable={false}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Form>
                <Form.Item label="Current Password"
                           validateStatus={this.validator.getResult("currentPassword").status}
                           help={this.validator.getResult("currentPassword").message}
                >
                    <Input
                        type="password"
                        onChange={e => {
                            this.fields.currentPassword = e.target.value;
                            this.validator.resetResult("currentPassword");
                        }}
                        onBlur={e => this.validator.validate("currentPassword")}
                    />
                </Form.Item>
                <Form.Item label="New Password"
                           validateStatus={this.validator.getResult("newPassword").status}
                           help={this.validator.getResult("newPassword").message}
                >
                    <Input
                        type="password"
                        onChange={e => {
                            this.fields.newPassword = e.target.value;
                            this.validator.resetResult("newPassword");
                        }}
                        onBlur={e => this.validator.validate("newPassword")}
                    />
                </Form.Item>
                <Form.Item label="Confirm Password"
                           validateStatus={this.validator.getResult("confirmPassword").status}
                           help={this.validator.getResult("confirmPassword").message}
                >
                    <Input
                        type="password"
                        onChange={e => {
                            this.fields.confirmPassword = e.target.value;
                            this.validator.resetResult("confirmPassword");
                        }}
                        onBlur={e => this.validator.validate("confirmPassword")}
                    />
                </Form.Item>
            </Form>
        </Modal>
    };

    handleOk = () => {
        this.validator
            .validateAll()
            .then(() => {
                this.loading = true;
                axios.post("/api/users/" + this.props.username + "/password", this.fields)
                    .then(res => {
                        let user = res.data.data;
                        this.loading = false;
                        this.visible = false;
                        message.success("Your password is updated successfully!");
                        this.props.onSuccess(user);
                    }, () => this.loading = false)
            })
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};