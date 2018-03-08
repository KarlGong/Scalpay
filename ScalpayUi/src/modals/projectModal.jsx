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

function add(onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<EditProjectModal addMode onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

function edit(project, onSuccess) {
    const hide = message.loading("Loading project...", 0);

    const target = document.createElement("div");
    document.body.appendChild(target);

    axios.get("/api/projects/" + project.projectKey)
        .then(res =>
            render(<EditProjectModal project={res.data} onSuccess={onSuccess} afterClose={() => {
                unmountComponentAtNode(target);
                target.remove()
            }}/>, target))
        .finally(() => hide());

}

function del(project, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(<DeleteProjectModal project={project} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

@observer
class EditProjectModal extends Component {
    static defaultProps = {
        project: {projectKey: null, name: null, description: null},
        addMode: false,
        onSuccess: (project) => {},
        afterClose: () => {}
    };

    @observable project = this.props.project;
    validator = new Validator(this.project, {
        projectKey: (rule, value, callback, source, options) => {
            let errors = [];
            if (!value) {
                errors.push(new Error("project key is required"));
            }
            if (!/^[a-zA-Z0-9-_]+?$/.test(value)) {
                errors.push(new Error("project key can only contain alphanumeric characters, - and _"))
            }
            callback(errors);
        },
        name: {required: true}
    });
    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title={this.props.addMode ? "Add Project" : "Edit Project"}
            okText={this.props.addMode ? "Add Project" : "Update Project"}
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <Form>
                <Form.Item
                    label="Project Key"
                    validateStatus={this.validator.getResult("projectKey").status}
                    help={this.validator.getResult("projectKey").message}>
                    <Input
                        disabled={!this.props.addMode}
                        defaultValue={untracked(() => this.project.projectKey)}
                        onChange={(e) => {
                            this.project.projectKey = e.target.value;
                            this.validator.resetResult("projectKey");
                        }} onBlur={() => this.validator.validate("projectKey")}/>
                </Form.Item>
                <Form.Item
                    label="Name"
                    validateStatus={this.validator.getResult("name").status}
                    help={this.validator.getResult("name").message}>
                    <Input
                        defaultValue={untracked(() => this.project.name)}
                        onChange={(e) => {
                            this.project.name = e.target.value;
                            this.validator.resetResult("name");
                        }} onBlur={() => this.validator.validate("name")}/>
                </Form.Item>
                <Form.Item label="Description">
                    <Input.TextArea
                        defaultValue={untracked(() => this.project.description)}
                        rows={6}
                        placeholder="Optional"
                        onChange={(e) => {
                            this.project.description = e.target.value;
                        }}/>
                </Form.Item>
            </Form>
        </Modal>
    };

    handleOk = () => {
        if (this.props.addMode) {
            this.validator
                .validateAll()
                .then(() => {
                    this.loading = true;
                    axios.put("/api/projects", this.project)
                        .then(res => {
                            let project = res.data;
                            this.loading = false;
                            this.visible = false;
                            message.success(<span>
                        Project <ProjectInfo project={project}/> is added successfully!
                    </span>);
                            this.props.onSuccess(project);
                        }, () => this.loading = false);
                });
        } else {
            this.validator
                .validateAll()
                .then(() => {
                    this.loading = true;
                    axios.post("/api/projects/" + this.project.projectKey, this.project)
                        .then(res => {
                            let project = res.data;
                            this.loading = false;
                            this.visible = false;
                            message.success(<span>
                        Project <ProjectInfo project={project}/> is updated successfully!
                    </span>);
                            this.props.onSuccess(project);
                        }, () => this.loading = false);
                });
        }
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}


@observer
class DeleteProjectModal extends Component {
    static defaultProps = {
        project: {},
        onSuccess: (project) => {},
        afterClose: () => {}
    };

    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title={<span><Icon type="question-circle" style={{color: "#ff4d4f"}}/> Are you sure to delete this project?</span>}
            okText="Delete Project"
            okType="danger"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            All the items under this project will also be deleted.
        </Modal>
    };

    handleOk = () => {
        this.loading = true;
        axios.delete("/api/projects/" + this.props.project.projectKey)
            .then(() => {
                this.loading = false;
                this.visible = false;
                message.success(<span>
                        Project <ProjectInfo project={this.props.project}/> is deleted successfully!
                    </span>);
                this.props.onSuccess(this.props.project);
            }, () => this.loading = false);
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {add, edit, del};