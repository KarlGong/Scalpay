import {Layout, Menu, Input, Icon, List, Button, Modal, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import "./UsersPage.less";
import PageWrapper from "~/layouts/PageWrapper";

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
                                   onKeyUp={(e) => e.keyCode === 13 && this.searchUsers()}/>
                            <Button style={{marginLeft: "10px"}} type="primary"
                                    onClick={() => this.searchUsers()}>Search</Button>
                    {auth.hasPrivileges(Privilege.UserAdd) ?
                        <Button style={{float: "right"}} onClick={() => this.addUser()}>Add User</Button>
                        : null
                    }
                    </span>}
                renderItem={user => {
                    let actions = [];
                    if (auth.hasPrivileges(Privilege.UserEdit))
                        actions.push(<a className="edit" onClick={() => this.editUser(user)}>edit</a>);
                    if (auth.hasPrivileges(Privilege.UserDelete))
                        actions.push(<a className="delete" onClick={() => this.deleteUser(user)}>delete</a>);

                    return <List.Item actions={actions}>
                        <List.Item.Meta
                            title={auth.hasPrivileges(Privilege.UserView) ?
                                <a onClick={() => this.viewUser(user)}>{user.fullName}</a>
                                : user.fullName}
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
        this.props.router.push("/users/add");
    };

    viewUser = (user) => {
        this.props.router.push("/users/" + user.username);
    };

    editUser = (user) => {
        this.props.router.push("/users/" + user.username + "/edit");
    };

    deleteUser = (user) => {
        Modal.confirm({
            title: "Are you sure to delete this user?",
            content: "All the data of this user will also be deleted.",
            okText: "Delete User",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                const hide = message.loading("Deleting user...", 0);
                axios.delete("/api/users/" + user.username)
                    .then(() => {
                        hide();
                        message.success("The user is deleted successfully!");
                        this.searchUsers();
                    }, () => hide());
            },
        });


    };
}