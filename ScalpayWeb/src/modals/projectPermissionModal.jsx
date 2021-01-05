import {Form, Input, message, Drawer, Button, List, Row, Col, Select, Icon, Spin} from "antd";
import {CloseCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import {Permission} from "~/const";
import {render, unmountComponentAtNode} from "react-dom";
import debounce from "lodash.debounce";
import "./projectPermissionModal.less";
import ProjectInfo from "~/components/ProjectInfo";
import guid from "~/utils/guid";
import UserInfo from "~/components/UserInfo";


function open(projectKey) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<ProjectPermissionModal projectKey={projectKey} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}


@observer
class ProjectPermissionModal extends Component {
    static defaultProps = {
        projectKey: "",
        afterClose: () => {}
    };
    // for add
    @observable optionalUsers = [];
    @observable isFetchingUser = false;
    lastFetchUserId = 0;
    @observable selectedUsers = [];
    selectedPermission = Permission.Read;

    // for view
    @observable projectPermissions = [];
    @observable isLoadingPermissions = false;
    @observable visible = true;

    constructor(props) {
        super(props);
        this.fetchUser = debounce(this.fetchUser, 500);
    }

    componentDidMount = () => {
        this.loadPermissions();
    };

    render() {
        return <Drawer
            title="Manage Permission"
            visible={this.visible}
            width={800}
            maskClosable={false}
            onClose={() => this.visible = false}
            afterVisibleChange={visible => !visible && this.props.afterClose()}
        >
            <List
                className="permission-modal"
                dataSource={this.projectPermissions}
                loading={this.isLoadingPermissions}
                header={<div className="add-user">
                    <Select
                        className="user-selector"
                        mode="multiple"
                        loading={this.isFetchingUser}
                        notFoundContent={this.isFetchingUser ? <Spin size="small"/> : "No matching users found"}
                        placeholder="Add Users"
                        filterOption={false}
                        value={this.selectedUsers}
                        onSearch={this.fetchUser}
                        onChange={(value) => this.selectedUsers = value}
                    >
                        {this.optionalUsers.map(u =>
                            <Select.Option key={u.username} value={u.username}>{u.username}</Select.Option>)}
                    </Select>
                    <Select className="permission-selector" onChange={value => this.selectedPermission = value}
                            defaultValue={this.selectedPermission}>
                        {
                            Object.entries(Permission).map(([key, value]) => <Select.Option key={value} value={value}>{key}</Select.Option>)
                        }
                    </Select>
                    <Button className="add" type="primary" disabled={!this.selectedUsers.length}
                            onClick={this.addPermissions}>Add</Button>
                </div>}
                renderItem={projectPermission =>
                    <List.Item key={projectPermission.key}>
                        <div className="permission">
                            <div className="user">
                                <UserInfo username={projectPermission.username}></UserInfo>
                            </div>
                            <Select
                                className="permission-selector"
                                onChange={value => {
                                    projectPermission.permission = value;
                                    this.updatePermission(projectPermission)
                                }}
                                defaultValue={projectPermission.permission}>
                                {
                                    Object.entries(Permission)
                                        .filter(([key, value]) => key !== Permission.None)
                                        .map(([key, value]) =>
                                            <Select.Option key={value} value={value}>{key}</Select.Option>)
                                }
                            </Select>
                            <CloseCircleOutlined className="delete" onClick={() => this.deletePermission(projectPermission)}/>
                        </div>
                    </List.Item>}
            />
        </Drawer>
    };

    loadPermissions = () => {
        this.isLoadingPermissions = true;
        axios.get(`/api/projects/${this.props.projectKey}/permissions?orderBy=username`)
            .then((res) =>
                this.projectPermissions = res.data.value.map(p => {
                    p.key = guid();
                    return p;
                })
            ).finally(() => this.isLoadingPermissions = false);
    };

    fetchUser = (value) => {
        if (!value) return;
        this.lastFetchUserId += 1;
        const fetchUserId = this.lastFetchUserId;
        this.isFetchingUser = true;
        axios.get("/api/users", {
            params: {
                keyword: value,
                orderBy: "username",
                pageIndex: 0,
                pageSize: 10
            }
        }).then((res) => {
            if (fetchUserId !== this.lastFetchUserId) return;
            this.optionalUsers = res.data.value;
        }).finally(() => this.isFetchingUser = false);
    };

    addPermissions = () => {
        if (!this.selectedUsers.length) return;
        Promise.all(
            this.selectedUsers.map(user => {
                if (this.projectPermissions.filter(p => p.username === user).length) { // permission is already existing
                    return axios.put(`/api/projects/${this.props.projectKey}/permissions/${user}`, {
                        projectKey: this.props.projectKey,
                        username: user,
                        permission: this.selectedPermission
                    })
                }

                return axios.post(`/api/projects/${this.props.projectKey}/permissions`, {
                    projectKey: this.props.projectKey,
                    username: user,
                    permission: this.selectedPermission
                })
            })).then(res => {
            this.loadPermissions();
            message.success(<span>New permissions have been added.</span>);
            this.selectedUsers = [];
        });
    };

    updatePermission = (permission) => {
        axios.put(`/api/projects/${permission.projectKey}/permissions/${permission.username}`, permission)
            .then(res => {
                this.loadPermissions();
                message.success(<span>Permission has been updated.</span>);
            })
    };

    deletePermission = (permission) => {
        axios.delete(`/api/projects/${permission.projectKey}/permissions/${permission.username}`)
            .then(res => {
                this.loadPermissions();
                message.success(<span>Permission has been removed.</span>);
            });
    }
}

export default {open};