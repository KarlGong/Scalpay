import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import SHeader from "~/components/SHeader";
import SFooter from "~/components/SFooter";
import "./App.less";

export default class App extends Component {
    render = () => {
        return <Layout>
            <SHeader/>
            <Layout style={{minHeight: "calc(100% - 88px)", display: "flex", alignItems: "center"}}>
                {this.props.children}
            </Layout>
            <SFooter/>
        </Layout>
    }
}