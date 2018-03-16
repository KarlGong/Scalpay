import {Layout, Menu, Input, Icon, Spin} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import "./Block.less";

@observer
export default class Block extends Component {
    static defaultProps = {
        name: "",
        className: "",
        style: {},
        loading: false
    };

    @observable loading = this.props.loading;

    componentWillReceiveProps = (props) => {
        if (this.props.loading !== props.loading) {
            this.loading = props.loading;
        }
    };

    render = () => {
        return <div className={cs("block", this.props.className)} style={this.props.style}>
            <div className="block-header">
                <span className="name">{this.props.name}</span>
            </div>
            <Spin spinning={this.loading}>
                <div className="block-content">
                    {this.props.children}
                </div>
            </Spin>
        </div>

    }
}