import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";

@observer
export default class StringInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        onChange: (value) => {},
        defaultValue: ""
    };

    render = () => {
        return <Input
            style={this.props.style}
            className={this.props.className}
            placeholder="String"
            onChange={(e) => this.props.onChange(e.target.value)}
            defaultValue={this.props.defaultValue || ""}/>
    }
}