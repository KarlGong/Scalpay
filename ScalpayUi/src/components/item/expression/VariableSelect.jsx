import {Layout, Menu, Input, Icon, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {Func} from "~/utils/store";

@observer
export default class VariableSelect extends Component {
    static defaultProps = {
        variables: {}
    };

    render = () => {
        return <Select
            showSearch
            placeholder="Select a Variable"
            dropdownMatchSelectWidth={false}
            onChange={handleChange}
        >
            {
                this.props.variables.map((name, returnType) =>
                    <Select.Option value={name}>{name}</Select.Option>
                )
            }
        </Select>
    }
}