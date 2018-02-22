import {Layout, Menu, Input, Icon, Button, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import ProjectFilter from "~/components/ProjectFilter";

@observer
export default class ItemFilter extends Component {
    project = null;

    render = () => {
        return <div>
            <ProjectFilter style={{width: "150px"}} onChange={(value) => this.project = value} />
            {/*<Select>*/}
                {/*<Select.Option></Select.Option>*/}
            {/*</Select>*/}
            <Button type="primary">Search</Button>
        </div>
    }
}