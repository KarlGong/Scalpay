import {Popover, Spin} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import global from "~/global";

@observer
export default class ItemInfo extends Component {
    static defaultProps = {
        item: {}
    };

    render = () => {
        return <span>
            <a onClick={() => global.history.push(`/projects/${this.props.item.projectKey}/${this.props.item.itemKey}`)}>
                {this.props.item.itemKey}
            </a>
        </span>
    };
}