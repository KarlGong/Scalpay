import {Breadcrumb, Button, List, Avatar, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import PageWrapper from "~/layouts/PageWrapper";
import {Link} from "react-router";
import global from "~/global";
import itemModal from "~/modals/itemModal/itemModal";
import projectModal from "~/modals/projectModal";
import permissionModal from "~/modals/permissionModal";
import {Role, Permission} from "~/const";
import ItemInfo from "~/components/ItemInfo";
import "./ProjectPage.less";

@observer
export default class ProjectPage extends Component {

    @observable permission = "";
    @observable project = {
        projectKey: this.props.params.projectKey,
        name: "",
        description: "",
    };
    @observable items = [];
    @observable totalCount = 0;
    @observable isLoadingItems = false;
    searchText = "";
    @observable criteria = {
        searchText: "",
        pageIndex: 0,
        pageSize: 20,
        orderBy: "itemKey"
    };

    componentDidMount = () => {
        auth.getProjectPermission(this.project.projectKey).then((permission) => {
            this.permission = permission;
            if (this.permission !== Permission.None) {
                this.loadProject();
                this.loadItems();
            } else {
                global.history.replace("/403");
            }
        });
    };

    render = () => {
        return <PageWrapper
            className="project-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/projects">Projects</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{this.project.projectKey}</Breadcrumb.Item>
            </Breadcrumb>}>
            <div className="info">
                <List.Item>
                    <List.Item.Meta
                        avatar={
                            <Avatar size="large"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"/>
                        }
                        title={this.project.projectKey}
                        description={this.project.description}
                    />
                    {
                        this.permission === Role.Admin &&
                        <span>
                            <Button icon="setting" onClick={() => this.editProject()}>
                                Edit Project
                            </Button>
                            <Button icon="team" style={{marginLeft: "10px"}} onClick={() => permissionModal.open(this.project.projectKey)}>
                                Manage Permission
                            </Button>
                        </span>
                    }
                </List.Item>
            </div>
            <List
                pagination={this.totalCount && {
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    pageSize: this.criteria.pageSize,
                    current: this.criteria.pageIndex + 1,
                    total: this.totalCount,
                    onChange: (page, pageSize) => {
                        this.criteria.pageIndex = page - 1;
                        this.criteria.pageSize = pageSize;
                        this.loadItems();
                    }
                }}
                className="list"
                loading={this.isLoadingItems}
                itemLayout="horizontal"
                dataSource={this.items}
                header={
                    <span>
                        <Input
                            style={{width: "250px"}}
                            prefix={<Icon type="search" style={{color: "rgba(0, 0, 0, .25)"}}/>}
                            allowClear
                            placeholder="Search"
                            onChange={(e) => this.searchText = e.target.value || ""}/>
                        <Button
                            style={{marginLeft: "10px"}}
                            type="primary"
                            onClick={() => {
                                this.criteria.pageIndex = 0;
                                this.criteria.searchText = this.searchText;
                                this.loadItems()
                            }}>
                            Search
                        </Button>
                        {
                            this.permission === Role.Admin &&
                            <Button
                                style={{float: "right"}}
                                icon="plus"
                                onClick={() => this.addItem()}>
                                Add Item
                            </Button>
                        }
                    </span>
                }
                renderItem={item => {
                    return <List.Item>
                        <List.Item.Meta
                            title={<ItemInfo item={item}/>}
                        />
                        <div>{item.description}</div>
                    </List.Item>
                }}
            >
            </List>
        </PageWrapper>
    };

    loadProject = () => {
        axios.get("/api/projects/" + this.props.params.projectKey)
            .then((res) => this.project = res.data);
    };

    loadItems = () => {
        this.isLoadingItems = true;
        axios.get("/api/projects/" + this.props.params.projectKey + "/items", {
            params: this.criteria
        }).then((res) => {
            this.items = res.data.data;
            this.totalCount = res.data.totalCount;
        }).finally(() => this.isLoadingItems = false);
    };

    addItem = () => {
        itemModal.add(this.project.projectKey, () => this.loadItems());
    };

    editProject = () => {
        projectModal.edit(this.project, (project) => this.project = project);
    };
}