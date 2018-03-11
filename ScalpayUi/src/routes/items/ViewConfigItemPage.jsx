import {Layout, Menu, Input, Icon, Form, Spin, Button, Modal, Breadcrumb, Row, Col, Divider} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import moment from "moment";
import {DataType, ItemType, ConfigItemMode, DefaultExp} from "~/utils/store";
import Validator from "~/utils/Validator";
import {Link} from "react-router";
import guid from "~/utils/guid";
import global from "~/global";
import FieldsViewer from "~/layouts/FieldsViewer";
import CommandBar from "~/layouts/CommandBar";
import configItemModal from "~/modals/configItemModal/configItemModal";
import ProjectInfo from "~/components/ProjectInfo";
import Block from "~/layouts/Block";
import ExpressionView from "~/components/expression/ExpressionView";
import "./ViewConfigItemPage.less";

@observer
export default class ViewConfigItemPage extends Component {

    @observable item = {
        projectKey: null,
        itemKey: null,
        name: null,
        description: null,
        mode: ConfigItemMode.Property,
        parameterInfos: [],
        resultDataType: DataType.String,
        rules: [],
        defaultResult: DefaultExp.String
    };
    @observable loading = false;

    componentDidMount = () => {
        this.loadItem();
    };

    render = () => {
        let commands = [];
        if (auth.hasPrivileges(Privilege.ItemEdit)) {
            commands.push(<Button onClick={() => this.editItem()}>Edit</Button>);
        }
        if (auth.hasPrivileges(Privilege.ItemDelete)) {
            commands.push(<Button type="danger" onClick={() => this.deleteItem()}>Delete</Button>)
        }

        let conditionWidth = 16;
        let resultWidth = 8;
        let gutterWidth = 12;

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
                    {
                        this.item.mode === ConfigItemMode.Property ?
                            <Block name="Property">
                                <FieldsViewer fields={[
                                    ["Result Data Type", this.item.resultDataType],
                                    ["Result", <ExpressionView expression={this.item.defaultResult}/>]
                                ]}/>
                            </Block>
                            : null
                    }
                    {
                        this.item.mode === ConfigItemMode.Raw ?
                            <Block name="Parameters & Result">
                                <FieldsViewer
                                    fields={this.item.parameterInfos.map(info => [info.name, info.dataType])}/>
                                <FieldsViewer fields={[[
                                    <b>Result Data Type</b>,
                                    <b>{this.item.resultDataType}</b>
                                ]]}/>
                            </Block>
                            : null
                    }
                    {
                        this.item.mode === ConfigItemMode.Raw ?
                            <Block name="Rules" className="rules">
                                <Row gutter={gutterWidth} type="flex" align="middle" className="rule">
                                    <Col span={conditionWidth}><b>Condition</b></Col>
                                    <Col span={resultWidth}><b>Result</b></Col>
                                </Row>
                                {
                                    this.item.rules.map(rule =>
                                        <Row key={rule.key} gutter={gutterWidth} type="flex" align="middle"
                                             className="rule">
                                            <Col span={conditionWidth}><ExpressionView
                                                expression={rule.condition}/></Col>
                                            <Col span={resultWidth}><ExpressionView expression={rule.result}/></Col>
                                        </Row>)
                                }
                                <Row gutter={gutterWidth} type="flex" align="middle"
                                     className="rule">
                                    <Col span={conditionWidth}><b>Default</b></Col>
                                    <Col span={resultWidth}><ExpressionView expression={this.item.defaultResult}/></Col>
                                </Row>
                            </Block>
                            : null
                    }
                </Spin>
            </Layout>
        </PageWrapper>
    };

    loadItem = () => {
        this.loading = true;
        axios.get("/api/items/config/" + this.props.params.itemKey)
            .then((res) => {
                let item = res.data;
                item.rules.map(r => r.key = guid());
                this.item = item;
            })
            .finally(() => this.loading = false);
    };

    editItem = () => {
        configItemModal.edit(this.item, (item) => this.loadItem());
    };

    deleteItem = () => {
        configItemModal.del(this.item, (item) => global.history.goBack());
    }
}