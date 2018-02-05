import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, Avatar} from "antd";
import {observable} from "mobx";
import React, {Component} from "react";
import ItemsList from "~/components/ItemsList";
import SplitPane from "react-split-pane";
import {observer} from "mobx-react";
import "./ItemsPage.less";

@observer
export default class ItemsPage extends Component {
    @observable size = parseInt(localStorage.getItem("Scalpay-Items-LeftPane-Width")) || 256;

    render = () => {
        return <Layout className="items-page">
            <SplitPane split="vertical" minSize={256} maxSize={1000} defaultSize={this.size}
                       pane2Style={{width: "calc(100% - " + (this.size + 1) + "px)"}} // consider width of resizer
                       onChange={size => this.size = size}
                       onDragFinished={size => localStorage.setItem("Scalpay-Items-LeftPane-Width", size)}>
                <ItemsList/>
                <Layout>
                    fdsafhdakjshfkas
                </Layout>
            </SplitPane>
        </Layout>
    }
}