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

function open(expression, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(<EditExpressionModal expression={expression} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

@observer
class EditExpressionModal extends Component {
    static defaultProps = {
        expression: {},
        onSuccess: (project) => {},
        afterClose: () => {}
    };

    static valueInputDict = {
        [DataType.Bool] : <BoolSelect/>,
        [DataType.DateTime]: <DateTimeInput/>,
        [DataType.Duration]: <DurationInput/>,
        [DataType.Number]: <NumberInput/>,
        [DataType.NumberList]: <NumberListInput/>,
        [DataType.String]: <StringInput/>,
        [DataType.StringDict]: <StringDictInput/>,
        [DataType.StringListInput]: <StringListInput/>
    };

    @observable visible = true;

    render = () => {
        return <Modal
            title={"Edit Expression - " + this.props.expression.return}
            okText="Ok"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Radio.Group onChange={this.onChange}>
                <Radio value={ExpType.Value}>
                    Value
                    {EditExpressionModal.valueInputDict[this.props.expression.return]}
                </Radio>
                <Radio value={ExpType.Var}>
                    Variable
                    <VariableSelect/>
                </Radio>
                <Radio value={ExpType.Func}>
                    Function
                    <FunctionSelect/>
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