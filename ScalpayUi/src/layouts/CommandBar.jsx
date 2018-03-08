import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import "./CommandBar.less";

@observer
export default class CommandBar extends Component {
    static defaultProps = {
        leftItems: [],
        rightItems: [],
        className: "",
        style: {}
    };

    render = () => {
        return <div className={cs("command-bar", this.props.className)} style={this.props.style}>
            <div className="left">{this.props.leftItems.map((item, index) => {
                return <div key={index} className="item">{item}</div>;
            })}</div>
            <div className="right">{this.props.rightItems.map((item, index) => {
                return <div key={index} className="item">{item}</div>;
            })}</div>
        </div>
    }
}