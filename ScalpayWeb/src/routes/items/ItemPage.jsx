import {Avatar, Breadcrumb, Button, Col, Layout, List, Row, Descriptions} from "antd";
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

    @observable permission = "";
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
        auth.getProjectPermission(this.item.projectKey).then((permission) => {
            this.permission = permission;
            if (this.permission !== Permission.None) {
                this.loadItem();
            } else {
                global.history.replace("/403");
            }
        });
    };

    render() {
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
                        this.permission === Permission.Admin &&
                        <span>
                            <Button icon="setting" onClick={() => this.editItem()}>
                                Edit Item
                            </Button>
                        </span>
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
            <Block name="Rules" className="rules">
                <Row type="flex" align="middle" className="rule-header">
                    <Col span={conditionWidth}><b>Condition</b></Col>
                    <Col span={resultWidth}><b>Result</b></Col>
                </Row>
                {
                    this.item.rules.map(rule =>
                        <Row key={rule.id} type="flex" align="middle" className="rule">
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
            .then((res) => this.item = res.data)
            .finally(() => this.loading = false);
    };

    editItem = () => {
        itemModal.edit(this.item, (item) => {
            if (this.item.itemKey !== item.itemKey) {
                global.history.replace(`/projects/${item.projectKey}/${item.itemKey}`);
            }
            this.item = item;
        });
    };
}