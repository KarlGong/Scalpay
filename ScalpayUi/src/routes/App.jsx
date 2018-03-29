import {Layout} from "antd";
import React, {Component} from "react";
import SHeader from "~/components/SHeader";
import SFooter from "~/components/SFooter";

export default class App extends Component {
    render = () => {
        return <Layout>
            <SHeader/>
            <Layout style={{minHeight: "calc(100% - 96px)"}}>
                {this.props.children}
            </Layout>
            <SFooter/>
        </Layout>
    }
}