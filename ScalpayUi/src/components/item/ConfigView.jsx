import {Layout, Menu, Input, Icon, Collapse, Button, Row, Col, Form, Radio, Tag} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import StringInput from "./expression/StringInput";
import DataTypeSelect from "../DataTypeSelect";
import ExpressionView from "~/components/item/expression/ExpressionView";
import DragListView from "react-drag-listview";
import {ItemMode} from "~/utils/store";
import guid from "~/utils/guid";
import "./ConfigView.less";

@observer
export default class RawConfigView extends Component {

    static defaultProps = {
        item: {
            projectKey: null,
            itemKey: null,
            name: null,
            description: null,
            type: null,
            mode: null,
            parameterInfos: [],
            resultDataType: null,
            rules: []
        }
    };

    render = () => {
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 20
            },
        };
        return <div className="config-view">
            <Radio.Group
                style={{float: "right"}}
                onChange={(value) => this.props.item.mode = value}
                defaultValue={this.props.item.mode}>
                <Radio.Button value={ItemMode.ConfigProperty}>Property</Radio.Button>
                <Radio.Button value={ItemMode.ConfigRaw}>Raw</Radio.Button>
            </Radio.Group>
            <Collapse
                style={{clear: "both"}}
                bordered={false}
                accordion
                defaultActiveKey={["basic"]}>
                <Collapse.Panel header="Basic" key="basic">
                    <Form>
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
                                this.props.item.parameterInfos.map((paraInfo, index) => {
                                    return <div className="parameter" key={paraInfo.key}>
                                        <Input defaultValue={untracked(() => paraInfo.name)} className="name"/>
                                        <DataTypeSelect className="data-type"/>
                                        <span onClick={() => this.props.item.parameterInfos.splice(index, 1)}>
                                            <Icon type="minus-circle-o" className="delete"/>
                                        </span>
                                    </div>
                                })
                            }
                            <Button
                                icon="plus"
                                type="dashed"
                                className="add-parameter"
                                onClick={() => this.props.item.parameterInfos.push({key: guid()})}
                            >Add Parameter</Button>
                        </Form.Item>
                        <Form.Item label="Result Data Type"
                                   {...formItemLayout}
                        >
                            <DataTypeSelect style={{width: "150px"}}/>
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
                    <DragListView onDragEnd={() => {}}>
                        {
                            this.props.item.rules.map((rule) => {
                                return <Row key={rule.key} gutter={24} className="rule">
                                    <Col span={18} className="center">
                                        <ExpressionView/>
                                    </Col>
                                    <Col span={6} className="center">
                                        <ExpressionView/>
                                    </Col>
                                </Row>
                            })
                        }
                    </DragListView>
                    <Row gutter={24} className="rule">
                        <Col span={24}>
                            <Button icon="plus" type="dashed" className="rule-add">Add Rule</Button>
                        </Col>
                    </Row>
                    <Row gutter={24} className="rule-default">
                        <Col span={18} className="center">
                            <b>Default</b>
                        </Col>
                        <Col span={6} className="center">
                            <ExpressionView/>
                        </Col>
                    </Row>
                </Collapse.Panel>
            </Collapse>
        </div>
    };
}