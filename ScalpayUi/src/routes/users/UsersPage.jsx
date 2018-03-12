import {Layout, Menu, Input, Icon, List, Button, Modal, Breadcrumb} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Link} from "react-router";
import {Privilege} from "~/utils/store";
import "./UsersPage.less";
import PageWrapper from "~/layouts/PageWrapper";
import global from "~/global";
import userModal from "~/modals/userModal";
import UserInfo from "~/components/UserInfo";

@observer
export default class UsersPage extends Component {

    @observable loading = false;
    @observable users = [];
    criteria = {
        searchText: null,
        pageIndex: 0,
        pageSize: 20
    };

    componentDidMount = () => {
        this.searchUsers();
    };

    render = () => {
        return <PageWrapper
            className="users-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Users</Breadcrumb.Item>
            </Breadcrumb>}>
            <List
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.users}
                header={<span>
                        <Input style={{width: "250px"}} placeholder="Search by username/full name/email"
                               onChange={(e) => this.criteria.searchText = e.target.value || null}
                               onPressEnter={(e) => this.searchUsers()}/>
                        <Button style={{marginLeft: "10px"}} type="primary"
                                onClick={() => this.searchUsers()}>Search</Button>
                        <Button style={{float: "right"}} onClick={() => this.addUser()}>Add User</Button>
                    </span>}
                renderItem={user => {
                    return <List.Item actions={[<a className="edit" onClick={() => this.editUser(user)}>edit</a>,
                        <a className="delete" onClick={() => this.deleteUser(user)}>delete</a>]}>
                        <List.Item.Meta
                            title={<span><UserInfo user={user}/></span>}
                            description={user.email}
                        />
                        <div>{user.username}</div>
                    </List.Item>
                }}
            >
            </List>
        </PageWrapper>
    };

    searchUsers = () => {
        this.loading = true;
        axios.get("/api/users", {
            params: this.criteria
        })
            .then(response => this.users = response.data.data)
            .finally(() => this.loading = false);
    };

    addUser = () => {
        userModal.add();
    };

    editUser = (user) => {
        userModal.edit(user);
    };

    deleteUser = (user) => {
        userModal.del(user);
    };
}