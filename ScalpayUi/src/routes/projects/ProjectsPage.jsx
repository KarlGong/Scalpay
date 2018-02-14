import {Layout, Menu, Input, Icon, List, Button, Modal, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import "./ProjectsPage.less";
import PageWrapper from "~/layouts/PageWrapper";

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
                                   onKeyUp={(e) => e.keyCode === 13 && this.searchProjects()}/>
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
                            title={auth.hasPrivileges(Privilege.ProjectView) ?
                                <a onClick={() => this.viewProject(project)}>{project.name}</a>
                                : project.name}
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
        this.props.router.push("/projects/add");
    };

    viewProject = (project) => {
        this.props.router.push("/projects/" + project.projectKey);
    };

    editProject = (project) => {
        this.props.router.push("/projects/" + project.projectKey + "/edit");
    };

    deleteProject = (project) => {
        Modal.confirm({
            title: "Are you sure to delete this project?",
            content: "All the items under this project will also be deleted.",
            okText: "Delete Project",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                const hide = message.loading("Deleting project...", 0);
                axios.delete("/api/projects/" + project.projectKey)
                    .then(() => {
                        hide();
                        message.success("The project is deleted successfully!");
                        this.searchProjects();
                    })
            },
        });


    };
}