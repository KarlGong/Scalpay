import {Breadcrumb, Button, List, Avatar, Input, Result} from "antd";
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
import projectPermissionModal from "~/modals/projectPermissionModal";
import {Role, Permission} from "~/const";
import ItemInfo from "~/components/ItemInfo";
import "./ProjectPage.less";
import ExpressionView from "~/components/expression/ExpressionView";

@observer
export default class ProjectPage extends Component {

    @observable project = {
        projectKey: this.props.params.projectKey,
        name: "",
        description: "",
    };
    @observable items = [];
    @observable isLoadingItems = false;
    @observable criteria = {
        keyword: null,
        pageIndex: 0,
        pageSize: 20,
        orderBy: "itemKey"
    };
    @observable totalCount = 0;

    componentDidMount = () => {
        if (this.checkPermission()) {
            this.loadProject();
            this.loadItems();
        }
    };

    checkPermission = () => {
        return auth.hasProjectPermission(this.props.params.projectKey, Permission.Read);
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
                        auth.hasProjectPermission(this.project.projectKey, Permission.Admin) &&
                        <span>
                            <Button icon={<EditOutlined />} onClick={() => this.editProject()}>
                                Edit Project
                            </Button>
                            <Button icon={<TeamOutlined />} style={{marginLeft: "10px"}} onClick={() => projectPermissionModal.open(this.project.projectKey)}>
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
                            onChange={(e) => this.criteria.keyword = e.target.value || null}/>
                        <Button
                            style={{marginLeft: "10px"}}
                            type="primary"
                            onClick={() => {
                                this.criteria.pageIndex = 0;
                                this.loadItems();
                            }}>
                            Search
                        </Button>
                        {
                            auth.hasProjectPermission(this.project.projectKey, Permission.Admin) &&
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
                    let actions = [];
                    auth.hasProjectPermission(this.project.projectKey, Permission.Admin) && actions.push(<a className="edit" onClick={() => this.editItem(item)}>edit</a>)
                    return <List.Item actions={actions}>
                        <List.Item.Meta
                            title={<ItemInfo item={item}/>}
                            description={item.description || ""}
                        />
                        <ExpressionView topLevel expression={item.defaultResult}/>
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
            this.items = res.data.value;
            this.totalCount = res.data.totalCount;
        }).finally(() => this.isLoadingItems = false);
    };

    addItem = () => {
        itemModal.add(this.project.projectKey, () => this.loadItems());
    };

    editItem = (item) => {
        itemModal.edit(item, () => this.loadItems());
    };

    editProject = () => {
        projectModal.edit(this.project, () => this.loadProject());
    };
}