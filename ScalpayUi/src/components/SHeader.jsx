import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, Avatar, Spin} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import auth from "~/utils/auth";
import {IndexRoute, hashHistory, Router, Route, Link} from "react-router";
import "./SHeader.less";
import PropTypes from "prop-types";

@observer
export default class SHeader extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    render = () => {
        return <Layout.Header className="header">
            <div className="logo"/>
            <Menu
                className="menu"
                mode="horizontal"
                defaultSelectedKeys={["items"]}
            >
                <Menu.Item key="items">
                    <Link to="items">Items</Link>
                </Menu.Item>
            </Menu>
            <div className="right">
                <span>
                    <Input placeholder="Search by item key" suffix={<Icon type="search"/>}/>
                </span>
                <span className="item">
                    <Badge dot>
                        <Icon type="bell" style={{fontSize: "18px"}}/>
                    </Badge>
                </span>

                <Dropdown overlay={<Menu>
                    <Menu.Item key="0">
                        <Link to="projects">Manage Projects</Link>
                    </Menu.Item>
                </Menu>} trigger={["click"]} placement="bottomRight">
                        <span className="item">
                            <Icon type="setting" style={{fontSize: "18px"}}/>
                        </span>
                </Dropdown>
                {auth.user ?
                    <Dropdown overlay={<Menu>
                        <Menu.Item key="0">
                            <Link to="profile">Profile</Link>
                        </Menu.Item>
                        <Menu.Divider/>
                        <Menu.Item key="1">
                            <a onClick={() => {
                                auth.logout();
                                this.context.router.push("/login");
                            }}>Logout</a>
                        </Menu.Item>
                    </Menu>} trigger={["click"]} placement="bottomRight">
                        <span className="item">
                            <Avatar size="small" style={{backgroundColor: "#87d068"}} icon="user"/>
                            <span style={{marginLeft: "5px"}}>{auth.user.fullName}</span>
                        </span>
                    </Dropdown>
                    : null}
            </div>
        </Layout.Header>
    }
}