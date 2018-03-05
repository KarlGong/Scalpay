import {Input, Icon, Modal, Form, Radio, Row, Col, Collapse, Button, message, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import {render, unmountComponentAtNode} from "react-dom";
import ProjectSelect from "~/components/ProjectSelect";
import {DataType, ItemType, ConfigItemMode, DefaultExp} from "~/utils/store";
import DataTypeSelect from "~/components/DataTypeSelect";
import ExpressionView from "~/components/expression/ExpressionView";
import DragListView from "react-drag-listview";
import guid from "~/utils/guid";
import "./configItemModal.less";
import ItemInfo from "~/components/ItemInfo";
import Validator from "~/utils/Validator";
import event from "~/utils/event";
import "./RawRulePanel.less";

@observer
export default class RawRulePanel extends Component {
    static defaultProps = {
        item: {} // observable
    };
    
    item = this.props.item; // observable

    render = () => {
        let rules = this.item.rules.filter((rule) => rule.condition);
        let defaultRule = this.item.rules.filter((rule) => !rule.condition)[0];

        return <div className="raw-rule-panel">
            <Row gutter={24} className="rule-header">
                <Col span={18} className="center">
                    <b>Condition</b>
                </Col>
                <Col span={6} className="center">
                    <b>Result</b>
                </Col>
            </Row>
            <DragListView onDragEnd={() => {
            }}>
                {
                    rules.map((rule) => {
                        return <Row key={rule.key} gutter={24} className="rule">
                            <Col span={18} className="center">
                                <ExpressionView
                                    allowEdit
                                    expression={untracked(() => rule.condition)}
                                    item={untracked(() => this.item)}
                                    onChange={(exp) => rule.condition = exp}/>
                            </Col>
                            <Col span={6} className="center">
                                <ExpressionView
                                    allowEdit
                                    expression={untracked(() => rule.result)}
                                    item={untracked(() => this.item)}
                                    onChange={(exp) => rule.result = exp}/>
                            </Col>
                        </Row>
                    })
                }
            </DragListView>
            <Row gutter={24} className="rule">
                <Col span={24}>
                    <Button icon="plus" type="dashed" className="rule-add"
                            onClick={() => this.item.rules.push(
                                {
                                    key: guid(),
                                    condition: DefaultExp.Bool,
                                    result: DefaultExp[this.item.resultDataType]
                                })}>Add Rule</Button>
                </Col>
            </Row>
            <Row key={defaultRule.key} gutter={24} className="rule-default">
                <Col span={18} className="center">
                    <b>Default</b>
                </Col>
                <Col span={6} className="center">
                    <ExpressionView
                        allowEdit
                        expression={untracked(() => defaultRule.result)}
                        item={this.item}
                        onChange={(exp) => defaultRule.result = exp}
                    />
                </Col>
            </Row>
        </div>
    }
}