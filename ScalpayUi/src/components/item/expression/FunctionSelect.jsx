import {Layout, Menu, Input, Icon, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {Func} from "~/utils/store";

@observer
export default class FunctionSelect extends Component {
    static defaultProps = {
        returnType: ""
    };

    render = () => {
        return <Select
            showSearch
            placeholder="Select a Function"
            optionFilterProp="children"
            onChange={handleChange}
        >
            {
                Func[this.props.returnType].map((func) => {
                    return <Select.Option value={func.name}>{func.displayName}</Select.Option>
                })
            }

        </Select>
    }
}