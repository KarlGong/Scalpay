import {Layout, Menu, Input, Icon, Form, Spin, Button, Modal, Breadcrumb, Row, Col, Divider} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import moment from "moment";
import Validator from "~/utils/Validator";
import {Link} from "react-router";
import global from "~/global";
import FieldsViewer from "~/layouts/FieldsViewer";
import CommandBar from "~/layouts/CommandBar";
import configItemModal from "~/modals/configItemModal/configItemModal";
import ProjectInfo from "~/components/ProjectInfo";
import Block from "~/layouts/Block";
import "./ViewConfigItemPage.less";

@observer
export default class ViewConfigItemPage extends Component {

    @observable item = {};
    @observable loading = false;

    componentDidMount = () => {
        this.loadItem();
    };

    render = () => {
        let commands = [];
        if (auth.hasPrivileges(Privilege.ItemEdit)) {
            commands.push(<Button size="small" onClick={() => this.editItem()}>Edit</Button>);
        }
        if (auth.hasPrivileges(Privilege.ItemDelete)) {
            commands.push(<Button type="danger" size="small" onClick={() => this.deleteItem()}>Delete</Button>)
        }

        return <PageWrapper
            className="view-item-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/items">Items</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Config</Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.params.itemKey}</Breadcrumb.Item>
            </Breadcrumb>}>
            <CommandBar leftItems={commands}/>
            <Layout style={{width: "600px"}}>
                <Spin spinning={this.loading}>
                    <Block name="Basic">
                        <FieldsViewer fields={[
                            ["Project", <ProjectInfo project={this.item.project}/>],
                            ["Item Key", this.item.itemKey],
                            ["Name", this.item.name],
                            ["Description", this.item.description],
                            ["Create Time", moment(this.item.insertTime).fromNow()],
                            ["Update Time", moment(this.item.updateTime).fromNow()],
                        ]}/>
                    </Block>
                    <Block name="Parameters">
                        abc
                    </Block>
                </Spin>
            </Layout>
        </PageWrapper>
    };

    loadItem = () => {
        this.loading = true;
        axios.get("/api/items/config/" + this.props.params.itemKey)
            .then((res) => this.item = res.data)
            .finally(() => this.loading = false);
    };

    editItem = () => {
        configItemModal.edit(this.item, (item) => this.loadItem());
    };

    deleteItem = () => {
        configItemModal.del(this.item, (item) => global.history.goBack());
    }
}