import {Layout, Menu, Input, Icon, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import DragListView from "react-drag-listview";
import StringInput from "./StringInput";
import cs from "classnames";
import guid from "../../utils/guid";

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
    stringInputs = {};

    render = () => {
        return <div className={cs("scalpay-list", this.props.className)}>
            <DragListView
                style={this.props.style}
                onDragEnd={() => { }}>
                {
                    this.items.map((item, index) => {
                        return <div key={item.key} className="item">
                            <StringInput
                                className="single"
                                defaultValue={untracked(() => item.value)}
                                onChange={(value) => {
                                    item.value = value;
                                    this.handleChange();
                                }}
                                ref={(instance) => {if (instance) this.stringInputs[item.key] = instance;}}
                            />
                            <Icon
                                className="delete"
                                type="minus-circle-o"
                                onClick={() => {
                                    this.items.splice(index, 1);
                                    delete this.stringInputs[item.key];
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
                    <Icon type="plus"/> Add String
                </Button>
            </DragListView>
        </div>
    };

    handleChange = () => {
        this.props.onChange(this.items.map(item => item.value));
    };

    validate = () => {
        return Promise.all(Object.values(this.stringInputs).map(v => v.validate()));
    }
}