import {Layout, Menu, Input, Icon, Form, Spin, Button, Modal, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import moment from "moment";
import Validator from "~/utils/Validator";
import "./ViewUserPage.less";

@observer
export default class ViewUserPage extends Component {

    @observable user = {};
    @observable loading = false;

    componentDidMount = () => {
        this.loading = true;
        axios.get("/api/users/" + this.props.router.params.username)
            .then((res) => this.user = res.data)
            .finally(() => this.loading = false);
    };

    render = () => {
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 21},
        };

        return <PageWrapper className="view-user-page">
            <div className="command-bar">
                {auth.hasPrivileges(Privilege.UserEdit) ?
                    <Button className="command" onClick={() => this.editUser()}>Edit</Button>
                    : null}
                {auth.hasPrivileges(Privilege.UserDelete) ?
                    <Button type="danger" className="command" onClick={() => this.deleteUser()}>Delete</Button>
                    : null}
            </div>
            <Spin spinning={this.loading}>
                <Form>
                    <Form.Item label="Username" {...formItemLayout}>
                        <span>{this.user.username}</span>
                    </Form.Item>
                    <Form.Item label="Full Name" {...formItemLayout}>
                        <span>{this.user.fullName}</span>
                    </Form.Item>
                    <Form.Item label="Email" {...formItemLayout}>
                        <span>{this.user.email}</span>
                    </Form.Item>
                    <Form.Item label="Create Time" {...formItemLayout}>
                        <span>{moment(this.user.insertTime).fromNow()}</span>
                    </Form.Item>
                    <Form.Item label="Update Time" {...formItemLayout}>
                        <span>{moment(this.user.updateTime).fromNow()}</span>
                    </Form.Item>
                </Form>
            </Spin>
        </PageWrapper>
    };

    editUser = () => {
        this.props.router.push("/users/" + this.user.username + "/edit");
    };

    deleteUser = () => {
        Modal.confirm({
            title: "Are you sure to delete this user?",
            content: "All the data of this user will be deleted.",
            okText: "Delete User",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                const hide = message.loading("Deleting user...", 0);
                axios.delete("/api/users/" + this.user.username)
                    .then(() => {
                        hide();
                        message.success("The user is deleted successfully!");
                        this.props.router.goBack();
                    }, () => hide());
            },
        });
    }
}