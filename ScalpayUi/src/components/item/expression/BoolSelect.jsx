import {Layout, Menu, Input, Icon, Radio} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";

@observer
export default class BoolSelect extends Component {
    static defaultProps = {
        style: {},
        className: "",
        onChange: (value) => {},
        defaultValue: true
    };

    render = () => {
        return <Radio.Group
            style={this.props.style}
            className={this.props.className}
            defaultValue={this.props.defaultValue}
            onChange={(e) => this.props.onChange(e.target.value)}>
            <Radio.Button value={true}>True</Radio.Button>
            <Radio.Button value={false}>False</Radio.Button>
        </Radio.Group>
    }
}