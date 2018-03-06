import {Layout, Menu, Input, Icon, Button, Tooltip, InputNumber} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import DragListView from "react-drag-listview";
import NumberInput from "./NumberInput";
import guid from "../../utils/guid";
import Validator from "~/utils/Validator";

@observer
export default class NumberListInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        defaultValues: [],
        setValidators: (validators) => {}
    };

    @observable items = this.props.defaultValues.map(v => {
        return {key: guid(), value: v}
    });

    constructor(props) {
        super(props);
        this.validators = this.props.defaultValues.map(v => []);
        this.setValidators(this.validators);
    }

    render = () => {
        return <div className={cs("scalpay-list", this.props.className)}>
            <DragListView
                style={this.props.style}
                onDragEnd={() => { }}>
                {
                    this.items.map((item, index) => {
                        return <div key={item.key} className="item">
                                <NumberInput
                                    className="single"
                                    defaultValue={untracked(() => item.value)}
                                    onChange={(value) => {
                                        item.value = value;
                                    }}
                                    setValidators={(validators) => this.validators[index] = validators}
                                />
                            <Icon
                                className="delete"
                                type="minus-circle-o"
                                onClick={() => {
                                    this.items.splice(index, 1);
                                    this.validators.splice(index, 1);
                                    this.setValidators(this.validators);
                                }}
                            />
                        </div>
                    })
                }
                <Button type="dashed" className="add" onClick={() => {
                    this.items.push({key: guid(), value: 0});
                    this.setValidators(this.validators);
                }}>
                    <Icon type="plus"/> Add field
                </Button>
            </DragListView>
        </div>
    };

    setValidators = () => {
        let validators = [];
        this.validators.map(v => validators.concat(v));
        this.props.setValidators(validators);
    }
}