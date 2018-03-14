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
        let conditionWidth = 16;
        let resultWidth = 7;
        let deleteWidth = 1;

        return <div className="raw-rule-panel">
            <Row className="rule-header">
                <Col span={conditionWidth}>
                    <b>Condition</b>
                </Col>
                <Col span={resultWidth}>
                    <b>Result</b>
                </Col>
            </Row>
            <div className="rules">
                <DragListView
                    onDragEnd={(fromIndex, toIndex) => {
                        let rule = this.item.rules.splice(fromIndex, 1)[0];
                        this.item.rules.splice(toIndex, 0, rule);
                    }}
                    scrollSpeed={3}
                    nodeSelector=".rule"
                    handleSelector=".rule"
                >
                    {
                        this.item.rules.map((rule) => {
                            return <Row key={rule.key} className="rule" type="flex" align="middle">
                                <Col span={conditionWidth}>
                                    <ExpressionView
                                        allowEdit
                                        topLevel
                                        expression={rule.condition}
                                        item={this.item}
                                        onChange={(exp) => rule.condition = exp}/>
                                </Col>
                                <Col span={resultWidth}>
                                    <ExpressionView
                                        allowEdit
                                        topLevel
                                        expression={rule.result}
                                        item={this.item}
                                        onChange={(exp) => rule.result = exp}/>
                                </Col>
                                <Col span={deleteWidth}>
                                    <Icon
                                        className="delete"
                                        type="minus-circle-o"
                                        onClick={() => this.item.rules.remove(rule)}
                                    />
                                </Col>
                            </Row>
                        })
                    }
                </DragListView>
                <Row>
                    <Col span={conditionWidth + resultWidth}>
                        <Button icon="plus" type="dashed" className="rule-add"
                                onClick={() => this.item.rules.push({
                                    key: guid(),
                                    condition: DefaultExp.Bool,
                                    result: DefaultExp[this.item.resultDataType]
                                })}>Add Rule</Button>
                    </Col>
                </Row>
            </div>
            <Row className="rule-default">
                <Col span={conditionWidth}>
                    <b>Default</b>
                </Col>
                <Col span={resultWidth}>
                    <ExpressionView
                        allowEdit
                        topLevel
                        expression={this.item.defaultResult}
                        item={this.item}
                        onChange={(exp) => this.item.defaultResult = exp}
                    />
                </Col>
            </Row>
        </div>
    }
}