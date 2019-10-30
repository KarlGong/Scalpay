import {Avatar, Breadcrumb, Button, Input, List} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import axios from "axios";
import {Link} from "react-router";
import auth from "~/utils/auth";
import {Role} from "~/utils/store";
import "./ProjectsPage.less";
import PageWrapper from "~/layouts/PageWrapper";
import projectModal from "~/modals/projectModal";
import global from "~/global";
import guid from "~/utils/guid";

@observer
export default class ProjectsPage extends Component {

    @observable loading = false;
    @observable projects = [];
    @observable filterText = "";

    componentDidMount = () => {
        this.loadProjects();
    };

    render = () => {
        return <PageWrapper
            className="projects-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/projects">Projects</Link></Breadcrumb.Item>
            </Breadcrumb>}>
            <List
                className="list"
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.projects.filter(p => p.projectKey.toLowerCase().includes(this.filterText.toLowerCase())
                    || p.name.toLowerCase().includes(this.filterText.toLowerCase()))}
                header={<span>
                            <Input
                                style={{width: "250px"}}
                                allowClear
                                placeholder="Filter"
                                onChange={(e) => this.filterText = e.target.value || ""}/>
                    {
                        auth.user.role == Role.admin &&
                        <Button
                            style={{float: "right"}}
                            onClick={() => this.addProject()}>
                            Create Project
                        </Button>
                    }
                            </span>}
                renderItem={project => {
                    return <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar style={{backgroundColor: "#87d068"}} icon="user"/>}
                            title={<a onClick={() => global.history.push("/projects/" + project.projectKey)}>
                                {project.name}
                            </a>}
                            description={project.projectKey}
                        />
                        <div>{project.description}</div>
                    </List.Item>
                }}
            >
            </List>
        </PageWrapper>
    };

    loadProjects = () => {
        this.loading = true;
        axios.get("/api/projects")
            .then(response => {
                this.projects = response.data.data;
            })
            .finally(() => this.loading = false);
    };

    addProject = () => {
        projectModal.add(() => this.loadProjects());
    };
}