import {Layout, Menu, Input, Icon, Form, Spin, Button, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import moment from "moment";
import Validator from "~/utils/Validator";
import "./AddEditProjectPage.less";


@observer
export default class AddEditProjectPage extends Component {
    @observable project = {projectKey: null, name: null, description: null};
    validator = new Validator(this.project, {
        projectKey: {required: true},
        name: {required: true}
    });
    @observable loading = false;

    componentDidMount = () => {
        if (this.props.route.mode !== "add") {
            this.loading = true;
            axios.get("/api/projects/" + this.props.router.params.projectKey)
                .then((res) => {
                    this.project = res.data;
                    this.validator.setSubject(this.project);
                })
                .finally(() => this.loading = false);
        }
    };

    render = () => {
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 8},
        };

        return <PageWrapper className="add-edit-project-page">
            <Spin spinning={this.loading}>
                <Form>
                    <Form.Item label="Project Key" {...formItemLayout}
                               validateStatus={this.validator.getResult("projectKey").status}
                               help={this.validator.getResult("projectKey").message}>
                        <Input key={this.loading}
                               disabled={this.props.route.mode === "edit"}
                               placeholder="A-Z a-z 0-9 -"
                               defaultValue={untracked(() => this.project.projectKey)}
                               onChange={(e) => {
                                   this.project.projectKey = e.target.value;
                                   this.validator.resetResult("projectKey");
                               }} onBlur={() => this.validator.validate("projectKey")}/>
                    </Form.Item>
                    <Form.Item label="Name" {...formItemLayout}
                               validateStatus={this.validator.getResult("name").status}
                               help={this.validator.getResult("name").message}>
                        <Input key={this.loading}
                               placeholder=""
                               defaultValue={untracked(() => this.project.name)}
                               onChange={(e) => {
                                   this.project.name = e.target.value;
                                   this.validator.resetResult("name");
                               }} onBlur={() => this.validator.validate("name")}/>
                    </Form.Item>
                    <Form.Item label="Description" {...formItemLayout}>
                        <Input.TextArea
                            key={this.loading}
                            rows={6}
                            placeholder=""
                            defaultValue={untracked(() => this.project.description)}
                            onChange={(e) => {
                                this.project.description = e.target.value;
                            }}/>
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 4, offset: 14}}>
                        <span>
                            <Button style={{marginRight: "10px"}} onClick={() => this.goBack()}>Cancel</Button>
                            {
                                this.props.route.mode === "add" ?
                                    <Button type="primary" onClick={() => this.addProject()}>Save</Button> :
                                    <Button type="primary" onClick={() => this.updateProject()}>Update</Button>
                            }
                        </span>
                    </Form.Item>
                </Form>
            </Spin>
        </PageWrapper>
    };

    addProject = () => {
        this.validator.validateAll(() => {
            const hide = message.loading("Adding project...", 0);
            axios.put("/api/projects", this.project)
                .then(res => {
                    hide();
                    message.success("The project is added successfully!");
                    this.goBack();
                })
        });
    };

    updateProject = () => {
        this.validator.validateAll(() => {
            const hide = message.loading("Updating project...", 0);
            axios.post("/api/projects/" + this.project.projectKey, this.project)
                .then(() => {
                    hide();
                    message.success("The project is updated successfully!");
                    this.goBack();
                })
        });
    };

    goBack = () => {
        this.props.router.goBack();
    }
}