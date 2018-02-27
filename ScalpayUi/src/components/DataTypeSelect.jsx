import {Layout, Menu, Input, Icon, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {DataType} from "~/utils/store";

@observer
export default class DataTypeSelect extends Component {
    render = () => {
        return <Select
            showSearch
            placeholder="Select a Data Type"
            optionFilterProp="children"
            onChange={this.onChange}
        >
            {
                Object.entries(DataType).map(([name, value]) => {
                    return <Select.Option key={value} value={value}>{name}</Select.Option>
                })
            }
        </Select>
    }
}