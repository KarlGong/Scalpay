import {Layout, Menu, Input, Icon, Form, Spin, Button, Modal, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import moment from "moment";
import Validator from "~/utils/Validator";
import "./ViewProjectPage.less";
import global from "~/global";
import deleteProjectModal from "~/modals/deleteProjectModal";

@observer
export default class ViewProjectPage extends Component {

    @observable project = {};
    @observable loading = false;

    componentDidMount = () => {
        this.loading = true;
        axios.get("/api/projects/" + this.props.router.params.projectKey)
            .then((res) => this.project = res.data)
            .finally(() => this.loading = false);
    };

    render = () => {
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 21},
        };

        return <PageWrapper className="view-project-page">
            <div className="command-bar">
                {auth.hasPrivileges(Privilege.ProjectEdit) ?
                    <Button className="command" onClick={() => this.editProject()}>Edit</Button>
                    : null}
                {auth.hasPrivileges(Privilege.ProjectDelete) ?
                    <Button type="danger" className="command" onClick={() => this.deleteProject()}>Delete</Button>
                    : null}
            </div>
            <Spin spinning={this.loading}>
                <Form>
                    <Form.Item label="Project Key" {...formItemLayout}>
                        <span>{this.project.projectKey}</span>
                    </Form.Item>
                    <Form.Item label="Name" {...formItemLayout}>
                        <span>{this.project.name}</span>
                    </Form.Item>
                    <Form.Item label="Description" {...formItemLayout}>
                        <span>{this.project.description}</span>
                    </Form.Item>
                    <Form.Item label="Create Time" {...formItemLayout}>
                        <span>{moment(this.project.insertTime).fromNow()}</span>
                    </Form.Item>
                    <Form.Item label="Update Time" {...formItemLayout}>
                        <span>{moment(this.project.updateTime).fromNow()}</span>
                    </Form.Item>
                </Form>
            </Spin>
        </PageWrapper>
    };

    editProject = () => {
        global.history.push("/projects/" + this.project.projectKey + "/edit");
    };

    deleteProject = () => {
        deleteProjectModal.open(this.project, (project) => global.history.goBack());
    }
}