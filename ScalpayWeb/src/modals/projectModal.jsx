import {Form, Input, message, Modal} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {render, unmountComponentAtNode} from "react-dom";
import {observable, untracked} from "mobx";
import axios from "axios";
import Validator from "~/utils/Validator";
import ProjectInfo from "~/components/ProjectInfo";
import global from "~/global";

function add(onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<ProjectModal addMode onSuccess={onSuccess} afterClose={() => {
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
            render(<ProjectModal project={res.data.data} onSuccess={onSuccess} afterClose={() => {
                unmountComponentAtNode(target);
                target.remove()
            }}/>, target))
        .finally(() => hide());

}

@observer
class ProjectModal extends Component {
    static defaultProps = {
        project: {
            projectKey: null,
            name: null,
            description: null,
            version: null,
            isLatest: false
        },
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
                            message.success(<span>Project&nbsp;
                                <a onClick={() => global.history.push("/projects/" + project.projectKey)}>
                                    {project.name}
                                </a> is created successfully!</span>);
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
                            message.success(<span>Project&nbsp;
                                <a onClick={() => global.history.push("/projects/" + project.projectKey)}>
                                    {project.name}
                                </a> is updated successfully!</span>);
                            this.props.onSuccess(project);
                        }, () => this.loading = false);
                });
        }
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}


export default {add, edit};