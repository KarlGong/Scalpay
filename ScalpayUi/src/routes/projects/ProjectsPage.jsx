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
import guid from "~/utils/guid";

@observer
export default class ProjectsPage extends Component {

    @observable loading = false;
    @observable projects = [];
    @observable totalCount = 0;
    @observable filterRestKey = guid();

    @observable criteria = {
        searchText: this.props.location.query.searchText || null,
        pageIndex: parseInt(this.props.location.query.pageIndex) || 0,
        pageSize: parseInt(this.props.location.query.pageSize) || 20
    };
    filter = {searchText: this.criteria.searchText};

    componentDidMount = () => {
        this.searchProjects();
    };

    componentWillReceiveProps = (props) => {
        if (JSON.stringify(this.props.location.query) !== JSON.stringify(props.location.query)){
            this.criteria = {
                searchText: props.location.query.searchText || null,
                pageIndex: parseInt(props.location.query.pageIndex) || 0,
                pageSize: parseInt(props.location.query.pageSize) || 20
            };
            this.filter = {searchText: this.criteria.searchText};
            this.filterRestKey = guid();
        }
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
                pagination={{
                    showTotal: (total, range) => total ? `${range[0]}-${range[1]} of ${total} projects` : "0-0 of 0 projects",
                    pageSize: this.criteria.pageSize,
                    current: this.criteria.pageIndex + 1,
                    total: this.totalCount,
                    onChange: (page, pageSize) => {
                        this.criteria.pageIndex = page - 1;
                        this.criteria.pageSize = pageSize;
                        global.history.pushQueryParams(this.criteria);
                    }
                }}
                className="list"
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.projects}
                header={<span key={this.filterRestKey}>
                            <Input
                                style={{width: "250px"}}
                                placeholder="Search by key/name/description"
                                defaultValue={untracked(() => this.criteria.searchText)}
                                onChange={(e) => this.filter.searchText = e.target.value || null}/>
                            <Button
                                style={{marginLeft: "10px"}}
                                type="primary"
                                onClick={() => {
                                    this.criteria = Object.assign(this.criteria, this.filter);
                                    this.criteria.pageIndex = 0;
                                    global.history.pushQueryParams(this.criteria);
                                }}>Search</Button>
                    {auth.hasPrivileges(Privilege.ProjectAdd) ?
                        <Button
                            style={{float: "right"}}
                            onClick={() => this.addProject()}>Add Project</Button>
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
            params: this.criteria
        })
            .then(response => {
                this.projects = response.data.data;
                this.totalCount = response.data.totalCount;
            })
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