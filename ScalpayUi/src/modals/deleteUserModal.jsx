import {Layout, Menu, Input, Icon, Form, Spin, Modal, Button, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {render, unmountComponentAtNode} from "react-dom";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import Validator from "~/utils/Validator";
import global from "~/global";


const target = document.createElement("div");
document.body.appendChild(target);

function open(user, onSuccess) {
    render(<DeleteUserModal user={user} onSuccess={onSuccess}/>, target);
}

function close() {
    unmountComponentAtNode(target);
}

@observer
class DeleteUserModal extends Component {
    static defaultProps = {
        user: null,
        onSuccess: (project) => {}
    };

    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title={<span><Icon type="question-circle" style={{color: "#ff4d4f"}}/> Are you sure to delete this user?</span>}
            okText="Delete User"
            okType="danger"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => close()}
        >
            All the data of this user will be deleted.
        </Modal>
    };

    handleOk = () => {
        this.loading = true;
        axios.delete("/api/users/" + this.props.user.username)
            .then(() => {
                this.loading = false;
                this.visible = false;
                message.success("The user " + this.props.user.fullName + " is deleted successfully!");
                this.props.onSuccess(this.props.user);
            }, () => this.loading = false);
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};