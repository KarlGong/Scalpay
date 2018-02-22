import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, Avatar, Spin} from "antd";
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
        user: {}
    };

    render = () => {
        return <a onClick={() => global.history.push("/users/" + this.props.user.username)} title={this.props.user.email}>{this.props.user.fullName}</a>
    }
}