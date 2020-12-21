import {Popover, Spin} from "antd";
import React, {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import axios from "axios";
import global from "~/global";

@observer
export default class UserInfo extends Component {
    static defaultProps = {
        username: ""
    };

    @observable loading = false;
    @observable userInfo = {};

    render() {
        return <Popover
            title={this.loading ? null : this.userInfo.fullName}
            content={this.loading ? <Spin size="small"/> : this.userInfo.email}
            placement="bottomLeft"
            mouseEnterDelay={0.5}
            onVisibleChange={this.fetchInfo}
        >
            <a onClick={() => global.history.push("/users/" + this.props.username)}>{this.props.username}</a>
        </Popover>
    };

    fetchInfo = () => {
        if (Object.keys(this.userInfo).length) return;
        this.loading = true;
        axios.get("/api/users/" + this.props.username)
            .then((res) => {
                this.userInfo = res.data;
            })
            .finally(() => this.loading = false);
    }
}