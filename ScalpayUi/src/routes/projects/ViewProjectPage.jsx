import {Layout, Menu, Input, Icon, Form, Spin, Button, Modal, Breadcrumb} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import moment from "moment";
import Validator from "~/utils/Validator";
import FieldsViewer from "~/components/FieldsViewer";
import {Link} from "react-router";
import "./ViewProjectPage.less";
import global from "~/global";
import projectModal from "~/modals/projectModal";

@observer
export default class ViewProjectPage extends Component {

    @observable project = {};
    @observable loading = false;

    componentDidMount = () => {
        this.loadProject();
    };

    render = () => {
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 21},
        };

        return <PageWrapper
            className="view-project-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/projects">Projects</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.params.projectKey}</Breadcrumb.Item>
            </Breadcrumb>}>
            <div className="command-bar">
                {auth.hasPrivileges(Privilege.ProjectEdit) ?
                    <Button className="command" onClick={() => this.editProject()}>Edit</Button>
                    : null}
                {auth.hasPrivileges(Privilege.ProjectDelete) ?
                    <Button type="danger" className="command" onClick={() => this.deleteProject()}>Delete</Button>
                    : null}
            </div>
            <Spin spinning={this.loading}>
                <FieldsViewer fields={[
                    ["Project Key", this.project.projectKey],
                    ["Name", this.project.name],
                    ["Description", this.project.description],
                    ["Create Time", moment(this.project.insertTime).fromNow()],
                    ["Update Time", moment(this.project.updateTime).fromNow()],
                ]}/>
            </Spin>
        </PageWrapper>
    };

    loadProject = () => {
        this.loading = true;
        axios.get("/api/projects/" + this.props.params.projectKey)
            .then((res) => this.project = res.data)
            .finally(() => this.loading = false);
    };

    editProject = () => {
        projectModal.edit(this.project, (project) => this.loadProject());
    };

    deleteProject = () => {
        projectModal.del(this.project, (project) => global.history.goBack());
    }
}