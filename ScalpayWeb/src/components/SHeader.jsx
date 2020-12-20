import {Avatar, Button, Dropdown, Icon, Input, Layout, Menu, Spin, message} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import cs from "classnames";
import auth from "~/utils/auth";
import {Privilege} from "~/const";
import {Link} from "react-router";
import global from "~/global";
import itemModal from "~/modals/itemModal/itemModal";
import logo from "~/assets/imgs/logo.png";
import updatePasswordModal from "~/modals/updatePasswordModal";
import "./SHeader.less";

@observer
export default class SHeader extends Component {
    @observable searchLoading = false;

    render() {
        return <Layout.Header className="header">
            <div className="left">
                <div className="logo">
                    <Link to="/"><img src={logo}/></Link>
                </div>
                {
                    auth.user &&
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{lineHeight: "64px"}}
                    >
                        <Menu.Item key="1" onClick={() => global.history.push("/projects")}>Projects</Menu.Item>
                    </Menu>}
            </div>
            {
                auth.user &&
                <div className="right">
                    <Input
                        placeholder="Search Item Key"
                        suffix={this.searchLoading ? <Spin size="small"/> : <Icon type="search"/>}
                        onPressEnter={e => {
                            let itemKey = e.target.value;
                            let projectKey = itemKey.split(".")[0];
                            this.searchLoading = true;
                            axios.get(`/api/projects/${projectKey}/items/${itemKey}`, {
                                skipInterceptor: true
                            }).then(response => global.history.push(`/projects/${projectKey}/${itemKey}`),
                                error => {message.error(error.response.data)}
                            ).finally(() => this.searchLoading = false)
                        }}
                    />
                    <Dropdown overlay={<Menu>
                        <Menu.Item key="0">
                            <Link to={"/users/" + auth.user.username}>My Profile</Link>
                        </Menu.Item>
                        <Menu.Item key="1">
                            <span onClick={e => updatePasswordModal.open(auth.user.username)}>Update Password</span>
                        </Menu.Item>
                        <Menu.Divider/>
                        <Menu.Item key="2">
                            <a onClick={() => {
                                auth.logout();
                                global.history.push("/login");
                            }}>Logout</a>
                        </Menu.Item>
                    </Menu>} trigger={["click"]} placement="bottomRight">
                        <span className="user-dropdown">
                            <Avatar size="small" style={{backgroundColor: "#87d068"}} icon="user"/>
                            <span className="full-name">{auth.user.fullName}</span>
                        </span>
                    </Dropdown>
                </div>
            }
        </Layout.Header>
    }
}