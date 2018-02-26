import {Layout, Menu, Input, Icon, Form, Spin, Button, message, Checkbox, Row, Col, Divider, Modal} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import {render, unmountComponentAtNode} from "react-dom";
import moment from "moment";
import Validator from "~/utils/Validator";
import global from "~/global";
import UserInfo from "~/components/UserInfo";

function open(onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(<AddUserModal onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

@observer
class AddUserModal extends Component {
    static defaultProps = {
        onSuccess: (user) => {},
        afterClose: () => {}
    };

    user = {
        username: null,
        fullName: null,
        email: null,
        privileges: []
    };
    validator = new Validator(this.user, {
        username: {required: true},
        fullName: {required: true},
        email: [{type: "email", required: true}]
    });
    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title="Add User"
            okText="Add User"
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
                        placeholder="A-Z a-z 0-9 ."
                        onChange={(e) => {
                            this.user.username = e.target.value;
                            this.validator.resetResult("username");
                        }} onBlur={() => this.validator.validate("username")}/>
                </Form.Item>
                <Form.Item label="Full Name"
                           validateStatus={this.validator.getResult("fullName").status}
                           help={this.validator.getResult("fullName").message}>
                    <Input
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
                        placeholder=""
                        onChange={(e) => {
                            this.user.email = e.target.value;
                            this.validator.resetResult("email");
                        }} onBlur={() => this.validator.validate("email")}/>
                </Form.Item>
                <Form.Item label="Privileges">
                    <Checkbox.Group
                        onChange={e => this.user.privileges = e}>
                        <Divider style={{fontSize: "12px"}}>Projects</Divider>
                        <Row>
                            <Col span={8}><Checkbox value={Privilege.ProjectAdd}>Add Project</Checkbox></Col>
                            <Col span={8}><Checkbox value={Privilege.ProjectEdit}>Edit Project</Checkbox></Col>
                            <Col span={8}><Checkbox value={Privilege.ProjectDelete} style={{color: "#f00"}}>Delete
                                Project</Checkbox></Col>
                        </Row>
                        <Divider style={{fontSize: "12px"}}>Items</Divider>
                        <Row>
                            <Col span={8}><Checkbox value={Privilege.ItemAdd}>Add Item</Checkbox></Col>
                            <Col span={8}><Checkbox value={Privilege.ItemEdit}>Edit Item</Checkbox></Col>
                            <Col span={8}><Checkbox value={Privilege.ItemDelete} style={{color: "#f00"}}>Delete
                                Item</Checkbox></Col>
                        </Row>
                        <Divider style={{fontSize: "12px"}}>Users</Divider>
                        <Row>
                            <Col span={8}><Checkbox value={Privilege.UserManage}>Manage Users</Checkbox></Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
            </Form>
        </Modal>
    };

    handleOk = () => {
        this.validator.validateAll(() => {
            this.loading = true;
            axios.put("/api/users", this.user)
                .then(res => {
                    let user = res.data;
                    this.loading = false;
                    this.visible = false;
                    message.success(<span>
                        User <UserInfo user={user}/> is added successfully!
                    </span>);
                    this.props.onSuccess(user);
                }, () => this.loading = false)
        });
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};