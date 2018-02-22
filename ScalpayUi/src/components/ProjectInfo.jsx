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
export default class ProjectInfo extends Component {
    static defaultProps = {
        project: {}
    };

    render = () => {
        return <a onClick={() => global.history.push("/projects/" + this.props.project.projectKey)} title={this.props.project.projectKey}>{this.props.project.name}</a>
    }
}