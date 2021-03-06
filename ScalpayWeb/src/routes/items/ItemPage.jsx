import {Avatar, Breadcrumb, Button, Col, Layout, List, Row, Descriptions, Result} from "antd";
import {EditOutlined} from "@ant-design/icons";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {DataType, DefaultExp, Role, Permission} from "~/const";
import PageWrapper from "~/layouts/PageWrapper";
import {Link} from "react-router";
import guid from "~/utils/guid";
import global from "~/global";
import itemModal from "~/modals/itemModal/itemModal";
import ProjectInfo from "~/components/ProjectInfo";
import Block from "~/layouts/Block";
import ExpressionView from "~/components/expression/ExpressionView";
import AuditsView from "~/components/AuditsView";
import "./ItemPage.less";

@observer
export default class ItemPage extends Component {

    @observable permission = Permission.Admin;
    @observable item = {
        projectKey: this.props.params.projectKey,
        itemKey: this.props.params.itemKey,
        name: null,
        description: null,
        parameterInfos: [],
        resultDataType: DataType.String,
        rules: [],
        defaultResult: DefaultExp.String
    };
    @observable loading = false;

    componentDidMount = () => {
        if (this.checkPermission()) {
            this.loadItem();
        }
    };

    checkPermission = () => {
        return auth.hasProjectPermission(this.props.params.projectKey, Permission.Read);
    }

    render() {
        if (!this.checkPermission()) {
            return <PageWrapper style={{background: "#f0f2f5", justifyContent: "center", alignItems: "center"}}>
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                />
            </PageWrapper>
        }

        let conditionWidth = 16;
        let resultWidth = 8;

        return <PageWrapper
            className="item-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/projects">Projects</Link></Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to={`/projects/${this.item.projectKey}`}>{this.item.projectKey}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.item.itemKey}</Breadcrumb.Item>
            </Breadcrumb>}>
            <div className="info">
                <List.Item>
                    <List.Item.Meta
                        title={this.item.itemKey}
                        description={this.item.description || ""}
                    />
                    {
                        auth.hasProjectPermission(this.item.projectKey, Permission.Admin) &&
                        <Button icon={<EditOutlined />} onClick={() => this.editItem()}>
                            Edit Item
                        </Button>
                    }
                </List.Item>
            </div>
            <Block name="Basic">
                <Row>
                    <Col span={4}>
                        Result Data Type
                    </Col>
                    <Col span={4}>
                        {this.item.resultDataType}
                    </Col>
                </Row>
            </Block>
            {
                this.item.parameterInfos.length > 0 &&
                <Block name="Parameters">
                    {this.item.parameterInfos.map(info =>
                        <Row key={info.name}>
                            <Col span={4}>
                                {info.name}
                            </Col>
                            <Col span={4}>
                                {info.dataType}
                            </Col>
                        </Row>
                    )}
                </Block>
            }
            <Block name="Rules" className="rules">
                <Row type="flex" align="middle" className="rule-header">
                    <Col span={conditionWidth}><b>Condition</b></Col>
                    <Col span={resultWidth}><b>Result</b></Col>
                </Row>
                {
                    this.item.rules.map(rule =>
                        <Row key={rule.key} type="flex" align="middle" className="rule">
                            <Col span={conditionWidth}><ExpressionView
                                topLevel
                                expression={rule.condition}/></Col>
                            <Col span={resultWidth}><ExpressionView
                                topLevel
                                expression={rule.result}/></Col>
                        </Row>)
                }
                <Row type="flex" align="middle" className="rule">
                    <Col span={conditionWidth}><b>Default</b></Col>
                    <Col span={resultWidth}><ExpressionView topLevel expression={this.item.defaultResult}/></Col>
                </Row>
            </Block>
        </PageWrapper>
    };

    loadItem = () => {
        this.loading = true;
        axios.get(`/api/projects/${this.item.projectKey}/items/${this.item.itemKey}`)
            .then((res) => {
                res.data.rules.map(r => r.key = r.key || guid());
                this.item = res.data;
            }).finally(() => this.loading = false);
    };

    editItem = () => {
        itemModal.edit(this.item, () => this.loadItem());
    };
}