import {Button, Form, Icon, Input, message, Modal, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, runInAction, untracked} from "mobx";
import cs from "classnames";
import {DataType, DefaultExp} from "~/utils/store";
import DataTypeSelect from "~/components/DataTypeSelect";
import DragListView from "react-drag-listview";
import guid from "~/utils/guid";
import "./itemModal.less";
import Validator from "~/utils/Validator";
import {isVariableUsed, updateVariable} from "~/utils/expressionHelper";
import ComponentValidator from "~/utils/ComponentValidator";

@observer
export default class ParameterPanel extends Component {
    static defaultProps = {
        item: {},
        setValidator: (validator) => {}
    };

    item = this.props.item; // observable, changes affect the input item, onXXChange can solve this, but it's too complex
    @observable resultDataTypeResetKey = guid();

    constructor(props) {
        super(props);
        this.validatorDescriptor = {
            name: (rule, value, callback, source, options) => {
                let errors = [];
                if (!value) {
                    errors.push(new Error("parameter name is required"));
                }
                if (!/^[a-zA-Z0-9-_.]+?$/.test(value)) {
                    errors.push(new Error("parameter name can only contain alphanumeric characters, - , _ and ."));
                }
                if (this.item.parameterInfos.filter(info => info.name === value).length > 1) {
                    errors.push(new Error("duplicating parameter name: " + value));
                }
                callback(errors);
            }
        };
        this.validators = this.item.parameterInfos.map((info, index) => new Validator(info, this.validatorDescriptor));
        this.setValidator();
        this.item.parameterInfos.map(info => info.oldName = info.name); // prevent the parameter's old name
    }

    render = () => {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            },
        };
        return <div className="parameter-panel">
            <Form>
                <Form.Item label="Parameters" {...formItemLayout}>
                    <div className="scalpay-list draggable">
                        <DragListView
                            onDragEnd={(fromIndex, toIndex) => {
                                runInAction(() => {
                                    let parameterInfo = this.item.parameterInfos.splice(fromIndex, 1)[0];
                                    this.item.parameterInfos.splice(toIndex, 0, parameterInfo);
                                    let validator = this.validators.splice(fromIndex, 1)[0];
                                    this.validators.splice(toIndex, 0, validator);
                                });
                            }}
                            scrollSpeed={3}
                            nodeSelector=".item"
                            handleSelector=".item"
                        >
                            {
                                this.item.parameterInfos.map((paramInfo, index) => {
                                    return <div className="item" key={paramInfo.key}>
                                        <Tooltip
                                            placement="topLeft"
                                            title={this.validators[index].getResult("name").message}>
                                            <Input
                                                className={cs("first", this.validators[index].getResult("name").status)}
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
                                                        const hide = message.loading("Updating all expressions to apply new parameter name...", 0);
                                                        this.item.rules.map(rule => {
                                                            updateVariable(rule.condition, paramInfo.oldName, paramInfo.name);
                                                            updateVariable(rule.result, paramInfo.oldName, paramInfo.name);
                                                        });
                                                        updateVariable(this.item.defaultResult, paramInfo.oldName, paramInfo.name);
                                                        paramInfo.oldName = paramInfo.name;
                                                        hide();
                                                    });
                                                }}
                                            />
                                        </Tooltip>
                                        <DataTypeSelect
                                            className="second"
                                            defaultValue={untracked(() => paramInfo.dataType)}
                                            onChange={(value) => {
                                                if (!paramInfo.oldName) return; // for the new added parameter
                                                Modal.confirm({
                                                    title: "Are you sure to change the data type of this parameter?",
                                                    content: "All the expressions use this parameter will be reset.",
                                                    okText: "Change",
                                                    okType: "danger",
                                                    cancelText: "No",
                                                    onOk: () => {
                                                        paramInfo.dataType = value;
                                                        this.item.rules.map(rule => {
                                                            if (isVariableUsed(rule.condition, paramInfo.oldName)) {
                                                                rule.condition = DefaultExp.bool;
                                                            }
                                                            if (isVariableUsed(rule.result, paramInfo.oldName)) {
                                                                rule.result = DefaultExp[this.item.resultDataType];
                                                            }
                                                        });
                                                        if (isVariableUsed(this.item.defaultResult, paramInfo.oldName)) {
                                                            this.item.defaultResult = DefaultExp[this.item.resultDataType];
                                                        }
                                                    },
                                                    onCancel: () => {
                                                        paramInfo.key = guid(); //reset
                                                    },
                                                });
                                            }}
                                        />
                                        <span className="delete" onClick={() => {
                                            if (!paramInfo.oldName) { // for the new added parameter
                                                this.item.parameterInfos.splice(index, 1);
                                                this.validators.splice(index, 1);
                                                this.setValidator();
                                                return;
                                            }
                                            Modal.confirm({
                                                title: "Are you sure to delete this parameter?",
                                                content: "All the expressions use this parameter will be reset.",
                                                okText: "Delete",
                                                okType: "danger",
                                                cancelText: "No",
                                                onOk: () => {
                                                    this.item.rules.map(rule => {
                                                        if (isVariableUsed(rule.condition, paramInfo.oldName)) {
                                                            rule.condition = DefaultExp.bool;
                                                        }
                                                        if (isVariableUsed(rule.result, paramInfo.oldName)) {
                                                            rule.result = DefaultExp[this.item.resultDataType];
                                                        }
                                                    });
                                                    if (isVariableUsed(this.item.defaultResult, paramInfo.oldName)) {
                                                        this.item.defaultResult = DefaultExp[this.item.resultDataType];
                                                    }
                                                    this.item.parameterInfos.splice(index, 1);
                                                    this.validators.splice(index, 1);
                                                    this.setValidator();
                                                }
                                            });
                                        }}>
                                    <Icon type="minus-circle-o"/>
                                </span>
                                    </div>
                                })
                            }
                            <Button
                                icon="plus"
                                type="dashed"
                                className="add"
                                onClick={() => {
                                    this.item.parameterInfos.push({
                                        key: guid(),
                                        dataType: DataType.string
                                    });
                                    let validator = new Validator(
                                        this.item.parameterInfos.slice(-1)[0],
                                        this.validatorDescriptor,
                                    );
                                    this.validators.push(validator);
                                    this.setValidator();
                                    validator.validate("name");
                                }}
                            >Add Parameter</Button>
                        </DragListView>
                    </div>
                </Form.Item>
                <Form.Item label="Result Data Type"
                           {...formItemLayout}
                >
                    <DataTypeSelect
                        key={this.resultDataTypeResetKey}
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
                                    });
                                    this.item.defaultResult = DefaultExp[dataType];
                                },
                                onCancel: () => {
                                    this.resultDataTypeResetKey = guid();
                                },
                            });
                        }}/>
                </Form.Item>
            </Form>
        </div>
    };

    setValidator = () => {
        this.props.setValidator(new ComponentValidator(this.validators));
    }
}