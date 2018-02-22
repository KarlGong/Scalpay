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


const target = document.createElement("div");
document.body.appendChild(target);

function open(project, onSuccess) {
    render(<EditProjectModal project={project} onSuccess={onSuccess}/>, target);
}

function close() {
    unmountComponentAtNode(target);
}

@observer
class EditProjectModal extends Component {
    static defaultProps = {
        project: {},
        onSuccess: (project) => {
        }
    };

    @observable project = {projectKey: null, name: null, description: null};
    validator = new Validator(this.project, {
        name: {required: true}
    });
    @observable loading = false;
    @observable buttonLoading = false;
    @observable visible = true;

    componentDidMount = () => {
        this.loading = true;
        axios.get("/api/projects/" + this.props.project.projectKey)
            .then(res => {
                Object.assign(this.project, res.data);
            })
            .finally(() => this.loading = false);
    };

    render = () => {
        return <Modal
            title="Edit Project"
            okText="Update Project"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.buttonLoading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => close()}
        >
            <Spin spinning={this.loading}>
                <Form>
                    <Form.Item label="Project Key">
                        <Input
                            key={this.loading}
                            disabled
                            defaultValue={untracked(() => this.project.projectKey)}/>
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        validateStatus={this.validator.getResult("name").status}
                        help={this.validator.getResult("name").message}>
                        <Input
                            key={this.loading}
                            defaultValue={untracked(() => this.project.name)}
                            placeholder=""
                            onChange={(e) => {
                                this.project.name = e.target.value;
                                this.validator.resetResult("name");
                            }} onBlur={() => this.validator.validate("name")}/>
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input.TextArea
                            key={this.loading}
                            defaultValue={untracked(() => this.project.description)}
                            rows={6}
                            placeholder=""
                            onChange={(e) => {
                                this.project.description = e.target.value;
                            }}/>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    };

    handleOk = () => {
        this.validator.validateAll(() => {
            this.buttonLoading = true;
            axios.post("/api/projects/" + this.project.projectKey, this.project)
                .then(res => {
                    let project = res.data;
                    this.buttonLoading = false;
                    this.visible = false;
                    message.success(<span>
                        Project <ProjectInfo project={project}/> is updated successfully!
                    </span>);
                    this.props.onSuccess(project);
                }, () => this.buttonLoading = false);
        });
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};