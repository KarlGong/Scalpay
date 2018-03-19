import {Layout, Menu, Input, Icon, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import guid from "~/utils/guid";

@observer
export default class VersionSelect extends Component {
    static defaultProps = {
        version: null,
        onChange: (version) => {}
    };

    version = "" + this.props.version;
    @observable resetKey = guid();

    componentWillReceiveProps = (props) => {
        if (this.version !== "" + props.version){
            this.version = "" + props.version;
            this.resetKey = guid();
        }
    };

    render = () => {
        return <Select
            key={this.resetKey}
            defaultValue={this.version}
            dropdownMatchSelectWidth={false}
            filterOption={false}
            onChange={this.props.onChange}
        >
            {
                Array(this.props.version).fill(0).map((x, index) => {
                    let i = index + 1;
                    return <Select.Option key={i}>
                        {(this.props.version === i ? "Current " : "") + "v" + i}
                    </Select.Option>}
                ).reverse()
            }
        </Select>
    }
}