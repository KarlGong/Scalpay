import {Layout, Menu, Input, Icon, Modal, Form, Radio, Divider, Row, Col, Collapse, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {render, unmountComponentAtNode} from "react-dom";
import ProjectSelect from "~/components/ProjectSelect";
import {DataType, ItemType, ItemConfigMode} from "~/utils/store";
import ItemTypeSelect from "~/components/ItemTypeSelect";
import DataTypeSelect from "~/components/DataTypeSelect";
import ExpressionView from "~/components/item/expression/ExpressionView";
import DragListView from "react-drag-listview";
import guid from "~/utils/guid";
import "./addItemConfigModal.less";

function open(expression, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(<AddItemConfigModal expression={expression} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

@observer
class AddItemConfigModal extends Component {
    static defaultProps = {
        onSuccess: (project) => {},
        afterClose: () => {}
    };

    @observable item = {
        projectKey: null,
        itemKey: null,
        name: null,
        description: null,
        type: null,
        mode: ItemConfigMode.Property,
        parameterInfos: [],
        resultDataType: DataType.String,
        rules: [{
            condition: null,
            result: {return: DataType.String}
        }]
    };
    @observable visible = true;

    render = () => {
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 20
            },
        };

        let rules = this.item.rules.filter((rule) => rule.condition !== null);
        let defaultRule = this.item.rules.filter((rule) => rule.condition === null)[0];

        return <Modal
            title="Add Config Item"
            okText="Add Config Item"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            width={800}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <div className="add-item-config">
                <div style={{float: "right"}}>
                    <Radio.Group
                        onChange={(value) => this.item.mode = value}
                        defaultValue={this.item.mode}>
                        <Radio.Button value={ItemConfigMode.Property}>Property</Radio.Button>
                        <Radio.Button value={ItemConfigMode.Raw}>Raw</Radio.Button>
                    </Radio.Group>
                </div>
                <Collapse
                    style={{clear: "both"}}
                    bordered={false}
                    accordion
                    defaultActiveKey={["basic"]}>
                    <Collapse.Panel header="Basic" key="basic">
                        <Form>
                            <Form.Item label="Project"
                                       {...formItemLayout}
                            >
                                <ProjectSelect style={{width: "300px"}}/>
                            </Form.Item>
                            <Form.Item label="Item Key"
                                       {...formItemLayout}
                            >
                                <Input style={{width: "500px"}}/>
                            </Form.Item>
                            <Form.Item label="Name"
                                       {...formItemLayout}
                            >
                                <Input style={{width: "500px"}}
                                />
                            </Form.Item>
                            <Form.Item label="Description"
                                       {...formItemLayout}
                            >
                                <Input.TextArea
                                    style={{width: "500px"}}
                                    rows={4}
                                />
                            </Form.Item>
                        </Form>
                    </Collapse.Panel>
                    <Collapse.Panel header="Parameters & Result" key="parameters-result">
                        <Form>
                            <Form.Item label="Parameters"
                                       {...formItemLayout}
                            >
                                {
                                    this.item.parameterInfos.map((paramInfo, index) => {
                                        return <div className="parameter" key={paramInfo.key}>
                                            <Input
                                                className="name"
                                                defaultValue={untracked(() => paramInfo.name)}
                                                onChange={(e) => paramInfo.name = e.target.value}
                                            />
                                            <DataTypeSelect
                                                className="data-type"
                                                defaultValue={untracked(() => paramInfo.dataType)}
                                                onChange={(value) => paramInfo.dataType = value}
                                            />
                                            <span onClick={() => this.item.parameterInfos.splice(index, 1)}>
                                            <Icon type="minus-circle-o" className="delete"/>
                                        </span>
                                        </div>
                                    })
                                }
                                <Button
                                    icon="plus"
                                    type="dashed"
                                    className="add-parameter"
                                    onClick={() => this.item.parameterInfos.push({
                                        key: guid(),
                                        dataType: DataType.String
                                    })}
                                >Add Parameter</Button>
                            </Form.Item>
                            <Form.Item label="Result Data Type"
                                       {...formItemLayout}
                            >
                                <DataTypeSelect style={{width: "150px"}} onChange={(value) => {
                                    this.item.resultDataType = value;
                                    this.item.rules.clear();
                                    this.item.rules.push({
                                        condition: null,
                                        result: {return: value}
                                    });
                                }}/>
                            </Form.Item>
                        </Form>
                    </Collapse.Panel>
                    <Collapse.Panel header="Rules" key="rules">
                        <Row gutter={24} className="rule-header">
                            <Col span={18} className="center">
                                <b>Condition</b>
                            </Col>
                            <Col span={6} className="center">
                                <b>Result</b>
                            </Col>
                        </Row>
                        <DragListView onDragEnd={() => {
                        }}>
                            {
                                rules.map((rule) => {
                                    return <Row key={rule.key} gutter={24} className="rule">
                                        <Col span={18} className="center">
                                            <ExpressionView expression={untracked(() => rule.condition)}
                                                            item={untracked(() => this.item)}
                                                            onChange={(exp) => rule.condition = exp}/>
                                        </Col>
                                        <Col span={6} className="center">
                                            <ExpressionView expression={untracked(() => rule.result)}
                                                            item={untracked(() => this.item)}
                                                            onChange={(exp) => rule.result = exp}/>
                                        </Col>
                                    </Row>
                                })
                            }
                        </DragListView>
                        <Row gutter={24} className="rule">
                            <Col span={24}>
                                <Button icon="plus" type="dashed" className="rule-add"
                                        onClick={() => this.item.rules.push(
                                            {
                                                key: guid(),
                                                condition: {
                                                    return: DataType.Bool
                                                },
                                                result: {
                                                    return: this.item.resultDataType
                                                }
                                            })}>Add Rule</Button>
                            </Col>
                        </Row>
                        <Row gutter={24} className="rule-default">
                            <Col span={18} className="center">
                                <b>Default</b>
                            </Col>
                            <Col span={6} className="center">
                                <ExpressionView
                                    expression={untracked(() => defaultRule.result)}
                                    item={this.item}
                                    onChange={(exp) => defaultRule.result = exp}
                                />
                            </Col>
                        </Row>
                    </Collapse.Panel>
                </Collapse>
            </div>
        </Modal>
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};