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


const target = document.createElement("div");
document.body.appendChild(target);

function open(user, onSuccess) {
    render(<EditUserModal user={user} onSuccess={onSuccess}/>, target);
}

function close() {
    unmountComponentAtNode(target);
}

@observer
class EditUserModal extends Component {
    static defaultProps = {
        user: {},
        onSuccess: (user) => {
        }
    };

    @observable user = {
        username: null,
        fullName: null,
        email: null,
        privileges: []
    };
    validator = new Validator(this.user, {
        fullName: {required: true},
        email: [{type: "email", required: true}]
    });
    @observable loading = false;
    @observable buttonLoading = false;
    @observable visible = true;

    componentDidMount = () => {
        this.loading = true;
        axios.get("/api/users/" + this.props.user.username)
            .then(res => {
                Object.assign(this.user, res.data);
            })
            .finally(() => this.loading = false);
    };

    render = () => {
        return <Modal
            title="Edit User"
            okText="Update User"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.buttonLoading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => close()}
        >
            <Spin spinning={this.loading}>
                <Form>
                    <Form.Item label="Username">
                        <Input
                            key={this.loading}
                            disabled
                            defaultValue={untracked(() => this.user.username)}
                        />
                    </Form.Item>
                    <Form.Item label="Full Name"
                               validateStatus={this.validator.getResult("fullName").status}
                               help={this.validator.getResult("fullName").message}>
                        <Input
                            key={this.loading}
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
                            key={this.loading}
                            defaultValue={untracked(() => this.user.email)}
                            placeholder=""
                            onChange={(e) => {
                                this.user.email = e.target.value;
                                this.validator.resetResult("email");
                            }} onBlur={() => this.validator.validate("email")}/>
                    </Form.Item>
                    <Form.Item label="Privileges">
                        <Checkbox.Group
                            key={this.loading}
                            defaultValue={untracked(() => this.user.privileges)}
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
            </Spin>
        </Modal>
    };

    handleOk = () => {
        this.validator.validateAll(() => {
            this.buttonLoading = true;
            axios.post("/api/users/" + this.user.username, this.user)
                .then(res => {
                    let user = res.data;
                    this.buttonLoading = false;
                    this.visible = false;
                    message.success(<span>
                        User <UserInfo user={user}/> is updated successfully!
                    </span>);
                    this.props.onSuccess(user);
                }, () => this.buttonLoading = false)
        });
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};