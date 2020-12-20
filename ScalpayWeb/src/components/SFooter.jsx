import {Layout} from "antd";
import React, {Component} from "react";

export default class SFooter extends Component {
    render() {
        return <Layout.Footer style={{textAlign: "center", padding: "18px 0", fontSize:"12px", color: "#7a869a"}}>
            Scalpay ©2018 Created by Karl Gong | <a href="https://github.com/KarlGong">GitHub</a> | <a
            href="mailto:karl.gong%40outlook.com">Contact Me</a>
        </Layout.Footer>
    }
}