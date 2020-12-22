import {Button} from "antd";
import {CloseCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import cs from "classnames";
import DragListView from "react-drag-listview";
import NumberInput from "./NumberInput";
import guid from "~/utils/guid";
import ComponentValidator from "~/utils/ComponentValidator";
import "./NumberListInput.less";

@observer
export default class NumberListInput extends Component {
    static defaultProps = {
        defaultValue: [],
        onChange: (values) => {},
        setValidator: (validator) => {}
    };

    @observable items = this.props.defaultValue.map(v => {
        return {key: guid(), value: v}
    });
    validators = {};

    render() {
        return <div className="number-list-input">
            <DragListView
                style={this.props.style}
                onDragEnd={(fromIndex, toIndex) => {
                    let item = this.items.splice(fromIndex, 1)[0];
                    this.items.splice(toIndex, 0, item);
                    this.handleChange();
                }}
                scrollSpeed={3}
                nodeSelector=".item"
                handleSelector=".item .dragger"
            >
                {
                    this.items.map((item, index) => {
                        return <div key={item.key} className="item">
                            <div className="dragger"/>
                            <NumberInput
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
                            <CloseCircleOutlined
                                className="delete"
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
                    <PlusOutlined /> Add Number
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