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
import FieldsViewer from "~/layouts/FieldsViewer";
import CommandBar from "~/layouts/CommandBar";
import {Link} from "react-router";
import "./ViewProjectPage.less";
import global from "~/global";
import projectModal from "~/modals/projectModal";
import Block from "~/layouts/Block";

@observer
export default class ViewProjectPage extends Component {

    @observable project = {
        projectKey: this.props.params.projectKey,
        name: null,
        description: null
    };
    @observable loading = false;

    componentDidMount = () => {
        this.loadProject();
    };

    render = () => {
        let commands = [];
        if (auth.hasPrivileges(Privilege.ProjectEdit)) {
            commands.push(<Button onClick={() => this.editProject()}>Edit</Button>)
        }
        if (auth.hasPrivileges(Privilege.ProjectDelete)) {
            commands.push(<Button type="danger" onClick={() => this.deleteProject()}>Delete</Button>)
        }

        return <PageWrapper
            className="view-project-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/projects">Projects</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.params.projectKey}</Breadcrumb.Item>
            </Breadcrumb>}>
            <CommandBar leftItems={commands}/>
            <Spin spinning={this.loading}>
                <Block name="Basic">
                    <FieldsViewer fields={[
                        ["Project Key", this.project.projectKey],
                        ["Name", this.project.name],
                        ["Description", this.project.description],
                        ["Create Time", moment(this.project.insertTime).fromNow()],
                        ["Update Time", moment(this.project.updateTime).fromNow()],
                    ]}/>
                </Block>
            </Spin>
        </PageWrapper>
    };

    loadProject = () => {
        this.loading = true;
        axios.get("/api/projects/" + this.props.params.projectKey)
            .then((res) => this.project = res.data.data)
            .finally(() => this.loading = false);
    };

    editProject = () => {
        projectModal.edit(this.project, (project) => this.loadProject());
    };

    deleteProject = () => {
        projectModal.del(this.project, (project) => global.history.goBack());
    }
}