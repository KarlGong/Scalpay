import {Layout, Menu, Input, Icon, List, Button, Modal, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import "./ProjectsPage.less";
import PageWrapper from "~/layouts/PageWrapper";
import addProjectModal from "~/modals/addProjectModal";
import deleteProjectModal from "~/modals/deleteProjectModal";
import global from "~/global";

@observer
export default class ProjectsPage extends Component {

    @observable loading = false;
    @observable projects = [];
    searchText = null;

    componentDidMount = () => {
        this.searchProjects();
    };

    render = () => {
        return <PageWrapper className="projects-page">
            <List
                className="list"
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.projects}
                header={<span>
                            <Input style={{width: "250px"}} placeholder="By key/name/description"
                                   onChange={(e) => this.searchText = e.target.value}
                                   onPressEnter={(e) => this.searchProjects()}/>
                            <Button style={{marginLeft: "10px"}} type="primary"
                                    onClick={() => this.searchProjects()}>Search</Button>
                    {auth.hasPrivileges(Privilege.ProjectAdd) ?
                        <Button style={{float: "right"}} onClick={() => this.addProject()}>Add Project</Button>
                        : null
                    }
                    </span>}
                renderItem={project => {
                    let actions = [];
                    if (auth.hasPrivileges(Privilege.ProjectEdit))
                        actions.push(<a className="edit" onClick={() => this.editProject(project)}>edit</a>);
                    if (auth.hasPrivileges(Privilege.ProjectDelete))
                        actions.push(<a className="delete" onClick={() => this.deleteProject(project)}>delete</a>);

                    return <List.Item actions={actions}>
                        <List.Item.Meta
                            title={<a onClick={() => this.viewProject(project)}>{project.name}</a>}
                            description={project.description}
                        />
                        <div>{project.projectKey}</div>
                    </List.Item>
                }}
            >
            </List>
        </PageWrapper>
    };

    searchProjects = () => {
        this.loading = true;
        axios.get("/api/projects", {
            params: {
                searchText: this.searchText
            }
        })
            .then(response => this.projects = response.data)
            .finally(() => this.loading = false);
    };

    addProject = () => {
        addProjectModal.open((project) => this.searchProjects());
    };

    viewProject = (project) => {
        global.history.push("/projects/" + project.projectKey);
    };

    editProject = (project) => {
        global.history.push("/projects/" + project.projectKey + "/edit");
    };

    deleteProject = (project) => {
        deleteProjectModal.open(project, (project) => this.searchProjects());
    };
}