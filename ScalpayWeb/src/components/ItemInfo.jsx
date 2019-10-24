import {Popover, Spin} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import global from "~/global";

@observer
export default class ItemInfo extends Component {
    static defaultProps = {
        itemKey: "",
        version: null
    };

    @observable loading = false;
    @observable itemInfo = {};

    render = () => {
        return <Popover
            title={this.loading? null: this.itemInfo.name}
            content={this.loading? <Spin size="small"/>: this.itemInfo.description}
            placement="bottomLeft"
            mouseEnterDelay={0.5}
            onVisibleChange={this.fetchInfo}
        >
            <a onClick={() => global.history.push("/items/" + this.props.itemKey + (this.props.version ? "/v" + this.props.version : ""))}>
                {this.props.itemKey + (this.props.version ? ":v" + this.props.version : "")}</a>
        </Popover>
    };

    fetchInfo = () => {
        if (Object.keys(this.itemInfo).length) return;
        this.loading = true;
        axios.get("/api/items/" + this.props.itemKey + (this.props.version ? "/v" + this.props.version : ""))
            .then((res) => {
                this.itemInfo = res.data.data;
            })
            .finally(() => this.loading = false);
    }
}