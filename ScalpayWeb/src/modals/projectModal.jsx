import {Form, Input, message, Drawer, Button} from "antd";
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
            render(<ProjectModal project={res.data} onSuccess={onSuccess} afterClose={() => {
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
            description: null
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
        }
    });
    @observable isSubmitting = false;
    @observable visible = true;

    render() {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            },
        };
        return <Drawer
            title={this.props.addMode ? "Add Project" : "Edit Project"}
            visible={this.visible}
            width={600}
            maskClosable={false}
            onClose={this.handleCancel}
            afterVisibleChange={visible => !visible && this.props.afterClose()}
        >
            <Form {...formItemLayout}>
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
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    borderTop: "1px solid #e9e9e9",
                    padding: "10px 16px",
                    background: "#fff",
                    textAlign: "right",
                }}
            >
                <Button onClick={this.handleCancel} style={{marginRight: 8}}>
                    Cancel
                </Button>
                <Button onClick={this.handleOk} type="primary" loading={this.isSubmitting}>
                    Submit
                </Button>
            </div>
        </Drawer>
    };

    handleOk = () => {
        if (this.props.addMode) {
            this.validator
                .validateAll()
                .then(() => {
                    this.isSubmitting = true;
                    axios.post("/api/projects", this.project)
                        .then(res => {
                            let project = res.data;
                            this.isSubmitting = false;
                            this.visible = false;
                            message.success(<span>Project <ProjectInfo project={project}/> is added successfully!</span>);
                            this.props.onSuccess(project);
                        }, () => this.isSubmitting = false);
                });
        } else {
            this.validator
                .validateAll()
                .then(() => {
                    this.isSubmitting = true;
                    axios.put("/api/projects/" + this.project.projectKey, this.project)
                        .then(res => {
                            let project = res.data;
                            this.isSubmitting = false;
                            this.visible = false;
                            message.success(<span>Project <ProjectInfo project={project}/> is updated successfully!</span>);
                            this.props.onSuccess(project);
                        }, () => this.isSubmitting = false);
                });
        }
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}


export default {add, edit};