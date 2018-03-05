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
import BasicPanel from "./BasicPanel";
import ParameterPanel from "./ParameterPanel";
import RawRulePanel from "./RawRulePanel";
import event from "~/utils/event";

function add(onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<EditConfigItemModal addMode onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

function edit(item, onSuccess) {
    const hide = message.loading("Loading item...", 0);

    const target = document.createElement("div");
    document.body.appendChild(target);

    axios.get("/api/items/config/" + item.itemKey)
        .then(res =>
            render(<EditConfigItemModal item={res.data} onSuccess={onSuccess} afterClose={() => {
                unmountComponentAtNode(target);
                target.remove()
            }}/>, target))
        .finally(() => hide());
}

function del(item, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<DeleteConfigItemModal item={item} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}


@observer
class EditConfigItemModal extends Component {
    static defaultProps = {
        item: {
            projectKey: null,
            itemKey: "config.null.", // the item key init format
            name: null,
            description: null,
            mode: ConfigItemMode.Property,
            parameterInfos: [],
            resultDataType: DataType.String,
            rules: [{
                key: guid(),
                result: DefaultExp.String
            }]
        },
        addMode: false,
        onSuccess: (item) => {},
        afterClose: () => {}
    };

    @observable loading = false;
    @observable visible = true;
    @observable basicPanelValidators = [];
    @observable parameterPanelValidators = [];

    constructor(props) {
        super(props);
        this.props.item.parameterInfos.map(p => p.key = p.key || guid());
        this.props.item.rules.map(r => r.key = r.key || guid());
        this.item = observable(Object.assign({}, this.props.item));
    }

    render = () => {
        return <Modal
            title={this.props.addMode ? "Add Config Item" : "Edit Config Item"}
            okText={this.props.addMode ? "Add Config Item" : "Update Config Item"}
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            width={800}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <div className="config-item-modal">
                <div style={{float: "right"}}>
                    <Radio.Group
                        onChange={(value) => this.item.mode = value}
                        defaultValue={this.item.mode}>
                        <Radio.Button value={ConfigItemMode.Property}>Property</Radio.Button>
                        <Radio.Button value={ConfigItemMode.Raw}>Raw</Radio.Button>
                    </Radio.Group>
                </div>
                <div style={{clear: "both"}}/>
                <Collapse
                    bordered={false}
                    accordion
                    defaultActiveKey={["basic"]}>
                    <Collapse.Panel
                        header="Basic"
                        key="basic"
                        className={cs({"error": this.basicPanelValidators.filter(v => v.hasError()).length})}>
                        <BasicPanel
                            item={this.item}
                            addMode
                            setValidators={(validators) => this.basicPanelValidators = validators}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel
                        header="Parameters & Result"
                        key="parameter"
                        className={cs({"error": this.parameterPanelValidators.filter(v => v.hasError()).length})}>
                        <ParameterPanel
                            item={this.item}
                            setValidators={(validators) => this.parameterPanelValidators = validators}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel
                        header="Rules"
                        key="raw-rule">
                        <RawRulePanel item={this.item}/>
                    </Collapse.Panel>
                </Collapse>
            </div>
        </Modal>
    };

    handleOk = () => {
        if (this.props.addMode) {
            let validatePromise = this.basicPanelValidators.concat(this.parameterPanelValidators)
                .map(v => v.validateAll());

            Promise.all(validatePromise).then(() => {
                this.loading = true;
                axios.put("/api/items/config", this.item)
                    .then(res => {
                        let item = res.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>Item <ItemInfo item={item}/> is added successfully!</span>);
                        this.props.onSuccess(item);
                    }, () => this.loading = false)
            });
        } else {
            let validatePromise = this.basicPanelValidators.concat(this.parameterPanelValidators)
                .map(v => v.validateAll());

            Promise.all(validatePromise).then(() => {
                this.loading = true;
                axios.post("/api/items/config/" + this.item.itemKey, this.item)
                    .then(res => {
                        let item = res.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>Item <ItemInfo item={item}/> is updated successfully!</span>);
                        this.props.onSuccess(item);
                    }, () => this.loading = false)
            });
        }
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

@observer
class DeleteConfigItemModal extends Component {
    static defaultProps = {
        item: {},
        onSuccess: (item) => {},
        afterClose: () => {}
    };

    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title={<span>
                <Icon type="question-circle" style={{color: "#ff4d4f"}}/> Are you sure to delete this config item?
            </span>}
            okText="Delete Config Item"
            okType="danger"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            All the data related to this config item will be deleted.
        </Modal>
    };

    handleOk = () => {
        this.loading = true;
        axios.delete("/api/items/config/" + this.props.item.itemKey)
            .then(() => {
                this.loading = false;
                this.visible = false;
                message.success(
                    <span>Config Item <ItemInfo item={this.props.item.itemKey}/> is deleted successfully!</span>);
                this.props.onSuccess(this.props.item);
            }, () => this.loading = false);
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {add, edit, del};