import {Button, Col, Icon, Row} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {DefaultExp} from "~/const";
import ExpressionView from "~/components/expression/ExpressionView";
import DragListView from "react-drag-listview";
import guid from "~/utils/guid";
import "./itemModal.less";
import "./RuleSection.less";

@observer
export default class RuleSection extends Component {
    static defaultProps = {
        item: {} // observable
    };

    item = this.props.item; // observable, changes affect the input item, onXXChange can solve this, but it's too complex

    render = () => {
        let conditionWidth = 16;
        let resultWidth = 7;
        let deleteWidth = 1;

        return <div className="rule-section">
            <Row className="rule-header">
                <Col span={conditionWidth}>
                    Condition
                </Col>
                <Col span={resultWidth}>
                    Result
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
                    Default
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