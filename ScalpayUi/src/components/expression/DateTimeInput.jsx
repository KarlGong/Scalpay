import {Layout, Menu, Input, Icon, DatePicker, TimePicker} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";

@observer
export default class DateTimeInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        onChange: (value) => {},
        defaultValue: ""
    };

    render = () => {
        return <span
            style={this.props.style}
            className={this.props.className}
        >
            <DatePicker/>
            <TimePicker/>
        </span>
    }
}