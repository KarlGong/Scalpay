import {Layout, Menu, Input, Icon, InputNumber} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";

@observer
export default class NumberInput extends Component {
    static defaultProps = {
        style: {},
        onChange: (value) => {},
        defaultValue: 0
    };

    render = () => {
        return <InputNumber placeholder="Input a Number" style={this.props.style}
                            onChange={this.props.onChange} defaultValue={this.props.defaultValue || 0}
                            step={1}/>
    }
}