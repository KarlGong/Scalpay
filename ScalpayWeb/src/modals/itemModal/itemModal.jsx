import {Collapse, message, Modal, Radio, Drawer, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import axios from "axios";
import cs from "classnames";
import {render, unmountComponentAtNode} from "react-dom";
import {DataType, DefaultExp, ItemMode} from "~/utils/store";
import guid from "~/utils/guid";
import ComponentValidator from "~/utils/ComponentValidator";
import ItemInfo from "~/components/ItemInfo";
import BasicPanel from "./BasicPanel";
import ParameterPanel from "./ParameterPanel";
import RawRulePanel from "./RawRulePanel";
import PropertyPanel from "./PropertyPanel";
import "./itemModal.less";
import global from "~/global";

function add(projectKey, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<ItemModal addMode projectKey={projectKey} onSuccess={onSuccess} afterClose={() => {
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
            render(<ItemModal projectKey={res.data.projectKey} item={res.data} onSuccess={onSuccess} afterClose={() => {
                unmountComponentAtNode(target);
                target.remove()
            }}/>, target))
        .finally(() => hide());
}

@observer
class ItemModal extends Component {
    static defaultProps = {
        item: {
            projectKey: null,
            itemKey: null,
            name: null,
            description: null,
            version: null,
            isLatest: false,
            mode: ItemMode.property,
            parameterInfos: [],
            resultDataType: DataType.string,
            rules: [],
            defaultResult: DefaultExp.string
        },
        addMode: false,
        projectKey: "",
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
        return <Drawer
            title={this.props.addMode ? "Add Item" : "Edit Item"}
            visible={this.visible}
            width={1000}
            maskClosable={false}
            onClose={this.handleCancel}
            afterVisibleChange={visible => !visible && this.props.afterClose()}
        >
            <div className="item-modal">
                <div style={{float: "right"}}>
                    <Radio.Group
                        key={this.modeResetKey}
                        onChange={(e) => {
                            let targetMode = e.target.value;
                            if (targetMode === ItemMode.property) {
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
                        <Radio.Button value={ItemMode.property}>Property</Radio.Button>
                        <Radio.Button value={ItemMode.raw}>Raw</Radio.Button>
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
                        this.item.mode === ItemMode.property ?
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
                        this.item.mode === ItemMode.raw ?
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
                        this.item.mode === ItemMode.raw ?
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
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    borderTop: "1px solid #e9e9e9",
                    padding: "10px 16px",
                    background: "#fff",
                    textAlign: "right",
                }}
            >
                <Button onClick={this.handleCancel} style={{marginRight: 8}}>
                    Cancel
                </Button>
                <Button onClick={this.handleOk} type="primary" loading={this.loading}>
                    Submit
                </Button>
            </div>
        </Drawer>
    };

    handleOk = () => {
        let validators = [this.basicPanelValidator];
        if (this.item.mode === ItemMode.raw) {
            validators.push(this.parameterPanelValidator);
        }
        let componentValidator = new ComponentValidator(validators);

        if (this.props.addMode) {
            componentValidator.validate().then(() => {
                this.loading = true;
                axios.put("/api/projects/" + this.props.projectKey + "/items", this.item)
                    .then(res => {
                        let item = res.data.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>Item <ItemInfo item={item}/> is added successfully!</span>);
                        this.props.onSuccess(item);
                    }, () => this.loading = false)
            });
        } else {
            componentValidator.validate().then(() => {
                this.loading = true;
                axios.post("/api/projects/" + this.props.projectKey + "/items/" + this.item.itemKey, this.item)
                    .then(res => {
                        let item = res.data.data;
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

export default {add, edit};