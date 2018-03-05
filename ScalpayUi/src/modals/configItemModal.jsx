import {Input, Icon, Modal, Form, Radio, Row, Col, Collapse, Button, message, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import {render, unmountComponentAtNode} from "react-dom";
import ProjectSelect from "~/components/ProjectSelect";
import {DataType, ItemType, ConfigItemMode, DefaultExp} from "~/utils/store";
import DataTypeSelect from "~/components/DataTypeSelect";
import ExpressionView from "~/components/expression/ExpressionView";
import DragListView from "react-drag-listview";
import guid from "~/utils/guid";
import "./configItemModal.less";
import ItemInfo from "~/components/ItemInfo";
import Validator from "~/utils/Validator";

function add(onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<EditConfigItemModal addMode onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

function edit(item, onSuccess) {
    const hide = message.loading("Loading item...", 0);

    const target = document.createElement("div");
    document.body.appendChild(target);

    axios.get("/api/items/config/" + item.itemKey)
        .then(res =>
            render(<EditConfigItemModal item={res.data} onSuccess={onSuccess} afterClose={() => {
                unmountComponentAtNode(target);
                target.remove()
            }}/>, target))
        .finally(() => hide());
}

function del(item, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<DeleteConfigItemModal item={item} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}


@observer
class EditConfigItemModal extends Component {
    static defaultProps = {
        item: {
            projectKey: null,
            itemKey: "config.null.", // the item key init format
            name: null,
            description: null,
            mode: ConfigItemMode.Property,
            parameterInfos: [],
            resultDataType: DataType.String,
            rules: [{
                key: guid(),
                result: DefaultExp.String
            }]
        },
        addMode: false,
        onSuccess: (item) => {},
        afterClose: () => {}
    };

    @observable loading = false;
    @observable visible = true;
    parameterValidators = [];

    constructor(props) {
        super(props);
        this.item = observable(Object.assign({}, this.props.item));
        this.item.parameterInfos.map(p => p.key = p.key || guid());
        this.item.rules.map(r => r.key = r.key || guid());

        this.basicValidator = new Validator(this.item, {
            projectKey: {required: true, message: "project is required"},
            itemKey: (rule, value, callback, source, options) => {
                let errors = [];
                if (!value.split(".").slice(2).join(".")) {
                    errors.push(new Error("item key is required"));
                }
                if (!/^config\.[^.]+?\.[a-zA-Z0-9-_.]+?$/.test(value)) {
                    errors.push(new Error("item key can only contain alphanumeric characters, - , _ and ."))
                }
                callback(errors);
            },
            name: {required: true}
        });
    }

    render = () => {
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 20
            },
        };


        let rules = this.item.rules.filter((rule) => rule.condition);
        let defaultRule = this.item.rules.filter((rule) => !rule.condition)[0];

        return <Modal
            title={this.props.addMode ? "Add Config Item" : "Edit Config Item"}
            okText={this.props.addMode ? "Add Config Item" : "Update Config Item"}
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            width={800}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <div className="config-item-modal">
                <div style={{float: "right"}}>
                    <Radio.Group
                        onChange={(value) => this.item.mode = value}
                        defaultValue={this.item.mode}>
                        <Radio.Button value={ConfigItemMode.Property}>Property</Radio.Button>
                        <Radio.Button value={ConfigItemMode.Raw}>Raw</Radio.Button>
                    </Radio.Group>
                </div>
                <Collapse
                    style={{clear: "both"}}
                    bordered={false}
                    accordion
                    defaultActiveKey={["basic"]}>
                    <Collapse.Panel
                        header="Basic"
                        key="basic"
                        className={cs("panel", "basic-panel", {"error": this.basicValidator.hasError()})}>
                        <Form>
                            <Form.Item label="Project"
                                       {...formItemLayout}
                                       validateStatus={this.basicValidator.getResult("projectKey").status}
                                       help={this.basicValidator.getResult("projectKey").message}
                            >
                                <ProjectSelect
                                    style={{width: "300px"}}
                                    disabled={!this.props.addMode}
                                    defaultValue={untracked(() => this.item.projectKey)}
                                    onChange={(value) => {
                                        this.item.projectKey = value;
                                        this.basicValidator.resetResult("projectKey");
                                    }}
                                    onBlur={() => this.basicValidator.validate("projectKey")}
                                />
                            </Form.Item>
                            <Form.Item label="Item Key"
                                       {...formItemLayout}
                                       validateStatus={this.basicValidator.getResult("itemKey").status}
                                       help={this.basicValidator.getResult("itemKey").message}
                            >
                                <Input
                                    addonBefore={"config." + this.item.projectKey + "."}
                                    style={{width: "500px"}}
                                    disabled={!this.props.addMode}
                                    // config.foo.bar to bar
                                    defaultValue={untracked(() => this.item.itemKey.split(".").slice(2).join("."))}
                                    onChange={(e) => {
                                        // bar to config.foo.bar
                                        this.item.itemKey = "config." + this.item.projectKey + "." + e.target.value;
                                        this.basicValidator.resetResult("itemKey")
                                    }}
                                    onBlur={() => this.basicValidator.validate("itemKey")}
                                />
                            </Form.Item>
                            <Form.Item label="Name"
                                       {...formItemLayout}
                                       validateStatus={this.basicValidator.getResult("name").status}
                                       help={this.basicValidator.getResult("name").message}
                            >
                                <Input
                                    style={{width: "500px"}}
                                    defaultValue={untracked(() => this.item.name)}
                                    onChange={(e) => {
                                        this.item.name = e.target.value;
                                        this.basicValidator.resetResult("name")
                                    }}
                                    onBlur={() => this.basicValidator.validate("name")}
                                />
                            </Form.Item>
                            <Form.Item label="Description"
                                       {...formItemLayout}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Optional"
                                    style={{width: "500px"}}
                                    defaultValue={untracked(() => this.item.name)}
                                    onChange={(e) => this.item.description = e.target.value}
                                />
                            </Form.Item>
                        </Form>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header="Parameters & Result"
                        key="parameters-result"
                        className={cs("panel", "parameter-panel", {"error": this.parameterValidators.filter(v => v.hasError()).length})}>
                        <Form>
                            <Form.Item label="Parameters" {...formItemLayout}>
                                {
                                    this.item.parameterInfos.map((paramInfo, index) => {
                                        return <div className="parameter" key={paramInfo.key}>
                                            <Tooltip
                                                placement="topLeft"
                                                title={this.parameterValidators[index].getResult("name").message}>
                                                <Input
                                                    className={cs("name", this.parameterValidators[index].getResult("name").status)}
                                                    defaultValue={untracked(() => paramInfo.name)}
                                                    onChange={(e) => {
                                                        paramInfo.name = e.target.value;
                                                        this.parameterValidators[index].resetResult("name");
                                                    }}
                                                    onBlur={() => this.parameterValidators[index].validate("name")}
                                                />
                                            </Tooltip>
                                            <DataTypeSelect
                                                className="data-type"
                                                defaultValue={untracked(() => paramInfo.dataType)}
                                                onChange={(value) => paramInfo.dataType = value}
                                            />
                                            <span onClick={() => {
                                                this.item.parameterInfos.splice(index, 1);
                                                this.parameterValidators.splice(index, 1);
                                            }}>
                                            <Icon type="minus-circle-o" className="delete"/>
                                        </span>
                                        </div>
                                    })
                                }
                                <Button
                                    icon="plus"
                                    type="dashed"
                                    className="add-parameter"
                                    onClick={() => {
                                        this.item.parameterInfos.push({
                                            key: guid(),
                                            dataType: DataType.String
                                        });
                                        this.parameterValidators.push(
                                            new Validator(
                                                {
                                                    name: this.item.parameterInfos.length - 1, // put the index to validate array
                                                    parameterInfos: this.item.parameterInfos
                                                },
                                                {
                                                    name: (rule, value, callback, source, options) => {
                                                        let errors = [];
                                                        let val = source.parameterInfos[value].name;
                                                        if (!val) {
                                                            errors.push(new Error("parameter name is required"));
                                                        }
                                                        if (!/^[a-zA-Z0-9-_.]+?$/.test(val)) {
                                                            errors.push(new Error("parameter name can only contain alphanumeric characters, - , _ and ."));
                                                        }
                                                        if (source.parameterInfos.filter(info => info.name === val).length > 1) {
                                                            errors.push(new Error("duplicated parameter name: " + val));
                                                        }
                                                        callback(errors);
                                                    }
                                                })
                                        );
                                    }}
                                >Add Parameter</Button>
                            </Form.Item>
                            <Form.Item label="Result Data Type"
                                       {...formItemLayout}
                            >
                                <DataTypeSelect
                                    style={{width: "150px"}}
                                    defaultValue={untracked(() => this.item.resultDataType)}
                                    onChange={(dataType) => {
                                        this.item.resultDataType = dataType;
                                        this.item.rules.clear();
                                        this.item.rules.push({
                                            key: guid(),
                                            result: DefaultExp[dataType]
                                        });
                                    }}/>
                            </Form.Item>
                        </Form>
                    </Collapse.Panel>
                    <Collapse.Panel header="Rules" key="rules" className={cs("panel", "rules-panel")}>
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
                                            <ExpressionView
                                                allowEdit
                                                expression={untracked(() => rule.condition)}
                                                item={untracked(() => this.item)}
                                                onChange={(exp) => rule.condition = exp}/>
                                        </Col>
                                        <Col span={6} className="center">
                                            <ExpressionView
                                                allowEdit
                                                expression={untracked(() => rule.result)}
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
                                                condition: DefaultExp.Bool,
                                                result: DefaultExp[this.item.resultDataType]
                                            })}>Add Rule</Button>
                            </Col>
                        </Row>
                        <Row key={defaultRule.key} gutter={24} className="rule-default">
                            <Col span={18} className="center">
                                <b>Default</b>
                            </Col>
                            <Col span={6} className="center">
                                <ExpressionView
                                    allowEdit
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

    handleOk = () => {
        if (this.props.addMode) {
            let validatorPromise = this.basicValidator.validateAll();
            this.parameterValidators.map(validator => {
                validatorPromise = validatorPromise.then(() => validator.validateAll())
            });

            validatorPromise.then(() => {
                this.loading = true;
                axios.put("/api/items/config", this.item)
                    .then(res => {
                        let item = res.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>Item <ItemInfo item={item}/> is added successfully!</span>);
                        this.props.onSuccess(item);
                    }, () => this.loading = false)
            });
        } else {
            let validatorPromise = this.basicValidator.validateAll();
            this.parameterValidators.map(validator => {
                validatorPromise = validatorPromise.then(() => validator.validateAll())
            });

            validatorPromise.then(() => {
                this.loading = true;
                axios.post("/api/items/config/" + this.item.itemKey, this.item)
                    .then(res => {
                        let item = res.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>Item <ItemInfo item={item}/> is updated successfully!</span>);
                        this.props.onSuccess(item);
                    }, () => this.loading = false)
            });
        }
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

@observer
class DeleteConfigItemModal extends Component {
    static defaultProps = {
        item: {},
        onSuccess: (item) => {},
        afterClose: () => {}
    };

    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title={<span>
                <Icon type="question-circle" style={{color: "#ff4d4f"}}/> Are you sure to delete this config item?
            </span>}
            okText="Delete Config Item"
            okType="danger"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            All the data related to this config item will be deleted.
        </Modal>
    };

    handleOk = () => {
        this.loading = true;
        axios.delete("/api/items/config/" + this.props.item.itemKey)
            .then(() => {
                this.loading = false;
                this.visible = false;
                message.success(
                    <span>Config Item <ItemInfo item={this.props.item.itemKey}/> is deleted successfully!</span>);
                this.props.onSuccess(this.props.item);
            }, () => this.loading = false);
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {add, edit, del};