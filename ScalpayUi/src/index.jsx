import React from "react";
import {IndexRoute, browserHistory, Router, Route, Link, IndexRedirect} from "react-router";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import {observable} from "mobx";
import {Layout, Menu, AutoComplete, Input, Icon, Badge, Dropdown, notification} from "antd";
import axios from "axios";
import auth from "~/utils/auth";
import App from "~/routes/App";
import ItemsPage from "~/routes/ItemsPage";
import ViewProjectPage from "~/routes/projects/ViewProjectPage";
import AddEditProjectPage from "~/routes/projects/AddEditProjectPage";
import ProjectsPage from "~/routes/projects/ProjectsPage";
import ProfilePage from "~/routes/ProfilePage";
import LoginPage from "~/routes/LoginPage";
import "./assets/fonts/extra-iconfont/iconfont.css";

axios.interceptors.response.use(
    response => response,
    error => {
        notification.error({
            message: error.message,
            description: error.response.data,
            duration: 0,
        });
        return Promise.reject(error);
    }
);

const requireAuth = (nextState, replace) => {
    if (!auth.user) {
        replace({
            pathname: "/login",
            query: {
                returnUrl: nextState.location.pathname
            }
        })
    }
};

const checkAuth = (nextState, replace) => {
    if (auth.user) {
        replace({
            pathname: nextState.location.query.returnUrl || "/"
        })
    }
};

render(
    <AppContainer>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRedirect to="items"/>
                <Route path="login" component={LoginPage} onEnter={checkAuth}/>
                <Route path="items" component={ItemsPage} onEnter={requireAuth}/>
                <Route path="projects" onEnter={requireAuth}>
                    <IndexRoute component={ProjectsPage}/>
                    <Route path="add" component={AddEditProjectPage} mode="add"/>
                    <Route path=":projectKey/edit" component={AddEditProjectPage} mode="edit"/>
                    <Route path=":projectKey" component={ViewProjectPage} />
                </Route>
                <Route path="profile" component={ProfilePage} onEnter={requireAuth}/>
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("app")
);

if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept();
}
