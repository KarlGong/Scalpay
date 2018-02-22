import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import "./PageWrapper.less";
import PropTypes from "prop-types";

@observer
export default class PageWrapper extends Component {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string
    };

    render = () => {
        return <Layout className={cs("page-wrapper", this.props.className)} style={this.props.style}>
                {this.props.children}
        </Layout>
    }
}