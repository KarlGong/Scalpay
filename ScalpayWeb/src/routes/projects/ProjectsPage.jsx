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

    @observable isLoading = false;
    @observable projects = [];
    @observable criteria = {
        keyword: null,
        pageIndex: 0,
        pageSize: 20,
        orderBy: "projectKey"
    };
    @observable totalCount = 0;

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
                pagination={this.totalCount && {
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    pageSize: this.criteria.pageSize,
                    current: this.criteria.pageIndex + 1,
                    total: this.totalCount,
                    onChange: (page, pageSize) => {
                        this.criteria.pageIndex = page - 1;
                        this.criteria.pageSize = pageSize;
                        this.loadProjects();
                    }
                }}
                className="list"
                loading={this.isLoading}
                itemLayout="horizontal"
                dataSource={this.projects}
                header={<span>
                            <Input
                               style={{width: "250px"}}
                               prefix={<SearchOutlined style={{color: "rgba(0, 0, 0, .25)"}}/>}
                               allowClear
                               placeholder="Search"
                               onChange={(e) => this.criteria.keyword = e.target.value || null}/>
                           <Button
                            style={{marginLeft: "10px"}}
                            type="primary"
                            onClick={() => {
                                this.criteria.pageIndex = 0;
                                this.loadProjects();
                            }}>
                                Search
                            </Button>
                            {
                                auth.user.role === Role.Admin &&
                                <Button
                                    icon={<PlusOutlined/>}
                                    style={{float: "right"}}
                                    onClick={() => this.addProject()}>
                                    Add Project
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
        this.isLoading = true;
        axios.get("/api/projects", {
            params: this.criteria,
            redirectOnError: true
        }).then(res => {
            this.projects = res.data.value;
            this.totalCount = res.data.totalCount;
        }).finally(() => this.isLoading = false);
    };

    addProject = () => {
        projectModal.add(() => this.loadProjects());
    };
}