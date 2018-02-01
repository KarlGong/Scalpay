import React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import {observable} from "mobx";
import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, notification} from "antd";
import axios from "axios";
import SHeader from "~/components/SHeader";
import SFooter from "~/components/SFooter";
import ItemsPage from "~/routes/ItemsPage";
import "./assets/fonts/extra-iconfont/iconfont.css";
import "./index.css";

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    notification.error({
        message: "Request Error",
        description: error.message,
        duration: 0,
    });
    return Promise.reject(error);
});

render(
    <AppContainer>
        <Layout>
            <SHeader />
            <Layout style={{minHeight: "calc(100% - 87px)"}}>
                <ItemsPage/>
            </Layout>
            <SFooter/>
        </Layout>
    </AppContainer>,
    document.getElementById("app")
);

if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept();
}
