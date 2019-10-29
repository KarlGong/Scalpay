import React from "react";
import {IndexRedirect, IndexRoute, Route, Router} from "react-router";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import auth from "~/utils/auth";
import App from "~/routes/App";
import ItemsPage from "~/routes/items/ItemsPage";
import ViewItemPage from "~/routes/items/ViewItemPage";
import ViewProjectPage from "~/routes/projects/ViewProjectPage";
import ProjectsPage from "~/routes/projects/ProjectsPage";
import ViewUserPage from "~/routes/users/ViewUserPage";
import UsersPage from "~/routes/users/UsersPage";
import LoginPage from "~/routes/LoginPage";
import global from "./global";

import "./index.less";
import "~/assets/fonts/antd-iconfont/iconfont.css";
import "~/assets/fonts/extra-iconfont/iconfont.css";

const checkAuth = (nextState, replace) => {
    if (nextState.location.pathname === "/login" && auth.user) {
        replace({
            pathname: nextState.location.query.returnUrl || "/"
        })
    } else if (nextState.location.pathname !== "/login" && !auth.user) {
        replace({
            pathname: "/login",
            query: {
                returnUrl: nextState.location.pathname
            }
        })
    }
};

render(
    <AppContainer>
        <Router history={global.history}>
            <Route path="/" component={App} onEnter={checkAuth}>
                <IndexRedirect to="projects"/>
                <Route path="login" component={LoginPage}/>
                <Route path="projects">
                    <IndexRoute component={ProjectsPage}/>
                    <Route path=":projectKey" component={ViewProjectPage}/>
                </Route>
                <Route path="users">
                    <IndexRoute component={UsersPage}/>
                    <Route path=":username" component={ViewUserPage}/>
                </Route>
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("root")
);

if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept();
}
