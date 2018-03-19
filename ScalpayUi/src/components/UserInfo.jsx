import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, Avatar, Spin, Popover} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import {IndexRoute, hashHistory, Router, Route, Link} from "react-router";
import global from "~/global";

@observer
export default class UserInfo extends Component {
    static defaultProps = {
        username: ""
    };

    @observable loading = false;
    @observable userInfo = {};

    render = () => {
        return <Popover
            title={this.loading ? null : this.userInfo.fullName}
            content={this.loading ? <Spin size="small"/> : this.userInfo.email}
            placement="bottomLeft"
            mouseEnterDelay={0.5}
            onVisibleChange={this.fetchInfo}
        >
            <a onClick={() => global.history.push("/users/" + this.props.username)}>{this.props.username}</a>
        </Popover>
    };

    fetchInfo = () => {
        if (Object.keys(this.userInfo).length) return;
        this.loading = true;
        axios.get("/api/users/" + this.props.username)
            .then((res) => {
                this.userInfo = res.data.data;
            })
            .finally(() => this.loading = false);
    }
}