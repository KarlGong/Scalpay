import {Layout, Menu, Input, Icon, Form, Select, Radio} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";

@observer
export default class ItemsList extends Component {
    render = () => {
        return <Layout style={{padding: "5px"}}>
            <Layout>
                <table>
                    <tbody>
                    <tr>
                        <td>Project</td>
                        <td>
                            <Select
                                mode="combobox"
                                style={{width: "200px"}}
                                onChange={this.handleChange}
                                placeholder="Project Name or Key"
                            >
                                <Select.Option key={"fafa"}>{"aaa"}</Select.Option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>Item</td>
                        <td>
                            <Input
                                style={{width: 200}}
                                placeholder="input here"
                            />
                        </td>
                    </tr>
                    </tbody>

                </table>
                <Radio.Group defaultValue="config">
                    <Radio.Button value="config">Config</Radio.Button>
                    <Radio.Button value="word">Word</Radio.Button>
                    <Radio.Button value="lookup">Lookup</Radio.Button>
                </Radio.Group>
            </Layout>
        </Layout>
    }
}