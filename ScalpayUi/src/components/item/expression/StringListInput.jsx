import {Layout, Menu, Input, Icon, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import DragListView from "react-drag-listview";
import StringInput from "./StringInput";

@observer
export default class StringListInput extends Component {
    static defaultProps = {
        values: []
    };


    @observable values = [];

    render = () => {
        return <DragListView onDragEnd={() => {}}>
            {
                this.values.map((item, index) => {
                    return <div>
                        <StringInput/>
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => this.remove(k)}
                        />
                    </div>
                })
            }
            <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
                <Icon type="plus" /> Add field
            </Button>
        </DragListView>
    }
}