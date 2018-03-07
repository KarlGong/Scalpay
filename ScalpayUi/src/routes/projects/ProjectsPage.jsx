import {Layout, Menu, Input, Icon, List, Button, Modal, Breadcrumb} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {Link} from "react-router";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import "./ProjectsPage.less";
import PageWrapper from "~/layouts/PageWrapper";
import projectModal from "~/modals/projectModal";
import global from "~/global";
import ProjectInfo from "~/components/ProjectInfo";

@observer
export default class ProjectsPage extends Component {

    @observable loading = false;
    @observable projects = [];
    searchText = null;

    componentDidMount = () => {
        this.searchProjects();
    };

    render = () => {
        return <PageWrapper
            className="projects-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Projects</Breadcrumb.Item>
            </Breadcrumb>}>
            <List
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.projects}
                header={<span>
                            <Input style={{width: "250px"}} placeholder="Search by key/name/description"
                                   onChange={(e) => this.searchText = e.target.value || null}
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
                            title={<span><ProjectInfo project={project}/></span>}
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
        projectModal.add();
    };

    editProject = (project) => {
        projectModal.edit(project);
    };

    deleteProject = (project) => {
        projectModal.del(project);
    };
}