import {Avatar, Breadcrumb, Button, Input, List} from "antd";
import {PlusOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Role} from "~/const";
import "./ProjectsPage.less";
import PageWrapper from "~/layouts/PageWrapper";
import projectModal from "~/modals/projectModal";
import ProjectInfo from "~/components/ProjectInfo";
import global from "~/global";

@observer
export default class ProjectsPage extends Component {

    @observable loading = false;
    @observable projects = [];
    @observable filterText = "";

    componentDidMount = () => {
        this.loadProjects();
    };

    render() {
        return <PageWrapper
            className="projects-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item>Projects</Breadcrumb.Item>
            </Breadcrumb>}>
            <List
                className="list"
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.projects.filter(p => p.projectKey.toLowerCase().includes(this.filterText.toLowerCase())
                    || (p.description || "").toLowerCase().includes(this.filterText.toLowerCase()))}
                header={<span>
                            <Input
                                style={{width: "250px"}}
                                prefix={<SearchOutlined style={{color: "rgba(0, 0, 0, .25)"}}/>}
                                allowClear
                                placeholder="Filter"
                                onChange={(e) => this.filterText = e.target.value || ""}/>
                    {
                        auth.user.role === Role.Admin &&
                        <Button
                            icon={<PlusOutlined />}
                            style={{float: "right"}}
                            onClick={() => this.addProject()}>
                            Create Project
                        </Button>
                    }
                            </span>}
                renderItem={project => {
                    return <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar style={{backgroundColor: "#87d068"}} icon={<UserOutlined />}/>}
                            title={<ProjectInfo project={project}/>}
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
        axios.get("/api/projects?orderBy=projectKey", {redirectOnError: true})
            .then(response => {
                this.projects = response.data.value;
            })
            .finally(() => this.loading = false);
    };

    addProject = () => {
        projectModal.add(() => this.loadProjects());
    };
}