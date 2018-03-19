import {Input, Icon, Modal, Form, Radio, Row, Col, Collapse, Button, message, Tooltip} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import cs from "classnames";
import {render, unmountComponentAtNode} from "react-dom";
import ProjectSelect from "~/components/ProjectSelect";
import {DataType, ItemMode, DefaultExp} from "~/utils/store";
import DataTypeSelect from "~/components/DataTypeSelect";
import ExpressionView from "~/components/expression/ExpressionView";
import DragListView from "react-drag-listview";
import guid from "~/utils/guid";
import ComponentValidator from "~/utils/ComponentValidator";
import ItemInfo from "~/components/ItemInfo";
import BasicPanel from "./BasicPanel";
import ParameterPanel from "./ParameterPanel";
import RawRulePanel from "./RawRulePanel";
import PropertyPanel from "./PropertyPanel";
import event from "~/utils/event";
import "./itemModal.less";

function add(onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<EditItemModal addMode onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove()
    }}/>, target);
}

function edit(item, onSuccess) {
    const hide = message.loading("Loading item...", 0);

    const target = document.createElement("div");
    document.body.appendChild(target);

    axios.get("/api/items/" + item.itemKey)
        .then(res =>
            render(<EditItemModal item={res.data.data} onSuccess={onSuccess} afterClose={() => {
                unmountComponentAtNode(target);
                target.remove()
            }}/>, target))
        .finally(() => hide());
}

@observer
class EditItemModal extends Component {
    static defaultProps = {
        item: {
            projectKey: null,
            itemKey: null,
            name: null,
            description: null,
            version: null,
            isLatest: false,
            mode: ItemMode.Property,
            parameterInfos: [],
            resultDataType: DataType.String,
            rules: [],
            defaultResult: DefaultExp.String
        },
        addMode: false,
        onSuccess: (item) => {
        },
        afterClose: () => {
        }
    };

    @observable loading = false;
    @observable visible = true;

    // they should not be observable, but they are lazy loaded,
    // then this.basicPanelValidator && this.basicPanelValidator.hasError() will not add this component as derived component
    // call this.forceUpdate() in setValidator can also solve the issue.
    @observable basicPanelValidator = null;
    @observable parameterPanelValidator = null;

    @observable modeResetKey = guid();

    constructor(props) {
        super(props);
        this.props.item.parameterInfos.map(p => p.key = p.key || guid());
        this.props.item.rules.map(r => r.key = r.key || guid());
        this.item = observable(this.props.item);
    }

    render = () => {
        return <Modal
            title={this.props.addMode ? "Add Item" : "Edit Item"}
            okText={this.props.addMode ? "Add Item" : "Update Item"}
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            width={1000}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.props.afterClose()}
        >
            <div className="item-modal">
                <div style={{float: "right"}}>
                    <Radio.Group
                        key={this.modeResetKey}
                        onChange={(e) => {
                            let targetMode = e.target.value;
                            if (targetMode === ItemMode.Property) {
                                Modal.confirm({
                                    title: "Are you sure to change to Property mode?",
                                    content: "All the parameters and rules of this item will be cleared.",
                                    okText: "Change",
                                    okType: "danger",
                                    cancelText: "No",
                                    onOk: () => {
                                        this.item.mode = targetMode;
                                        this.item.parameterInfos = [];
                                        this.item.rules = [];
                                    },
                                    onCancel: () => {
                                        this.modeResetKey = guid();
                                    },
                                });
                            } else {
                                this.item.mode = targetMode;
                            }
                        }}
                        defaultValue={untracked(() => this.item.mode)}>
                        <Radio.Button value={ItemMode.Property}>Property</Radio.Button>
                        <Radio.Button value={ItemMode.Raw}>Raw</Radio.Button>
                    </Radio.Group>
                </div>
                <div style={{clear: "both"}}/>
                <Collapse
                    bordered={false}
                    accordion
                    defaultActiveKey={["basic"]}>
                    <Collapse.Panel
                        forceRender
                        header="Basic"
                        key="basic"
                        className={cs({"error": this.basicPanelValidator && this.basicPanelValidator.hasError()})}>
                        <BasicPanel
                            item={this.item}
                            addMode={this.props.addMode}
                            setValidator={(validator) => {this.basicPanelValidator = validator}}
                        />
                    </Collapse.Panel>
                    {
                        this.item.mode === ItemMode.Property ?
                            <Collapse.Panel
                                forceRender
                                header="Property"
                                key="property">
                                <PropertyPanel
                                    item={this.item}
                                />
                            </Collapse.Panel>
                            : null
                    }
                    {
                        this.item.mode === ItemMode.Raw ?
                            <Collapse.Panel
                                forceRender
                                header="Parameters & Result"
                                key="parameter"
                                className={cs({"error": this.parameterPanelValidator && this.parameterPanelValidator.hasError()})}>
                                <ParameterPanel
                                    item={this.item}
                                    setValidator={(validator) => {this.parameterPanelValidator = validator}}
                                />
                            </Collapse.Panel>
                            : null
                    }
                    {
                        this.item.mode === ItemMode.Raw ?
                            <Collapse.Panel
                                forceRender
                                header="Rules"
                                key="raw-rule"
                                disabled={this.parameterPanelValidator && this.parameterPanelValidator.hasError()}>
                                <RawRulePanel item={this.item}/>
                            </Collapse.Panel>
                            : null
                    }
                </Collapse>
            </div>
        </Modal>
    };

    handleOk = () => {
        let validators = [this.basicPanelValidator];
        if (this.item.mode === ItemMode.Raw) {
            validators.push(this.parameterPanelValidator);
        }
        let componentValidator = new ComponentValidator(validators);

        if (this.props.addMode) {
            componentValidator.validate().then(() => {
                this.loading = true;
                axios.put("/api/items", this.item)
                    .then(res => {
                        let item = res.data.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>Item <ItemInfo itemKey={item.itemKey}/> is added successfully!</span>);
                        this.props.onSuccess(item);
                    }, () => this.loading = false)
            });
        } else {
            componentValidator.validate().then(() => {
                this.loading = true;
                axios.post("/api/items/" + this.item.itemKey, this.item)
                    .then(res => {
                        let item = res.data.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>Item <ItemInfo itemKey={item.itemKey}/> is updated successfully!</span>);
                        this.props.onSuccess(item);
                    }, () => this.loading = false)
            });
        }
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {add, edit};