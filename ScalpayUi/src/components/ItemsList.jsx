import {Layout, Menu, Input, Icon, Form, Select, Radio, Card} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import "~/components/ItemsList.less";

@observer
export default class ItemsList extends Component {
    render = () => {
        return <Layout className="items-list">
            <div className="filter">
                <Select
                    showSearch
                    className="project"
                    placeholder="Select a project"
                    optionFilterProp="children"
                    // onChange={handleChange}
                    // onFocus={handleFocus}
                    // onBlur={handleBlur}
                >
                    <Select.Option key={"a"}>{"aaa"}</Select.Option>
                    <Select.Option key={"b"}>{"bbb"}</Select.Option>
                    <Select.Option key={"d"}>{"ccc"}</Select.Option>
                    <Select.Option key={"c"}>{"ddd"}</Select.Option>
                </Select>
                <Radio.Group defaultValue="config" className="type">
                    <Radio.Button value="config">Config</Radio.Button>
                    <Radio.Button value="word">Word</Radio.Button>
                    <Radio.Button value="lookup">Lookup</Radio.Button>
                </Radio.Group>
            </div>
            <div className="list">
                {["aaa", "bbb","aaa", "bbb","aaa", "bbb","aaa", "bbb"].map(i => <div className="item">
                    {i}
                </div>)
                }
            </div>
        </Layout>
    }
}