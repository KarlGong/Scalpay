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
export default class ProjectInfo extends Component {
    static defaultProps = {
        projectKey: "",
        version: null
    };

    @observable loading = false;
    @observable projectInfo = {};

    render = () => {
        return <Popover
            title={this.loading? null: this.projectInfo.name}
            content={this.loading? <Spin size="small"/>: this.projectInfo.description}
            placement="bottomLeft"
            mouseEnterDelay={0.5}
            onVisibleChange={this.fetchInfo}
        >
            <a onClick={() => global.history.push("/projects/" + this.props.projectKey + (this.props.version ? "/v" + this.props.version : ""))}>
                {this.props.projectKey + (this.props.version ? ":v" + this.props.version : "")}</a>
        </Popover>
    };

    fetchInfo = () => {
        if (Object.keys(this.projectInfo).length) return;
        this.loading = true;
        axios.get("/api/projects/" + this.props.projectKey + (this.props.version ? "/v" + this.props.version : ""))
            .then((res) => {
                this.projectInfo = res.data.data;
            })
            .finally(() => this.loading = false);
    }
}