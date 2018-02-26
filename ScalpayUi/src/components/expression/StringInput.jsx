import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";

@observer
export default class StringInput extends Component {
    static defaultProps = {
        style: {},
        onChange: (value) => {},
        defaultValue: ""
    };

    render = () => {
        return <Input placeholder="Input a String" style={this.props.style}
                      onChange={this.props.onChange} defaultValue={this.props.defaultValue || ""}/>
    }
}