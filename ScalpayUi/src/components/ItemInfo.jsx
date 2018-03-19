import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, Avatar, Spin} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import auth from "~/utils/auth";
import {IndexRoute, hashHistory, Router, Route, Link} from "react-router";
import global from "~/global";
import ProjectInfo from "./ProjectInfo";

@observer
export default class ItemInfo extends Component {
    static defaultProps = {
        itemKey: "",
        version: null
    };

    render = () => {
        if (this.props.version) {
            return <a onClick={() => global.history.push("/items/" + this.props.itemKey + "/v" + this.props.version)}>
                {this.props.itemKey + ":v" + this.props.version}</a>
        } else {
            return <a onClick={() => global.history.push("/items/" + this.props.itemKey)}>
                {this.props.itemKey}</a>
        }
    }
}