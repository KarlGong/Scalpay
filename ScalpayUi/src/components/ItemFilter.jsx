import {Layout, Menu, Input, Icon, Button, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {ItemType} from "~/utils/store";
import ProjectSelect from "~/components/ProjectSelect";
import debounce from "lodash.debounce";
import "./ItemFilter.less";
import ItemTypeSelect from "~/components/ItemTypeSelect";

@observer
export default class ItemFilter extends Component {
    project = null;
    itemType = null;

    render = () => {
        return <div className="item-filter">
            <ProjectSelect className="filter select" onChange={(value) => this.project = value} />
            <ItemTypeSelect/>
            <Input className="filter input" placeholder="Search by item key/name/description"/>
            <Button type="primary">Search</Button>
        </div>
    }
}