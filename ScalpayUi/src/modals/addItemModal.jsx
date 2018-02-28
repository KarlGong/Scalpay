import {Layout, Menu, Input, Icon, Modal, Form, Radio, Divider, Row, Col} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {render, unmountComponentAtNode} from "react-dom";
import ProjectSelect from "~/components/ProjectSelect";
import {ItemType} from "~/utils/store";
import ConfigView from "~/components/item/ConfigView";
import LookupView from "~/components/item/LookupView";
import WordView from "~/components/item/WordView";
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

    @observable item = {
        projectKey: null,
        itemKey: null,
        name: null,
        description: null,
        type: ItemType.Config,
        mode: null,
        parameterInfos: [],
        resultDataType: null,
        rules: []
    };
    @observable visible = true;

    render = () => {
        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 16
            },
        };
        const view = {
            [ItemType.Config]: <ConfigView item={this.item}/>,
            [ItemType.Lookup]: <LookupView item={this.item}/>,
            [ItemType.Word]: <WordView item={this.item}/>
        }[this.item.type];

        return <Modal
            title="Add Item"
            okText="Add Item"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            width={800}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Form>
                <Form.Item label="Project"
                           {...formItemLayout}
                >
                    <ProjectSelect style={{width: "200px"}}/>
                </Form.Item>
                <Form.Item label="Item Type"
                           {...formItemLayout}
                >
                    <ItemTypeSelect style={{width: "200px"}}
                                    defaultValue={this.item.type}
                                    onChange={(itemType) => this.item.type = itemType}
                    />
                </Form.Item>
            </Form>
            <Divider/>
            {view}
        </Modal>
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};