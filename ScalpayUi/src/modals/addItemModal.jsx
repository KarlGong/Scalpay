import {Layout, Menu, Input, Icon, Modal, Form, Radio, Divider} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {render, unmountComponentAtNode} from "react-dom";
import ProjectSelect from "~/components/ProjectSelect";
import {ItemType} from "~/utils/store";
import RawConfigView from "~/components/item/RawConfigView";
import ItemTypeSelect from "~/components/ItemTypeSelect";

function open(expression, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(<AddItemModal expression={expression} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

@observer
class AddItemModal extends Component {
    static defaultProps = {
        onSuccess: (project) => {},
        afterClose: () => {}
    };

    item = {
        projectKey: null,
        itemKey: null,
        name: null,
        description: null,
        itemType: null,
        configMode: null,
        paramsDataTypes: {},
        resultDataType: null,
        rules: []
    };
    @observable visible = true;

    render = () => {
        return <Modal
            title="Add Item"
            okText="Add Item"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            width={1200}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Form>
                <Form.Item label="Project"
                           >
                    <ProjectSelect style={{width: "150px"}}/>
                </Form.Item>
                <Form.Item label="Item Key"
                >
                    <Input style={{width: "150px"}}/>
                </Form.Item>
                <Form.Item label="Item Name"
                           >
                    <Input style={{width: "150px"}}/>
                </Form.Item>
                <Form.Item label="Type"
                           >
                    <ItemTypeSelect style={{width: "150px"}}/>
                </Form.Item>
                <Form.Item label="Description">
                    <Input.TextArea
                        rows={6}
                        placeholder=""
                        onChange={(e) => {
                            this.project.description = e.target.value;
                        }}/>
                </Form.Item>
            </Form>
            <Divider dashed>Configuration</Divider>
            <RawConfigView/>
        </Modal>
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};