import {Avatar, Breadcrumb, Button, Input, List, Result} from "antd";
import {PlusOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Permission, Role} from "~/const";
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
        if (this.checkPermission()) {
            this.loadProjects();
        }
    };

    checkPermission = () => {
        return auth.hasGlobalPermission(Permission.Read);
    }

    render() {
        if (!this.checkPermission()) {
            return <PageWrapper style={{background: "#f0f2f5", justifyContent: "center", alignItems: "center"}}>
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                />
            </PageWrapper>
        }

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
                                auth.hasGlobalPermission(Permission.Admin) &&
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
                            description={project.description}
                        />
                    </List.Item>
                }}
            >
            </List>
        </PageWrapper>
    };

    loadProjects = () => {
        this.isLoading = true;
        axios.get("/api/projects", {
            params: this.criteria
        }).then(res => {
            this.projects = res.data.value;
            this.totalCount = res.data.totalCount;
        }).finally(() => this.isLoading = false);
    };

    addProject = () => {
        projectModal.add(() => this.loadProjects());
    };
}