import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, Avatar} from "antd";
import React, {Component} from "react";

export default class SFooter extends Component {
    render = () => {
        return <Layout.Footer style={{textAlign: "center", padding: "12px 0", borderTop: "#dadada 1px solid"}}>
            Scalpay ©2018 Created by Karl Gong | <a href="https://github.com/KarlGong">GitHub</a> | <a
            href="mailto:karl.gong%40outlook.com">Contact Me</a>
        </Layout.Footer>
    }
}