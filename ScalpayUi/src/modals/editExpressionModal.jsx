import {Layout, Menu, Input, Icon, Form, Spin, Modal, Button, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {render, unmountComponentAtNode} from "react-dom";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import Validator from "~/utils/Validator";
import {IndexRoute, browserHistory, Router, Route, Link} from "react-router";
import global from "~/global";
import ProjectInfo from "~/components/ProjectInfo";


function open(expression, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(<EditExpressionModal expression={expression} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

@observer
class EditExpressionModal extends Component {
    static defaultProps = {
        expression: {},
        onSuccess: (project) => {},
        afterClose: () => {}
    };

    render = () => {
        return <Modal
            title={"Edit Expression - " + this.props.expression.return}
            okText="Ok"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >

        </Modal>
    };

    handleOk = () => {

    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};