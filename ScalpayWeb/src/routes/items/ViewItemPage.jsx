import {Breadcrumb, Button, Col, Layout, Row} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {DataType, DefaultExp, ItemMode, Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import {Link} from "react-router";
import guid from "~/utils/guid";
import global from "~/global";
import FieldsViewer from "~/layouts/FieldsViewer";
import CommandBar from "~/layouts/CommandBar";
import itemModal from "~/modals/itemModal/itemModal";
import ProjectInfo from "~/components/ProjectInfo";
import Block from "~/layouts/Block";
import ExpressionView from "~/components/expression/ExpressionView";
import AuditsView from "~/components/AuditsView";
import VersionSelect from "~/components/VersionSelect";
import "./ViewItemPage.less";

@observer
export default class ViewItemPage extends Component {

    params = Object.assign({}, this.props.params);
    @observable item = {
        projectKey: null,
        itemKey: this.params.itemKey,
        name: null,
        description: null,
        version: null,
        isLatest: false,
        mode: ItemMode.property,
        parameterInfos: [],
        resultDataType: DataType.string,
        rules: [],
        defaultResult: DefaultExp.string
    };
    @observable loading = false;

    componentDidMount = () => {
        this.loadItem();
    };

    componentWillReceiveProps = (props) => {
        if (JSON.stringify(this.params) !== JSON.stringify(props.params)) {
            this.params = props.params;
            this.loadItem();
        }
    };

    render = () => {
        let leftCommands = [];
        if (auth.hasPrivileges(Privilege.itemManage) && this.item.isLatest) {
            leftCommands.push(<Button onClick={() => this.editItem()}>Edit</Button>);
        }
        let rightCommands = [];
        if (this.item.isLatest) {
            rightCommands.push(<VersionSelect
                version={this.item.version}
                onChange={(version) => global.history.push("/items/" + this.item.itemKey + "/v" + version)}/>)
        }

        let conditionWidth = 16;
        let resultWidth = 8;

        return <PageWrapper
            className="view-item-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/items">Items</Link></Breadcrumb.Item>
                {
                    this.params.itemVersion ?
                        [
                            <Breadcrumb.Item key={1}>
                                <Link to={"/items/" + this.params.itemKey}>{this.params.itemKey}</Link>
                            </Breadcrumb.Item>,
                            <Breadcrumb.Item key={2}>v{this.params.itemVersion}</Breadcrumb.Item>
                        ]
                        : <Breadcrumb.Item>{this.params.itemKey}</Breadcrumb.Item>
                }
            </Breadcrumb>}>
            <CommandBar leftItems={leftCommands} rightItems={rightCommands}/>
            <Layout>
                <Block name="Basic" loading={this.loading}>
                    <FieldsViewer fields={[
                        ["Project", <ProjectInfo projectKey={this.item.projectKey}/>],
                        ["Item Key", this.item.itemKey],
                        ["Name", this.item.name],
                        ["Description", this.item.description]
                    ]}/>
                </Block>
                {
                    this.item.mode === ItemMode.property ?
                        <Block name="Property">
                            <FieldsViewer fields={[
                                ["Result Data Type", this.item.resultDataType],
                                ["Result", <ExpressionView topLevel expression={this.item.defaultResult}/>]
                            ]}/>
                        </Block>
                        : null
                }
                {
                    this.item.mode === ItemMode.raw ?
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
                    this.item.mode === ItemMode.raw ?
                        <Block name="Rules" className="rules">
                            <Row type="flex" align="middle" className="rule">
                                <Col span={conditionWidth}><b>Condition</b></Col>
                                <Col span={resultWidth}><b>Result</b></Col>
                            </Row>
                            {
                                this.item.rules.map(rule =>
                                    <Row key={rule.key} type="flex" align="middle"
                                         className="rule">
                                        <Col span={conditionWidth}><ExpressionView
                                            topLevel
                                            expression={rule.condition}/></Col>
                                        <Col span={resultWidth}><ExpressionView
                                            topLevel
                                            expression={rule.result}/></Col>
                                    </Row>)
                            }
                            <Row type="flex" align="middle"
                                 className="rule">
                                <Col span={conditionWidth}><b>Default</b></Col>
                                <Col span={resultWidth}><ExpressionView topLevel expression={this.item.defaultResult}/></Col>
                            </Row>
                        </Block>
                        : null
                }
                {
                    !this.params.itemVersion ?
                        <Block name="Activity">
                            <AuditsView itemKey={this.item.itemKey}/>
                        </Block>
                        : null
                }
            </Layout>
        </PageWrapper>
    };

    loadItem = () => {
        this.loading = true;
        let url = "";
        if (this.params.itemVersion) {
            url = "/api/items/" + this.params.itemKey + "/v" + this.params.itemVersion;
        } else {
            url = "/api/items/" + this.params.itemKey;
        }
        axios.get(url)
            .then((res) => {
                let item = res.data.data;
                item.rules.map(r => r.key = guid());
                this.item = item;
            })
            .finally(() => this.loading = false);
    };

    editItem = () => {
        itemModal.edit(this.item, (item) => this.loadItem());
    };
}