import {Layout, Menu, Input, Icon, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {Func} from "~/utils/store";

@observer
export default class FunctionSelect extends Component {
    static defaultProps = {
        style: {},
        className: "",
        returnType: "",
        defaultValue: undefined,
        onChange: (functionName) => {}
    };

    render = () => {
        return <Select
            style={this.props.style}
            className={this.props.className}
            showSearch
            placeholder="Function"
            dropdownMatchSelectWidth={false}
            optionFilterProp="children"
            defaultValue={this.props.defaultValue}
            onChange={this.props.onChange}
        >
            {
                Object.entries(Func[this.props.returnType]).map(([name, func]) => {
                    return <Select.Option value={name} key={name}>{func.displayName}</Select.Option>
                })
            }

        </Select>
    }
}