import {Layout, Menu, Input, Icon, Form, Spin, Modal, Button, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {render, unmountComponentAtNode} from "react-dom";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import Validator from "~/utils/Validator";
import {IndexRoute, browserHistory, Router, Route, Link} from "react-router";
import global from "~/global";


const target = document.createElement("div");
document.body.appendChild(target);

function open(onSuccess) {
    render(<AddProjectModal onSuccess={onSuccess}/>, target);
}

function close() {
    unmountComponentAtNode(target);
}

@observer
class AddProjectModal extends Component {
    static defaultProps = {
        onSuccess: (project) => {}
    };

    project = {projectKey: null, name: null, description: null};
    validator = new Validator(this.project, {
        projectKey: {required: true},
        name: {required: true}
    });
    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title="Add Project"
            okText="Add Project"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => close()}
        >
            <Form>
                <Form.Item label="Project Key"
                           validateStatus={this.validator.getResult("projectKey").status}
                           help={this.validator.getResult("projectKey").message}>
                    <Input
                        placeholder="A-Z a-z 0-9 -"
                        onChange={(e) => {
                            this.project.projectKey = e.target.value;
                            this.validator.resetResult("projectKey");
                        }} onBlur={() => this.validator.validate("projectKey")}/>
                </Form.Item>
                <Form.Item label="Name"
                           validateStatus={this.validator.getResult("name").status}
                           help={this.validator.getResult("name").message}>
                    <Input
                        placeholder=""
                        onChange={(e) => {
                            this.project.name = e.target.value;
                            this.validator.resetResult("name");
                        }} onBlur={() => this.validator.validate("name")}/>
                </Form.Item>
                <Form.Item label="Description">
                    <Input.TextArea
                        rows={6}
                        placeholder=""
                        onChange={(e) => {
                            this.project.description = e.target.value;
                        }}/>
                </Form.Item>
            </Form>
        </Modal>
    };

    handleOk = () => {
        this.validator.validateAll(() => {
            this.loading = true;
            axios.put("/api/projects", this.project)
                .then(res => {
                    let project = res.data;
                    this.loading = false;
                    this.visible = false;
                    message.success(<span>
                        Project <a onClick={() => global.history.push("/projects/" + project.projectKey)}>{project.name}</a> is added successfully!
                    </span>);
                    this.props.onSuccess(project);
                }, () => this.loading = false);
        });
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};