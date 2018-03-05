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
import event from "~/utils/event";
import Validator from "~/utils/Validator";
import {isVariableUsed, updateVariable} from "~/utils/expressionHelper";
import "./ParameterPanel.less";

@observer
export default class ParameterPanel extends Component {
    static defaultProps = {
        item: {},
        setValidators: (validators) => {
        },
    };

    item = this.props.item; // observable
    @observable resultDataTypeKey = guid();

    constructor(props) {
        super(props);
        this.validatorDescriptor = {
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
                    errors.push(new Error("duplicating parameter name: " + val));
                }
                callback(errors);
            }
        };
        this.validators = this.item.parameterInfos.map((info, index) =>
            new Validator({
                    name: index, // put the index to validate array
                    parameterInfos: this.item.parameterInfos
                },
                this.validatorDescriptor));
        this.props.setValidators(this.validators);
        this.item.parameterInfos.map(info => info.oldName = info.name); // prevent the parameter's old name
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
        return <div className="parameter-panel">
            <Form>
                <Form.Item label="Parameters" {...formItemLayout}>
                    {
                        this.item.parameterInfos.map((paramInfo, index) => {
                            return <div className="parameter" key={paramInfo.key}>
                                <Tooltip
                                    placement="topLeft"
                                    title={this.validators[index].getResult("name").message}>
                                    <Input
                                        className={cs("name", this.validators[index].getResult("name").status)}
                                        defaultValue={untracked(() => paramInfo.name)}
                                        onChange={(e) => {
                                            paramInfo.name = e.target.value;
                                            this.validators[index].resetResult("name");
                                        }}
                                        onBlur={(e) => {
                                            this.validators[index].validate("name").then(() => {
                                                if (!paramInfo.oldName) { // for the new added parameter
                                                    paramInfo.oldName = paramInfo.name;
                                                    return;
                                                }
                                                if (paramInfo.name === paramInfo.oldName) return; // for the unchanged parameter
                                                const hide = message.loading("Updating all expressions to use new parameter name...", 0);
                                                this.item.rules.map(rule => {
                                                    updateVariable(rule.condition, paramInfo.oldName, paramInfo.name);
                                                    updateVariable(rule.result, paramInfo.oldName, paramInfo.name);
                                                    rule.key = guid();
                                                });
                                                paramInfo.oldName = paramInfo.name;
                                                hide();
                                            });
                                        }}
                                    />
                                </Tooltip>
                                <DataTypeSelect
                                    className="data-type"
                                    defaultValue={untracked(() => paramInfo.dataType)}
                                    onChange={(value) => {
                                        Modal.confirm({
                                            title: "Are you sure to change the data type of this parameter?",
                                            content: "All the expressions use this parameter will be reset.",
                                            okText: "Change",
                                            okType: "danger",
                                            cancelText: "No",
                                            onOk: () => {
                                                paramInfo.dataType = value;
                                                this.item.rules.map(rule => {
                                                    if (isVariableUsed(rule.condition, paramInfo.name)) {
                                                        rule.condition = DefaultExp.Bool;
                                                    }
                                                    if (isVariableUsed(rule.result, paramInfo.name)) {
                                                        rule.result = DefaultExp[this.item.resultDataType];
                                                    }
                                                    rule.key = guid();
                                                });
                                            },
                                            onCancel: () => {
                                                paramInfo.key = guid();
                                            },
                                        });
                                    }}
                                />
                                <span onClick={() => {
                                    Modal.confirm({
                                        title: "Are you sure to delete this parameter?",
                                        content: "All the expressions use this parameter will be reset.",
                                        okText: "Delete",
                                        okType: "danger",
                                        cancelText: "No",
                                        onOk: () => {
                                            this.item.rules.map(rule => {
                                                if (isVariableUsed(rule.condition, paramInfo.name)) {
                                                    rule.condition = DefaultExp.Bool;
                                                }
                                                if (isVariableUsed(rule.result, paramInfo.name)) {
                                                    rule.result = DefaultExp[this.item.resultDataType];
                                                }
                                                rule.key = guid();
                                            });
                                            this.item.parameterInfos.splice(index, 1);
                                            this.validators.splice(index, 1);
                                            this.props.setValidators(this.validators);
                                        }
                                    });


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
                            this.validators.push(
                                new Validator(
                                    {
                                        name: this.item.parameterInfos.length - 1, // put the index to validate array
                                        parameterInfos: this.item.parameterInfos
                                    },
                                    this.validatorDescriptor)
                            );
                            this.props.setValidators(this.validators);
                        }}
                    >Add Parameter</Button>
                </Form.Item>
                <Form.Item label="Result Data Type"
                           {...formItemLayout}
                >
                    <DataTypeSelect
                        key={this.resultDataTypeKey}
                        style={{width: "150px"}}
                        defaultValue={untracked(() => this.item.resultDataType)}
                        onChange={(dataType) => {
                            Modal.confirm({
                                title: "Are you sure to change the result data type?",
                                content: "The result expression of all rules will be reset.",
                                okText: "Change",
                                okType: "danger",
                                cancelText: "No",
                                onOk: () => {
                                    this.item.resultDataType = dataType;
                                    this.item.rules.map(rule => {
                                        rule.result = DefaultExp[dataType];
                                        rule.key = guid();
                                    });
                                },
                                onCancel: () => {
                                    this.resultDataTypeKey = guid();
                                },
                            });
                        }}/>
                </Form.Item>
            </Form>
        </div>
    };

    validate = () => {
        return Promise.all(this.validators.map(v => v.validateAll()));
    }
}