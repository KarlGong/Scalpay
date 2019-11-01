import {Modal, Radio} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {render, unmountComponentAtNode} from "react-dom";
import {observable, untracked} from "mobx";
import {DataType, ExpType, Func} from "~/const";
import BoolSelect from "~/components/expression/BoolSelect";
import DateTimeInput from "~/components/expression/DateTimeInput";
import DurationInput from "~/components/expression/DurationInput";
import NumberInput from "~/components/expression/NumberInput";
import NumberListInput from "~/components/expression/NumberListInput";
import StringInput from "~/components/expression/StringInput";
import StringDictInput from "~/components/expression/StringDictInput";
import StringListInput from "~/components/expression/StringListInput";
import FunctionSelect from "~/components/expression/FunctionSelect";
import VariableSelect from "~/components/expression/VariableSelect";
import ExpressionView from "~/components/expression/ExpressionView";
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
            returnType: null,
            expType: null,
            funcName: null,
            funcArgs: [],
            value: null,
            var: null
        },
        item: {},
        onSuccess: (project) => {
        },
        afterClose: () => {
        }
    };

    @observable expression = Object.assign({
        returnType: null,
        expType: null,
        funcName: null,
        funcArgs: [],
        value: null,
        var: null
    }, this.props.expression); // add all field as observable
    @observable visible = true;

    valueInputValidator = null;
    variableValidator = null;
    functionValidator = null;

    render = () => {
        const valueInputProps = {
            defaultValue: untracked(() => this.expression.value),
            onChange: (value) => this.expression.value = value,
            setValidator: validator => this.valueInputValidator = validator
        };

        const valueInput = {
            [DataType.Bool]: <BoolSelect {...valueInputProps} />,
            [DataType.DateTime]: <DateTimeInput {...valueInputProps} className="datetime-input"/>,
            [DataType.Duration]: <DurationInput {...valueInputProps}/>,
            [DataType.Number]: <NumberInput {...valueInputProps} className="number-input"/>,
            [DataType.NumberList]: <NumberListInput {...valueInputProps}/>,
            [DataType.String]: <StringInput {...valueInputProps} className="string-input"/>,
            [DataType.StringDict]: <StringDictInput {...valueInputProps}/>,
            [DataType.StringList]: <StringListInput {...valueInputProps}/>
        }[this.expression.returnType];

        return <Modal
            title={"Edit Expression - Return Data Type - " + this.expression.returnType}
            className="edit-expression-modal"
            okText="Ok"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Radio.Group
                defaultValue={untracked(() => this.expression.expType)}
                onChange={(e) => this.expression.expType = e.target.value}>
                <Radio value={ExpType.Value}>Value</Radio>
                <Radio value={ExpType.Var}>Variable</Radio>
                <Radio value={ExpType.Func}>Function</Radio>
            </Radio.Group>
            <div className="panel-body">
                {this.expression.expType === ExpType.Value ? valueInput : null}
                {this.expression.expType === ExpType.Var ?
                    <VariableSelect
                        className="var-select"
                        variables={this.props.item.parameterInfos
                            .filter(p => p.dataType === this.expression.returnType)}
                        defaultValue={untracked(() => this.expression.var)}
                        onChange={(variableName) => this.expression.var = variableName}
                        setValidator={validator => this.variableValidator = validator}
                    />
                    : null
                }
                {this.expression.expType === ExpType.Func ?
                    <div>
                        <FunctionSelect
                            className="func-select"
                            returnType={this.expression.returnType}
                            defaultValue={untracked(() => this.expression.funcName)}
                            onChange={(functionName) => {
                                this.expression.funcName = functionName;
                                this.expression.funcArgs = Func[this.expression.returnType][functionName].funcArgs;
                            }}
                            setValidator={validator => this.functionValidator = validator}
                        />
                        {
                            this.expression.funcName ?
                                <div className="func-exp">
                                    <ExpressionView
                                        key={this.expression.funcName}
                                        allowSubEdit
                                        topLevel
                                        expression={this.expression}
                                        item={this.props.item}
                                        onChange={(exp) => this.expression = exp}/>
                                </div>
                                : null
                        }
                    </div>
                    : null
                }
            </div>
        </Modal>
    };

    handleOk = () => {
        const validator = {
            [ExpType.Value]: this.valueInputValidator,
            [ExpType.Var]: this.variableValidator,
            [ExpType.Func]: this.functionValidator
        }[this.expression.expType];

        validator.validate().then(() => {
            // clear useless properties
            let returnExpression = {
                returnType: this.expression.returnType,
                expType: this.expression.expType
            };
            switch (this.expression.expType) {
                case ExpType.Value:
                    returnExpression.value = this.expression.value;
                    break;
                case ExpType.Var:
                    returnExpression.var = this.expression.var;
                    break;
                case ExpType.Func:
                    returnExpression.funcName = this.expression.funcName;
                    returnExpression.funcArgs = this.expression.funcArgs;
                    break;
            }
            this.props.onSuccess(returnExpression);
            this.visible = false;
        });
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};