import {Layout, Menu, Input, Form} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {Modal} from "antd/lib/index";
import {DefaultExp} from "~/utils/store";
import DataTypeSelect from "~/components/DataTypeSelect";
import guid from "~/utils/guid";
import ExpressionView from "~/components/expression/ExpressionView";

@observer
export default class PropertyPanel extends Component {
    static defaultProps = {
        item: {} // observable
    };

    item = this.props.item;
    @observable resultDataTypeResetKey = guid();

    render = () => {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            },
        };

        return <div>
            <Form>
                <Form.Item label="Result Data Type" {...formItemLayout}>
                    <DataTypeSelect
                        key={this.resultDataTypeResetKey}
                        style={{width: "150px"}}
                        defaultValue={untracked(() => this.item.resultDataType)}
                        onChange={(dataType) => {
                            Modal.confirm({
                                title: "Are you sure to change the result data type?",
                                content: "The result expression will be reset.",
                                okText: "Change",
                                okType: "danger",
                                cancelText: "No",
                                onOk: () => {
                                    this.item.resultDataType = dataType;
                                    this.item.defaultResult = DefaultExp[dataType];
                                },
                                onCancel: () => {
                                    this.resultDataTypeResetKey = guid();
                                },
                            });
                        }}/>
                </Form.Item>
                <Form.Item label="Result" {...formItemLayout}>
                    <ExpressionView
                        allowEdit
                        topLevel
                        expression={this.item.defaultResult}
                        item={this.item}
                        onChange={(exp) => this.item.defaultResult = exp}
                    />
                </Form.Item>
            </Form>
        </div>
    }
}