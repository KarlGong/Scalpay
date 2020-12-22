import {Breadcrumb, Button, List, Avatar, Input} from "antd";
import {EditOutlined, PlusOutlined, SearchOutlined, TeamOutlined} from "@ant-design/icons";
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
    @observable isLoadingItems = false;
    searchText = "";
    @observable criteria = {
        keyword: "",
        pageIndex: 0,
        pageSize: 20,
        orderBy: "itemKey"
    };
    @observable totalCount = 0;

    componentDidMount = () => {
        this.loadProject();
        this.loadItems();
    };

    render() {
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
                            <Button icon={<EditOutlined />} onClick={() => this.editProject()}>
                                Edit Project
                            </Button>
                            <Button icon={<TeamOutlined />} style={{marginLeft: "10px"}} onClick={() => permissionModal.open(this.project.projectKey)}>
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
                            prefix={<SearchOutlined style={{color: "rgba(0, 0, 0, .25)"}}/>}
                            allowClear
                            placeholder="Search"
                            onChange={(e) => this.searchText = e.target.value || ""}/>
                        <Button
                            style={{marginLeft: "10px"}}
                            type="primary"
                            onClick={() => {
                                this.criteria.pageIndex = 0;
                                this.criteria.keyword = this.searchText;
                                this.loadItems();
                            }}>
                            Search
                        </Button>
                        {
                            this.permission === Role.Admin &&
                            <Button
                                style={{float: "right"}}
                                icon={<PlusOutlined />}
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
        axios.get("/api/projects/" + this.props.params.projectKey, {redirectOnError: true})
            .then((res) => this.project = res.data);
    };

    loadItems = () => {
        this.isLoadingItems = true;
        axios.get("/api/projects/" + this.props.params.projectKey + "/items", {
            params: this.criteria
        }).then((res) => {
            this.items = res.data.value;
            this.totalCount = res.data.totalCount;
        }).finally(() => this.isLoadingItems = false);
    };

    addItem = () => {
        itemModal.add(this.project.projectKey, () => this.loadItems());
    };

    editProject = () => {
        projectModal.edit(this.project, () => this.loadProject());
    };
}