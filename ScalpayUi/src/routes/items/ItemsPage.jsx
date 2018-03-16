import {Layout, Menu, Input, Icon, List, Button, Modal, message, Table, Breadcrumb} from "antd";
import React, {PureComponent, Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import {Link} from "react-router";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import ProjectSelect from "~/components/ProjectSelect";
import ItemInfo from "~/components/ItemInfo";
import itemModal from "~/modals/itemModal/itemModal";
import global from "~/global";
import ProjectInfo from "~/components/ProjectInfo";
import "./ItemsPage.less";
import guid from "~/utils/guid";

@observer
export default class ItemsPage extends Component {

    @observable loading = false;
    @observable items = [];
    @observable totalCount = 0;
    @observable filterRestKey = guid();

    @observable criteria = {
        projectKey: this.props.location.query.projectKey || null,
        searchText: this.props.location.query.searchText || null,
        pageIndex: parseInt(this.props.location.query.pageIndex) || 0,
        pageSize: parseInt(this.props.location.query.pageSize) || 20
    };
    filter = {
        projectKey: this.criteria.projectKey,
        searchText: this.criteria.searchText
    };

    componentDidMount = () => {
        this.searchItems();
    };

    componentWillReceiveProps = (props) => {
        if (JSON.stringify(this.props.location.query) !== JSON.stringify(props.location.query)) {
            this.criteria = {
                projectKey: props.location.query.projectKey || null,
                searchText: props.location.query.searchText || null,
                pageIndex: parseInt(props.location.query.pageIndex) || 0,
                pageSize: parseInt(props.location.query.pageSize) || 20
            };
            this.filter = {
                projectKey: this.criteria.projectKey,
                searchText: this.criteria.searchText
            };
            this.filterRestKey = guid();
        }
        this.searchItems();
    };

    render = () => {
        return <PageWrapper
            className="items-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Items</Breadcrumb.Item>
            </Breadcrumb>}>
            <List
                pagination={{
                    showTotal: (total, range) => total ? `${range[0]}-${range[1]} of ${total} items` : "0-0 of 0 items",
                    pageSize: this.criteria.pageSize,
                    current: this.criteria.pageIndex + 1,
                    total: this.totalCount,
                    onChange: (page, pageSize) => {
                        this.criteria.pageIndex = page - 1;
                        this.criteria.pageSize = pageSize;
                        global.history.pushQueryParams(this.criteria);
                    }
                }}
                className="list"
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.items}
                header={<div key={this.filterRestKey} className="item-filter">
                    <ProjectSelect
                        allowClear
                        className="filter select"
                        defaultValue={untracked(() => this.criteria.projectKey)}
                        onChange={(value) => this.filter.projectKey = value || null}/>
                    <Input
                        className="filter input"
                        placeholder="Search by item key/name/description"
                        defaultValue={untracked(() => this.criteria.searchText)}
                        onChange={(e) => this.filter.searchText = e.target.value || null}/>
                    <Button type="primary" onClick={() => {
                        this.criteria = Object.assign(this.criteria, this.filter);
                        this.criteria.pageIndex = 0;
                        global.history.pushQueryParams(this.criteria);
                    }}>Search</Button>
                </div>}
                renderItem={item => {
                    let actions = [];
                    if (auth.hasPrivileges(Privilege.ItemEdit))
                        actions.push(<a className="edit" onClick={() => this.editItem(item)}>edit</a>);
                    if (auth.hasPrivileges(Privilege.ItemDelete))
                        actions.push(<a className="delete" onClick={() => this.deleteItem(item)}>delete</a>);

                    return <List.Item actions={actions}>
                        <List.Item.Meta
                            title={<span><ProjectInfo project={item.project}/> / <ItemInfo item={item}/></span>}
                            description={item.description}
                        />
                        <div>{item.itemKey}</div>
                    </List.Item>
                }}
            >
            </List>
        </PageWrapper>
    };

    searchItems = () => {
        this.loading = true;
        axios.get("/api/items", {
            params: this.criteria
        })
            .then(response => {
                this.items = response.data.data;
                this.totalCount = response.data.totalCount;
            })
            .finally(() => this.loading = false);
    };

    editItem = (item) => {
        itemModal.edit(item);
    };

    deleteItem = (item) => {
        itemModal.del(item);
    };
}