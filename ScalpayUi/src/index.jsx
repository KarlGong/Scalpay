import React from "react";
import { IndexRoute, browserHistory, Router, Route, Link } from "react-router";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import {observable} from "mobx";
import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, notification} from "antd";
import axios from "axios";
import App from "~/routes/App";
import ItemsPage from "~/routes/ItemsPage";
import ProjectsPage from "~/routes/ProjectsPage";
import ProfilePage from "~/routes/ProfilePage";
import "./assets/fonts/extra-iconfont/iconfont.css";

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
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={ItemsPage} />
                <Route path="items" component={ItemsPage} />
                <Route path="projects" component={ProjectsPage} />
                <Route path="profile" component={ProfilePage} />
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("app")
);

if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept();
}
