import {Layout, Menu, Input, Icon, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {Func} from "~/utils/store";

@observer
export default class VariableSelect extends Component {
    static defaultProps = {
        style: {},
        className: "",
        defaultValue: "",
        variables: [],
        onChange: (variableName) => {}
    };

    render = () => {
        return <Select
            style={this.props.style}
            className={this.props.className}
            defaultValue={this.props.defaultValue}
            showSearch
            placeholder="Variable"
            dropdownMatchSelectWidth={false}
            onChange={this.props.onChange}
        >
            {
                this.props.variables.map((variable) =>
                    <Select.Option value={variable.name} key={variable.name}>{variable.name}</Select.Option>
                )
            }
        </Select>
    }
}