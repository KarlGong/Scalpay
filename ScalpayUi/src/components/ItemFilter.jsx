import {Layout, Menu, Input, Icon, Button, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {ItemType} from "~/utils/store";
import ProjectFilter from "~/components/ProjectFilter";
import debounce from "lodash.debounce";
import "./ItemFilter.less";

@observer
export default class ItemFilter extends Component {
    project = null;
    itemType = null;

    render = () => {
        return <div className="item-filter">
            <ProjectFilter className="filter select" onChange={(value) => this.project = value} />
            <Select
                className="filter select"
                allowClear
                showSearch
                placeholder="All Types"
                dropdownMatchSelectWidth={false}
                onChange={(value) => this.itemType = value}
            >
                {Object.keys(ItemType).map(type =>
                    <Select.Option key={ItemType[type]}>{type}</Select.Option>
                )}
            </Select>
            <Input className="filter input" placeholder="Search by item key/name/description"/>
            <Button type="primary">Search</Button>
        </div>
    }
}