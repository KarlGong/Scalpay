import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, Avatar} from "antd";
import React, {Component} from "react";
import ItemsList from "~/components/ItemsList";

export default class ItemsPage extends Component {
    render = () => {
        return <Layout>
            <ItemsList/>
        </Layout>
    }
}