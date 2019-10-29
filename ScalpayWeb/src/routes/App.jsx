import {Layout} from "antd";
import React, {Component} from "react";
import SHeader from "~/components/SHeader";
import SFooter from "~/components/SFooter";

export default class App extends Component {
    render = () => {
        return <Layout>
            <SHeader/>
            {this.props.children}
            <SFooter/>
        </Layout>
    }
}