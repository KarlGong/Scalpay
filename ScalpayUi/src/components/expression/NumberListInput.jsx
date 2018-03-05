import {Layout, Menu, Input, Icon, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import DragListView from "react-drag-listview";
import NumberInput from "./NumberInput";
import guid from "../../utils/guid";

@observer
export default class NumberListInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        values: []
    };

    @observable items = this.props.values.map(v => {
        return {key: guid(), value: v}
    });

    render = () => {
        return <div className={cs("scalpay-list", this.props.className)}>
            <DragListView
                style={this.props.style}
                onDragEnd={() => {
                }}>
                {
                    this.items.map((item, index) => {
                        return <div key={item.key} className="item">
                            <NumberInput
                                className="single"
                                defaultValue={untracked(() => item.value)}
                                onChange={(value) => item.value = value}
                            />
                            <Icon
                                className="delete"
                                type="minus-circle-o"
                                onClick={() => this.items.splice(index, 1)}
                            />
                        </div>
                    })
                }
                <Button type="dashed" className="add" onClick={() => this.items.push({key: guid(), value: 0})}>
                    <Icon type="plus"/> Add field
                </Button>
            </DragListView>
        </div>
    }
}