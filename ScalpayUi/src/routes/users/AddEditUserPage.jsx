import {Layout, Menu, Input, Icon, Form, Spin, Button, message, Checkbox, Row, Col, Divider} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import moment from "moment";
import Validator from "~/utils/Validator";
import "./AddEditUserPage.less";


@observer
export default class AddEditUserPage extends Component {
    @observable user = {
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

    componentDidMount = () => {
        if (this.props.route.mode !== "add") {
            this.loading = true;
            axios.get("/api/users/" + this.props.router.params.username)
                .then((res) => {
                    this.user = res.data;
                    this.validator.setSubject(this.user);
                })
                .finally(() => this.loading = false);
        }
    };

    render = () => {
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 10},
        };

        return <PageWrapper className="add-edit-user-page">
            <Spin spinning={this.loading}>
                <Form>
                    <Form.Item label="Username" {...formItemLayout}
                               validateStatus={this.validator.getResult("username").status}
                               help={this.validator.getResult("username").message}>
                        <Input key={this.loading}
                               disabled={this.props.route.mode === "edit"}
                               placeholder="A-Z a-z 0-9 ."
                               defaultValue={untracked(() => this.user.username)}
                               onChange={(e) => {
                                   this.user.username = e.target.value;
                                   this.validator.resetResult("username");
                               }} onBlur={() => this.validator.validate("username")}/>
                    </Form.Item>
                    <Form.Item label="Full Name" {...formItemLayout}
                               validateStatus={this.validator.getResult("fullName").status}
                               help={this.validator.getResult("fullName").message}>
                        <Input key={this.loading}
                               placeholder=""
                               defaultValue={untracked(() => this.user.fullName)}
                               onChange={(e) => {
                                   this.user.fullName = e.target.value;
                                   this.validator.resetResult("fullName");
                               }} onBlur={() => this.validator.validate("fullName")}/>
                    </Form.Item>
                    <Form.Item label="Email" {...formItemLayout}
                               validateStatus={this.validator.getResult("email").status}
                               help={this.validator.getResult("email").message}>
                        <Input key={this.loading}
                               placeholder=""
                               defaultValue={untracked(() => this.user.email)}
                               onChange={(e) => {
                                   this.user.email = e.target.value;
                                   this.validator.resetResult("email");
                               }} onBlur={() => this.validator.validate("email")}/>
                    </Form.Item>
                    <Form.Item label="Privileges" {...formItemLayout}>
                        <Checkbox.Group
                            key={this.loading}
                            defaultValue={untracked(() => toJS(this.user.privileges))}
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
                    <Form.Item wrapperCol={{span: 4, offset: 14}}>
                                <span>
                                <Button style={{marginRight: "10px"}} onClick={() => this.goBack()}>Cancel</Button>
                                    {
                                        this.props.route.mode === "add" ?
                                            <Button type="primary" onClick={() => this.addUser()}>Save</Button> :
                                            <Button type="primary" onClick={() => this.updateUser()}>Update</Button>
                                    }
                                </span>
                    </Form.Item>
                </Form>
            </Spin>
        </PageWrapper>
    };

    addUser = () => {
        this.validator.validateAll(() => {
            const hide = message.loading("Adding user...", 0);
            axios.put("/api/users", this.user)
                .then(res => {
                    hide();
                    message.success("The user is added successfully!");
                    this.goBack();
                }, () => hide())
        });
    };

    updateUser = () => {
        this.validator.validateAll(() => {
            const hide = message.loading("Updating user...", 0);
            axios.post("/api/users/" + this.user.username, this.user)
                .then(() => {
                    hide();
                    message.success("The user is updated successfully!");
                    this.goBack();
                }, () => hide());
        });
    };

    goBack = () => {
        this.props.router.goBack();
    }
}