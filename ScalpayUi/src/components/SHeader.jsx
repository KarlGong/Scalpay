import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, Avatar, Spin, Button} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import {IndexRoute, hashHistory, Router, Route, Link} from "react-router";
import global from "~/global";
import addItemConfigModal from "~/modals/addItemConfigModal";
import "./SHeader.less";
import logo from "~/assets/imgs/logo.png";

@observer
export default class SHeader extends Component {

    render = () => {
        return <Layout.Header className="header">
            <div className="wrapper">
                <div className="left">
                    <div className="logo item">
                        <Link to="/"><img src={logo}/></Link>
                    </div>
                    <div className="item menu">
                        <span onClick={() => global.history.push("/items")}>Items</span>
                    </div>
                    <div className="item menu">
                        <span>Statistics</span>
                    </div>
                    {auth.hasPrivileges(Privilege.ItemAdd) ?
                        <div className="item">
                            <Dropdown
                                trigger={["click"]}
                                overlay={
                                    <Menu onClick={(e) => {
                                        if (e.key === "config") {
                                            addItemConfigModal.open()
                                        }
                                    }}>
                                        <Menu.Item key="config">Config Item</Menu.Item>
                                        <Menu.Item key="word">Word Item</Menu.Item>
                                    </Menu>
                                }>
                                <Button type="primary">Add</Button>
                            </Dropdown>
                        </div>
                        : null
                    }
                </div>
                <div className="right">
                    <span className="item">
                        <Input placeholder="Search" suffix={<Icon type="search"/>}/>
                    </span>
                    <span className="item dropdown">
                        <Badge dot>
                            <Icon type="bell" style={{fontSize: "18px"}}/>
                        </Badge>
                    </span>
                    <Dropdown overlay={<Menu>
                        <Menu.Item key="0">
                            <Link to="/projects">View Projects</Link>
                        </Menu.Item>
                        {auth.hasPrivileges(Privilege.UserManage) ?
                            <Menu.Item key="1">
                                <Link to="/users">View Users</Link>
                            </Menu.Item>
                            : null
                        }
                    </Menu>} trigger={["click"]} placement="bottomRight">
                        <span className="item dropdown">
                            <Icon type="setting" style={{fontSize: "18px"}}/>
                        </span>
                    </Dropdown>
                    {auth.user ?
                        <Dropdown overlay={<Menu>
                            <Menu.Item key="0">
                                <Link to={"/users/" + auth.user.username}>Profile</Link>
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="1">
                                <a onClick={() => {
                                    auth.logout();
                                    global.history.push("/login");
                                }}>Logout</a>
                            </Menu.Item>
                        </Menu>} trigger={["click"]} placement="bottomRight">
                        <span className="item dropdown">
                            <Avatar size="small" style={{backgroundColor: "#87d068"}} icon="user"/>
                            <span style={{marginLeft: "5px"}}>{auth.user.fullName}</span>
                        </span>
                        </Dropdown>
                        : null}
                </div>
            </div>
        </Layout.Header>
    }
}