import {Breadcrumb, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import {Link} from "react-router";
import auth from "~/utils/auth";
import PageWrapper from "~/layouts/PageWrapper";
import "./ViewUserPage.less";
import userModal from "~/modals/userModal";
import AuditsView from "~/components/AuditsView";

@observer
export default class ViewUserPage extends Component {

    @observable user = {
        username: this.props.params.username,
        fullName: null,
        email: null,
        privileges: []
    };
    @observable loading = false;

    componentDidMount = () => {
        this.loadUser();
    };

    render = () => {


    };

    loadUser = () => {
        this.loading = true;
        axios.get("/api/users/" + this.props.params.username)
            .then((res) => this.user = res.data.data)
            .finally(() => this.loading = false);
    };

    editUser = () => {
        userModal.edit(this.user, () => this.loadUser());
    };
}