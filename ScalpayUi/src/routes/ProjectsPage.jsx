import {Layout, Menu, Input, Icon, List, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
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
                        <Button style={{float: "right"}}>Add Project</Button>
                    </span>}
                    renderItem={item => (
                        <List.Item actions={[<a>edit</a>, <a className="delete">delete</a>]}>
                            <List.Item.Meta
                                title={<a>{item.name}</a>}
                                description={item.description}
                            />
                            <div>{item.projectKey}</div>
                        </List.Item>
                    )}
                >
                </List>
        </PageWrapper>
    };

    searchProjects = () => {
        this.loading = true;
        axios.get("/api/projects", {
            params: {
                partialText: this.searchText
            }
        })
            .then(response => this.projects = response.data)
            .finally(() => this.loading = false);
    }
}