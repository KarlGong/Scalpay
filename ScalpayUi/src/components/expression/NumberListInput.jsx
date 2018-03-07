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
import ComponentValidator from "~/utils/ComponentValidator";

@observer
export default class NumberListInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        defaultValue: [],
        onChange: (values) => {},
        setValidator: (validator) => {}
    };

    @observable items = this.props.defaultValue.map(v => {
        return {key: guid(), value: v}
    });
    validators = {};

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
                                        this.handleChange();
                                    }}
                                    setValidator={validator => {
                                        this.validators[item.key] = validator;
                                        this.setValidator();
                                    }}
                                />
                            <Icon
                                className="delete"
                                type="minus-circle-o"
                                onClick={() => {
                                    this.items.remove(item);
                                    delete this.validators[item.key];
                                    this.setValidator();
                                    this.handleChange();
                                }}
                            />
                        </div>
                    })
                }
                <Button type="dashed" className="add" onClick={() => {
                    this.items.push({key: guid(), value: 0});
                    this.handleChange();
                }}>
                    <Icon type="plus"/> Add Number
                </Button>
            </DragListView>
        </div>
    };

    handleChange = () => {
        this.props.onChange(this.items.map(item => item.value));
    };

    setValidator = () => {
        this.props.setValidator(new ComponentValidator(Object.values(this.validators)));
    };
}