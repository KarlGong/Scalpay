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
import "./ParameterPanel.less";

@observer
export default class ParameterPanel extends Component {
    static defaultProps = {
        item: {},
        setValidators: (validators) => {},
    };

    item = this.props.item; // observable

    constructor(props){
        super(props);
        this.validators = [];
        this.props.setValidators(this.validators)
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
                                        onBlur={() => this.validators[index].validate("name")}
                                    />
                                </Tooltip>
                                <DataTypeSelect
                                    className="data-type"
                                    defaultValue={untracked(() => paramInfo.dataType)}
                                    onChange={(value) => paramInfo.dataType = value}
                                />
                                <span onClick={() => {
                                    this.item.parameterInfos.splice(index, 1);
                                    this.validators.splice(index, 1);
                                    this.props.setValidators(this.validators);
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
                            this.props.setValidators(this.validators);
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
        </div>
    };

    validate = () => {
        return Promise.all(this.validators.map(v => v.validateAll()));
    }
}