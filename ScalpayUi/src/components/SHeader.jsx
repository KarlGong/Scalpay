import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, Avatar} from "antd";
import React, {Component} from "react";
import { IndexRoute, hashHistory, Router, Route, Link } from "react-router";
import "./SHeader.less";

export default class SHeader extends Component {
    render = () => {
        return <Layout.Header className="header">
            <div className="logo"/>
            <Menu
                className="menu"
                mode="horizontal"
                defaultSelectedKeys={["items"]}
            >
                <Menu.Item key="items">
                    <Link to="/items">Item</Link>
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
                        <Link to="/projects">Manage Projects</Link>
                    </Menu.Item>
                </Menu>} trigger={["click"]} placement="bottomRight">
                        <span className="item">
                            <Icon type="setting" style={{fontSize: "18px"}}/>
                        </span>
                </Dropdown>

                <Dropdown overlay={<Menu>
                    <Menu.Item key="0">
                        <Link to="/profile">Profile</Link>
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item key="1">
                        <a href="/profile">Logout</a>
                    </Menu.Item>
                </Menu>} trigger={["click"]} placement="bottomRight">
                        <span className="item">
                            <Avatar size="small" style={{backgroundColor: "#87d068"}} icon="user"/>
                            &nbsp;
                            <span>Karl Gong</span>
                        </span>
                </Dropdown>
            </div>
        </Layout.Header>
    }
}