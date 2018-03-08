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
import FieldsViewer from "~/components/FieldsViewer";

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
                <FieldsViewer fields={[
                    ["Username", this.user.username],
                    ["Full Name", this.user.fullName],
                    ["Email", this.user.email],
                    ["Create Time", moment(this.user.insertTime).fromNow()],
                    ["Update Time", moment(this.user.updateTime).fromNow()]
                ]}/>
            </Spin>
        </PageWrapper>
    };

    loadUser = () => {
        this.loading = true;
        axios.get("/api/users/" + this.props.params.username)
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