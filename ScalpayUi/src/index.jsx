import React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import {observable} from "mobx";
import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown} from "antd";
import axios from "axios";
import "./assets/fonts/extra-iconfont/iconfont.css";
import "./index.css";

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    // alert.error(error.message);
    return Promise.reject(error);
});

render(
    <AppContainer>
        <Layout>
            <Layout.Header className="header" style={{height: "42px", backgroundColor: "#ffffff"}}>
                <div className="logo"/>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["items"]}
                    style={{lineHeight: "40px", float: "left"}}
                >
                    <Menu.Item key="items">Items</Menu.Item>
                    <Menu.Item key="items1">Items1</Menu.Item>
                </Menu>
                <div style={{float: "right"}}>
                    <AutoComplete
                        size="small"
                        style={{height: "30px", margin: "5px 10px 0 0"}}
                        placeholder="input item key"
                    >
                        <Input size="small" suffix={<Icon type="search"/>}/>
                    </AutoComplete>
                    <Badge dot>
                        <Icon type="bell" style={{fontSize: "18px"}}/>
                    </Badge>
                    <div style={{display: "inline-block", position: "absolute", top: "10px", marginLeft: "10px"}}>
                        <Dropdown overlay={<Menu>
                            <Menu.Item key="0">
                                <a href="http://www.alipay.com/">1st menu item</a>
                            </Menu.Item>
                        </Menu>} trigger={["click"]}>
                            <Icon type="setting" style={{fontSize: "18px"}}/>
                        </Dropdown>
                    </div>
                </div>
            </Layout.Header>
            <Layout style={{minHeight: "calc(100% - 87px)"}}>

            </Layout>
            <Layout.Footer style={{textAlign: "center", padding: "12px 0"}}>
                Scalpay ©2018 Created by Karl Gong | <a href="https://github.com/KarlGong">GitHub</a> | <a
                href="mailto:karl.gong%40outlook.com">Contact Me</a>
            </Layout.Footer>
        </Layout>
    </AppContainer>,
    document.getElementById("app")
);

if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept();
}
