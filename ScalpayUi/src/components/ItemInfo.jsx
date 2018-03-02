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
        item: {}
    };

    render = () => {
        return <span>
            <ProjectInfo project={this.props.item.project}/>
            <span>/</span>
            <a onClick={() => global.history.push("/items/" + this.props.item.itemKey)}
               title={this.props.item.itemKey}>{this.props.item.name}</a>
        </span>;
    }
}