import {Layout, Menu, Input, Icon, DatePicker, TimePicker } from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";

@observer
export default class DateTimeInput extends Component {
    static defaultProps = {
        onChange: (value) => {},
        defaultValue: ""
    };

    render = () => {
        return <span>
            <DatePicker/>
            <TimePicker/>
        </span>
    }
}