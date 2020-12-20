import {Spin} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import cs from "classnames";
import "./Block.less";

@observer
export default class Block extends Component {
    static defaultProps = {
        name: "",
        className: "",
        style: {}
    };

    render() {
        return <div className={cs("block", this.props.className)} style={this.props.style}>
            <div className="block-header">
                <span className="name">{this.props.name}</span>
            </div>
            <div className="block-content">
                {this.props.children}
            </div>
        </div>
    }
}