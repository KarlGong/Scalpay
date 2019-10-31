import {Popover, Spin} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import global from "~/global";

@observer
export default class ProjectInfo extends Component {
    static defaultProps = {
        project: {}
    };

    render = () => {
        return <span>
            <a onClick={() => global.history.push(`/projects/${this.props.project.projectKey}`)}>
                {this.props.project.projectKey}
            </a>
        </span>
    };
}