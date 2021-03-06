import {Breadcrumb, Button, Avatar, Descriptions, Result} from "antd";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import {Link} from "react-router";
import auth from "~/utils/auth";
import PageWrapper from "~/layouts/PageWrapper";
import "./ViewUserPage.less";
import userModal from "~/modals/userModal";
import Block from "~/layouts/Block";
import AuditsView from "~/components/AuditsView";
import {Permission} from "~/const";

@observer
export default class ViewUserPage extends Component {

    @observable user = {
        username: this.props.params.username,
        fullName: null,
        email: null,
        privileges: []
    };
    @observable loading = false;

    componentDidMount = () => {
        if (this.checkPermission()) {
            this.loadUser();
        }
    };

    checkPermission = () => {
        return auth.hasGlobalPermission(Permission.Read);
    }

    render() {
        if (!this.checkPermission()) {
            return <PageWrapper style={{background: "#f0f2f5", justifyContent: "center", alignItems: "center"}}>
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                />
            </PageWrapper>
        }

        return <PageWrapper
            className="item-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/users">Users</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{this.user.username}</Breadcrumb.Item>
            </Breadcrumb>}>
            <div>
                <div>
                    <Avatar size={128} icon={<UserOutlined/>} style={{backgroundColor: "#87d068"}}/>
                </div>
                <div style={{marginTop: "16px"}}>
                    {
                        (auth.user.username === this.user.username || auth.hasGlobalPermission(Permission.Admin)) &&
                        <Button icon={<EditOutlined/>} onClick={() => this.editUser()}>
                            Edit Profile
                        </Button>
                    }
                </div>
                <Descriptions style={{marginTop: "20px"}} column={1}>
                    <Descriptions.Item label="Username">{this.user.username}</Descriptions.Item>
                    <Descriptions.Item label="Full Name">{this.user.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{this.user.email}</Descriptions.Item>
                    <Descriptions.Item label="Role">{this.user.role}</Descriptions.Item>
                </Descriptions>
            </div>
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
}