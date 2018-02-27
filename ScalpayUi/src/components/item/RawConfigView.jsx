import {Layout, Menu, Input, Icon, Collapse, Button, Row, Col} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import StringInput from "./expression/StringInput";
import DataTypeSelect from "../DataTypeSelect";
import ExpressionView from "~/components/item/expression/ExpressionView";
import DragListView from "react-drag-listview";

@observer
export default class RawConfigView extends Component {

    static defaultProps = {
        item: {
            projectKey: null,
            itemKey: null,
            name: null,
            description: null,
            itemType: null,
            configMode: null,
            paramsDataTypes: {},
            resultDataType: null,
            rules: []
        }
    };

    render = () => {
        return <div>
            <Row>
                <Col span={20}>Condition</Col>
                <Col span={4}>Result</Col>
            </Row>
            <DragListView onDragEnd={() => {}}>
                {
                    this.props.item.rules.map((rule) =>
                        <div>
                            <ExpressionView/>
                            <ExpressionView/>
                        </div>
                    )
                }
            </DragListView>
            <div>
                <span>Default</span>
                <ExpressionView/>
            </div>

        </div>
    }
}