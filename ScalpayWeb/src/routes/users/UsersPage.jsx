import {Breadcrumb, Button, Input, List, Tooltip} from "antd";
import {PlusOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import axios from "axios";
import {Link} from "react-router";
import "./UsersPage.less";
import PageWrapper from "~/layouts/PageWrapper";
import global from "~/global";
import userModal from "~/modals/userModal";
import UserInfo from "~/components/UserInfo";
import guid from "~/utils/guid";
import {Permission, Role} from "~/const";

@observer
export default class UsersPage extends Component {

    @observable loading = false;
    @observable users = [];
    @observable totalCount = 0;
    @observable criteria = {
        keyword: null,
        pageIndex: 0,
        pageSize: 20,
        orderBy: "username"
    };

    componentDidMount = () => {
        this.loadUsers();
    };

    render() {
        return <PageWrapper
            className="users-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item>Users</Breadcrumb.Item>
            </Breadcrumb>}>
            <List
                pagination={this.totalCount ? {
                    showTotal: (total, range) =>`${range[0]}-${range[1]} of ${total} users`,
                    pageSize: this.criteria.pageSize,
                    current: this.criteria.pageIndex + 1,
                    total: this.totalCount,
                    onChange: (page, pageSize) => {
                        this.criteria.pageIndex = page - 1;
                        this.criteria.pageSize = pageSize;
                        this.loadUsers();
                    }
                }: null}
                className="list"
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.users}
                header={<span>
                        <Input
                            style={{width: "250px"}}
                            placeholder="Search"
                            prefix={<SearchOutlined style={{color: "rgba(0, 0, 0, .25)"}}/>}
                            allowClear
                            onChange={(e) => this.criteria.keyword = e.target.value || null}/>
                        <Button
                            style={{marginLeft: "10px"}}
                            type="primary"
                            onClick={() => {
                                this.criteria.pageIndex = 0;
                                this.loadUsers();
                            }}>Search</Button>
                        <Button
                            icon={<PlusOutlined/>}
                            style={{float: "right"}}
                            onClick={() => this.addUser()}>Add User</Button>
                    </span>}
                renderItem={user => {
                    return <List.Item actions={[<a className="edit" onClick={() => this.editUser(user)}>edit</a>]}>
                        <List.Item.Meta
                            title={<span><UserInfo username={user.username}/> - {user.fullName} {user.role === Role.Admin && <Tooltip title="Admin"><UserOutlined /></Tooltip>}</span>}
                            description={user.email}
                        />
                    </List.Item>
                }}
            >
            </List>
        </PageWrapper>
    };

    loadUsers = () => {
        this.loading = true;
        axios.get("/api/users", {
            params: this.criteria,
            redirectOnError: true
        }).then(response => {
            this.users = response.data.value;
            this.totalCount = response.data.totalCount;
        }).finally(() => this.loading = false);
    };

    addUser = () => {
        userModal.add(() => this.loadUsers());
    };

    editUser = (user) => {
        userModal.edit(user, () => this.loadUsers());
    };
}