import {Layout, Menu, Input, Icon, List, Button, Modal, message, Table, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import "./ItemsPage.less";
import PageWrapper from "~/layouts/PageWrapper";
import ProjectSelect from "~/components/ProjectSelect";
import ItemTypeSelect from "~/components/ItemTypeSelect";
import ItemInfo from "~/components/ItemInfo";
import {ItemType} from "~/utils/store";
import configItemModal from "~/modals/configItemModal";
import global from "~/global";
import ProjectInfo from "~/components/ProjectInfo";

@observer
export default class ItemsPage extends Component {

    @observable loading = false;
    @observable items = [];
    searchParams = {
        projectKey: null,
        itemType: null,
        searchText: null
    };

    componentDidMount = () => {
        this.searchItems();
    };

    render = () => {
        return <PageWrapper className="items-page">
            <List
                className="list"
                loading={this.loading}
                itemLayout="horizontal"
                dataSource={this.items}
                header={<div className="item-filter">
                    <ProjectSelect
                        allowClear
                        className="filter select"
                        onChange={(value) => this.searchParams.projectKey = value} />
                    <ItemTypeSelect
                        allowClear
                        className="filter select"
                        onChange={(value) => this.searchParams.itemType = value} />
                    <Input
                        className="filter input"
                        placeholder="Search by item key/name/description"
                        onChange={(e) => this.searchParams.searchText = e.target.value || null} />
                    <Button type="primary" onClick={() => this.searchItems()}>Search</Button>
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
            params: this.searchParams
        })
            .then(response => this.items = response.data)
            .finally(() => this.loading = false);
    };

    editItem = (item) => {
        if (item.type === ItemType.Config) {
            configItemModal.edit(item)
        }
    };

    deleteItem = (item) => {
        if (item.type === ItemType.Config) {
            configItemModal.del(item)
        }
    };
}