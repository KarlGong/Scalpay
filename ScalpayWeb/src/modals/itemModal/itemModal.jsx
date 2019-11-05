import {message, Modal, Radio, Drawer, Button, Form, Divider} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import axios from "axios";
import cs from "classnames";
import {render, unmountComponentAtNode} from "react-dom";
import {DataType, DefaultExp} from "~/const";
import guid from "~/utils/guid";
import ComponentValidator from "~/utils/ComponentValidator";
import ItemInfo from "~/components/ItemInfo";
import ParameterSection from "./ParameterSection";
import BasicSection from "./BasicSection";
import RuleSection from "./RuleSection";
import Block from "~/layouts/Block";
import "./itemModal.less";
import global from "~/global";
import Validator from "~/utils/Validator";

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

    axios.get(`/api/projects/${item.projectKey}/items/${item.itemKey}`)
        .then(res =>
            render(<ItemModal item={res.data} onSuccess={onSuccess} afterClose={() => {
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
            parameterInfos: [],
            resultDataType: DataType.String,
            rules: [],
            defaultResult: DefaultExp.String
        },
        addMode: false,
        projectKey: "",
        onSuccess: (item) => { },
        afterClose: () => { }
    };

    @observable loading = false;
    @observable visible = true;

    constructor(props) {
        super(props);
        this.basicSectionValidator = null;
        this.parameterSectionValidator = null;
        this.oldItemKey = this.props.item.itemKey;

        this.props.item.projectKey = this.props.item.projectKey || this.props.projectKey;
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
                <div className="form">
                    <BasicSection
                        item={this.item}
                        setValidator={(validator) => {this.basicSectionValidator = validator}}
                    />
                    <ParameterSection
                        item={this.item}
                        setValidator={(validator) => {this.parameterSectionValidator = validator}}
                    />
                    <RuleSection item={this.item}/>
                </div>
                <div className="actions">
                    <Button onClick={this.handleCancel} style={{marginRight: 8}}>
                        Cancel
                    </Button>
                    <Button onClick={this.handleOk} type="primary" loading={this.loading}>
                        Submit
                    </Button>
                </div>
            </div>
        </Drawer>
    };

    handleOk = () => {
        let componentValidator = new ComponentValidator([this.basicSectionValidator, this.parameterSectionValidator]);

        if (this.props.addMode) {
            componentValidator.validate().then(() => {
                this.loading = true;
                axios.put(`/api/projects/${this.item.projectKey}/items/`, this.item)
                    .then(res => {
                        let item = res.data;
                        this.loading = false;
                        this.visible = false;
                        message.success(<span>Item <ItemInfo item={item}/> is added successfully!</span>);
                        this.props.onSuccess(item);
                    }, () => this.loading = false)
            });
        } else {
            componentValidator.validate().then(() => {
                this.loading = true;
                axios.post(`/api/projects/${this.item.projectKey}/items/${this.oldItemKey}`, this.item)
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

export default {add, edit};