import {Layout, Menu, Input, Icon, Radio} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";

@observer
export default class BoolSelect extends Component {
    static defaultProps = {
        onChange: (value) => {},
        defaultValue: ""
    };

    render = () => {
        return <Radio.Group defaultValue={this.props.defaultValue} onChange={this.props.onChange()}>
            <Radio.Button value={true}>True</Radio.Button>
            <Radio.Button value={false}>False</Radio.Button>
        </Radio.Group>
    }
}