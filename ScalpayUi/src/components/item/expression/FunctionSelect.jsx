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
        returnType: ""
    };

    render = () => {
        return <Select
            style={this.props.style}
            className={this.props.className}
            showSearch
            placeholder="Function"
            optionFilterProp="children"
            onChange={() => {}}
        >
            {
                Func[this.props.returnType].map((func) => {
                    return <Select.Option value={func.name} key={func.name}>{func.displayName}</Select.Option>
                })
            }

        </Select>
    }
}