import {Layout, Menu, Input, Icon, InputNumber} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";

@observer
export default class DurationInput extends Component {
    static defaultProps = {
        onChange: (value) => {},
        defaultValue: ""
    };

    render = () => {
        return <span>
            <InputNumber min={0} precision={0} step={1}/> Hours
            <InputNumber min={0} max={59} precision={0} step={10}/> Minutes
            <InputNumber min={0} max={59} precision={0} step={10}/> Seconds
            <InputNumber min={0} max={999} precision={0} step={100}/> Milliseconds
        </span>
    }
}