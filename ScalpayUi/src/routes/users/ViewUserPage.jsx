import {Layout, Menu, Input, Icon, Form, Spin, Button, Modal, Breadcrumb} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {Link} from "react-router";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import moment from "moment";
import Validator from "~/utils/Validator";
import "./ViewUserPage.less";
import global from "~/global";
import userModal from "~/modals/userModal";

@observer
export default class ViewUserPage extends Component {

    @observable user = {};
    @observable loading = false;

    componentDidMount = () => {
        this.loadUser();
    };

    render = () => {
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 21},
        };

        return <PageWrapper
            className="view-user-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/users">Users</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.params.username}</Breadcrumb.Item>
            </Breadcrumb>}>
            <div className="command-bar">
                {auth.hasPrivileges(Privilege.UserManage) ?
                    <div>
                        <Button className="command" onClick={() => this.editUser()}>Edit</Button>
                        <Button type="danger" className="command" onClick={() => this.deleteUser()}>Delete</Button>
                    </div>
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

    loadUser = () => {
        this.loading = true;
        axios.get("/api/users/" + this.props.router.params.username)
            .then((res) => this.user = res.data)
            .finally(() => this.loading = false);
    };

    editUser = () => {
        userModal.edit(this.user, () => this.loadUser());
    };

    deleteUser = () => {
        userModal.del(this.user, (user) => global.history.goBack());
    }
}