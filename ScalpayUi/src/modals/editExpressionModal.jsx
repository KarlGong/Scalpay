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

    render = () => {
        const valueInput = {
            [DataType.Bool]: <BoolSelect className="value-input"/>,
            [DataType.DateTime]: <DateTimeInput className="value-input"/>,
            [DataType.Duration]: <DurationInput className="value-input"/>,
            [DataType.Number]: <NumberInput className="value-input"/>,
            [DataType.NumberList]: <NumberListInput className="value-input"/>,
            [DataType.String]: <StringInput className="value-input"/>,
            [DataType.StringDict]: <StringDictInput className="value-input"/>,
            [DataType.StringListInput]: <StringListInput className="value-input"/>
        }[this.props.expression.return];

        return <Modal
            title={"Edit Expression - Return Data Type - " + this.props.expression.return}
            className="edit-expression"
            okText="Ok"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Radio.Group onChange={(e) => this.props.expression.type = e.target.value}>
                <Radio value={ExpType.Value} className="radio">
                    Value
                    {valueInput}
                </Radio>
                <Radio value={ExpType.Var} className="radio">
                    Variable
                    <VariableSelect
                        variables={this.props.item.parameterInfos
                            .filter(p => p.dataType === this.props.expression.return)}
                        className="var-select"/>
                </Radio>
                <Radio value={ExpType.Func} className="radio">
                    Function
                    <FunctionSelect
                        className="func-select"
                        returnType={this.props.expression.return}/>
                </Radio>
            </Radio.Group>
        </Modal>
    };

    handleOk = () => {

    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};