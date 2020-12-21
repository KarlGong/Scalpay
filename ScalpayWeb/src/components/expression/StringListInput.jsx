import {Button} from "antd";
import {CloseCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import DragListView from "react-drag-listview";
import StringInput from "./StringInput";
import cs from "classnames";
import guid from "../../utils/guid";
import ComponentValidator from "~/utils/ComponentValidator";
import "./StringListInput.less";

@observer
export default class StringListInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        defaultValue: [],
        onChange: (values) => {}
    };


    @observable items = this.props.defaultValue.map(v => {
        return {key: guid(), value: v}
    });
    validators = {};

    render() {
        return <div className={cs("string-list-input", "draggable", this.props.className)}>
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
                            <div className="dragger"></div>
                            <StringInput
                                className="input"
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
                    this.items.push({key: guid(), value: ""});
                    this.handleChange();
                }}>
                    <PlusOutlined /> Add String
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