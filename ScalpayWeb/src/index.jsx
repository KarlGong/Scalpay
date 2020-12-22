import React from "react";
import {IndexRedirect, IndexRoute, Route, Router} from "react-router";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import auth from "~/utils/auth";
import App from "~/routes/App";
import ItemPage from "~/routes/items/ItemPage";
import ProjectPage from "~/routes/projects/ProjectPage";
import ProjectsPage from "~/routes/projects/ProjectsPage";
import ViewUserPage from "~/routes/users/ViewUserPage";
import UsersPage from "~/routes/users/UsersPage";
import LoginPage from "~/routes/LoginPage";
import Page403 from "~/routes/Page403";
import Page404 from "~/routes/Page404";
import global from "./global";
import "./index.less";

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
                    <Route path=":projectKey">
                        <IndexRoute component={ProjectPage}/>
                        <Route path=":itemKey" component={ItemPage}/>
                    </Route>
                </Route>
                <Route path="users">
                    <IndexRoute component={UsersPage}/>
                    <Route path=":username" component={ViewUserPage}/>
                </Route>
                <Route path="403" component={Page403}/>
                <Route path="404" component={Page404}/>
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("root")
);

if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept();
}
