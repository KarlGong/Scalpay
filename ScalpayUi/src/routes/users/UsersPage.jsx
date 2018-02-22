import {Layout, Menu, Input, Icon, List, Button, Modal, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import "./UsersPage.less";
import PageWrapper from "~/layouts/PageWrapper";
import global from "~/global";
import addUserModal from "~/modals/addUserModal";
import deleteUserModal from "~/modals/deleteUserModal";

@observer
export default class UsersPage extends Component {

    @observable loading = false;
    @observable users = [];
    searchText = null;

    componentDidMount = () => {
        this.searchUsers();
    };

    render = () => {
        return <PageWrapper className="users-page">
            <List
                className="list"
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.users}
                header={<span>
                        <Input style={{width: "250px"}} placeholder="By username/full name/email"
                               onChange={(e) => this.searchText = e.target.value}
                               onPressEnter={(e) => this.searchUsers()}/>
                        <Button style={{marginLeft: "10px"}} type="primary"
                                onClick={() => this.searchUsers()}>Search</Button>
                        <Button style={{float: "right"}} onClick={() => this.addUser()}>Add User</Button>
                    </span>}
                renderItem={user => {
                    return <List.Item actions={[<a className="edit" onClick={() => this.editUser(user)}>edit</a>,
                        <a className="delete" onClick={() => this.deleteUser(user)}>delete</a>]}>
                        <List.Item.Meta
                            title={<a onClick={() => this.viewUser(user)}>{user.fullName}</a>}
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
            params: {
                searchText: this.searchText
            }
        })
            .then(response => this.users = response.data)
            .finally(() => this.loading = false);
    };

    addUser = () => {
        addUserModal.open(() => this.searchUsers());
    };

    viewUser = (user) => {
        global.history.push("/users/" + user.username);
    };

    editUser = (user) => {
        global.history.push("/users/" + user.username + "/edit");
    };

    deleteUser = (user) => {
        deleteUserModal.open(user, () => this.searchUsers());
    };
}