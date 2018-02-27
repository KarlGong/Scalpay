import {Layout, Menu, Input, Icon, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {ItemType} from "~/utils/store";

@observer
export default class ItemTypeSelect extends Component {
    static defaultProps = {
        onChange: (itemType) => {},
        style: {},
        className: ""
    };

    render = () => {
        return <span>
            <Select
                allowClear
                dropdownMatchSelectWidth={false}
                onChange={this.props.onChange}
                style={this.props.style}
                className={this.props.className}
            >
                {Object.entries(ItemType).map(([name, value]) =>
                    <Select.Option key={value}>{name}</Select.Option>
                )}
            </Select>
        </span>
    }
}