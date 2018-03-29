import {Breadcrumb, Button, Input, List} from "antd";
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

@observer
export default class UsersPage extends Component {

    @observable loading = false;
    @observable users = [];
    @observable totalCount = 0;
    @observable filterRestKey = guid();

    @observable criteria = {
        searchText: this.props.location.query.searchText || null,
        pageIndex: parseInt(this.props.location.query.pageIndex) || 0,
        pageSize: parseInt(this.props.location.query.pageSize) || 20
    };
    filter = {searchText: this.criteria.searchText};

    componentDidMount = () => {
        this.searchUsers();
    };

    componentWillReceiveProps = (props) => {
        if (JSON.stringify(this.props.location.query) !== JSON.stringify(props.location.query)) {
            this.criteria = {
                searchText: props.location.query.searchText || null,
                pageIndex: parseInt(props.location.query.pageIndex) || 0,
                pageSize: parseInt(props.location.query.pageSize) || 20
            };
            this.filter = {searchText: this.criteria.searchText};
            this.filterRestKey = guid();
        }
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
                pagination={this.totalCount ? {
                    showTotal: (total, range) =>`${range[0]}-${range[1]} of ${total} users`,
                    pageSize: this.criteria.pageSize,
                    current: this.criteria.pageIndex + 1,
                    total: this.totalCount,
                    onChange: (page, pageSize) => {
                        this.criteria.pageIndex = page - 1;
                        this.criteria.pageSize = pageSize;
                        global.history.pushQueryParams(this.criteria);
                    }
                }: null}
                className="list"
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.users}
                header={<span key={this.filterRestKey}>
                        <Input
                            style={{width: "250px"}}
                            placeholder="Search by username/full name/email"
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
                        <Button
                            style={{float: "right"}}
                            onClick={() => this.addUser()}>Add User</Button>
                    </span>}
                renderItem={user => {
                    return <List.Item actions={[<a className="edit" onClick={() => this.editUser(user)}>edit</a>]}>
                        <List.Item.Meta
                            title={<span><UserInfo username={user.username}/> - {user.fullName}</span>}
                            description={user.email}
                        />
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
            .then(response => {
                this.users = response.data.data;
                this.totalCount = response.data.totalCount;
            })
            .finally(() => this.loading = false);
    };

    addUser = () => {
        userModal.add();
    };

    editUser = (user) => {
        userModal.edit(user);
    };
}