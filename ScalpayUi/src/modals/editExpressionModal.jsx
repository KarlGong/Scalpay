import {Layout, Menu, Input, Icon, Form, Spin, Modal, Button, message, Radio} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {render, unmountComponentAtNode} from "react-dom";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import Validator from "~/utils/Validator";
import {IndexRoute, browserHistory, Router, Route, Link} from "react-router";
import global from "~/global";
import {ExpType, DataType} from "~/utils/store";
import BoolSelect from "~/components/item/expression/BoolSelect";
import DateTimeInput from "~/components/item/expression/DateTimeInput";
import DurationInput from "~/components/item/expression/DurationInput";
import NumberInput from "~/components/item/expression/NumberInput";
import NumberListInput from "~/components/item/expression/NumberListInput";
import StringInput from "~/components/item/expression/StringInput";
import StringDictInput from "~/components/item/expression/StringDictInput";
import StringListInput from "~/components/item/expression/StringListInput";
import FunctionSelect from "~/components/item/expression/FunctionSelect";
import VariableSelect from "~/components/item/expression/VariableSelect";
import "./editExpressionModal.less";

function open(expression, item, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(<EditExpressionModal expression={expression} item={item} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

@observer
class EditExpressionModal extends Component {
    static defaultProps = {
        expression: {
            return: null,
            type: null,
            name: null,
            args: [],
            value: null,
            var: null
        },
        item: {},
        onSuccess: (project) => {},
        afterClose: () => {}
    };

    @observable visible = true;

    constructor(props) {
        super(props);
        this.expression = Object.assign({}, this.props.expression);
        this.expression.type = this.expression.type || ExpType.Value;
        if (this.expression.type === ExpType.Value) {
            const valueDefault = {
                [DataType.Bool]: true,
                [DataType.DateTime]: "datetime",
                [DataType.Duration]: "duration",
                [DataType.Number]: 0,
                [DataType.NumberList]: [],
                [DataType.String]: "",
                [DataType.StringDict]: {},
                [DataType.StringListInput]: []
            };
            this.expression.value = this.expression.value || valueDefault[this.expression.return]
        }
    }

    render = () => {
        const valueInputProps = {
            className: "value-input",
            defaultValue: this.expression.value,
            onChange: (value) => this.expression.value = value
        };

        const valueInput = {
            [DataType.Bool]: <BoolSelect {...valueInputProps} />,
            [DataType.DateTime]: <DateTimeInput {...valueInputProps}/>,
            [DataType.Duration]: <DurationInput {...valueInputProps}/>,
            [DataType.Number]: <NumberInput {...valueInputProps}/>,
            [DataType.NumberList]: <NumberListInput {...valueInputProps}/>,
            [DataType.String]: <StringInput {...valueInputProps}/>,
            [DataType.StringDict]: <StringDictInput {...valueInputProps}/>,
            [DataType.StringListInput]: <StringListInput {...valueInputProps}/>
        }[this.expression.return];

        return <Modal
            title={"Edit Expression - Return Data Type - " + this.expression.return}
            className="edit-expression"
            okText="Ok"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Radio.Group
                defaultValue={this.expression.type}
                onChange={(e) => this.expression.type = e.target.value}>
                <Radio value={ExpType.Value} className="radio">
                    Value
                    {valueInput}
                </Radio>
                <Radio value={ExpType.Var} className="radio">
                    Variable
                    <VariableSelect
                        variables={this.props.item.parameterInfos
                            .filter(p => p.dataType === this.expression.return)}
                        className="var-select"/>
                </Radio>
                <Radio value={ExpType.Func} className="radio">
                    Function
                    <FunctionSelect
                        className="func-select"
                        returnType={untracked(() => this.expression.return)}/>
                </Radio>
            </Radio.Group>
        </Modal>
    };

    handleOk = () => {
        let returnExpression = {
            return: this.expression.return,
            type: this.expression.type
        };
        if (this.expression.type === ExpType.Value) {
            returnExpression.value = this.expression.value;
        } else if (this.expression.type === ExpType.Var) {
            returnExpression.var = this.expression.var;
        } else if (this.expression.type === ExpType.Func) {
            returnExpression.name = this.expression.name;
            returnExpression.args = this.expression.args;
        }
        this.props.onSuccess(returnExpression);
        this.visible = false;
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};