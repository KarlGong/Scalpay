import {Popover, Spin} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import global from "~/global";
import "./ProjectInfo.less";

@observer
export default class ProjectInfo extends Component {
    static defaultProps = {
        project: {}
    };

    render = () => {
        return <span className="project-info">
            <a onClick={() => global.history.push("/projects/" + this.props.project.projectKey)}>
                {this.props.project.name}
            </a>
            (<span className="name">{this.props.project.projectKey}</span>)
        </span>
    };

}