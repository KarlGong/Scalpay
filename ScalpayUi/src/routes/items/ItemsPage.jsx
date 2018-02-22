import {Layout, Menu, Input, Icon, List, Button, Modal, message, Table, Select} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import "./ItemsPage.less";
import PageWrapper from "~/layouts/PageWrapper";
import ItemFilter from "~/components/ItemFilter";
import global from "~/global";

@observer
export default class ItemsPage extends Component {

    @observable loading = false;
    @observable projects = [];
    searchText = null;

    componentDidMount = () => {
        // this.searchItems();
    };

    render = () => {
        return <PageWrapper className="items-page">
            <div>
                <ItemFilter/>
            </div>
        </PageWrapper>
    };

    searchItems = () => {
        this.loading = true;
        axios.get("/api/items", {
            params: {
                searchText: this.searchText
            }
        })
            .then(response => this.projects = response.data)
            .finally(() => this.loading = false);
    };

    viewProject = (project) => {
        global.history.push("/items/" + project.projectKey);
    };
}