import {Breadcrumb, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import {Link} from "react-router";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import CommandBar from "~/layouts/CommandBar";
import "./ViewUserPage.less";
import userModal from "~/modals/userModal";
import FieldsViewer from "~/layouts/FieldsViewer";
import Block from "~/layouts/Block";
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
        let commands = [];
        if (auth.hasPrivileges(Privilege.userManage)) {
            commands.push(<Button onClick={() => this.editUser()}>Edit</Button>);
        }
        return <PageWrapper
            className="view-user-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/users">Users</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.params.username}</Breadcrumb.Item>
            </Breadcrumb>}>
            <CommandBar leftItems={commands}/>
            <Block name="Basic" loading={this.loading}>
                <FieldsViewer fields={[
                    ["Username", this.user.username],
                    ["Full Name", this.user.fullName],
                    ["Email", this.user.email],
                ]}/>
            </Block>
            <Block name="Activity">
                <AuditsView OperatorUserName={this.user.username}/>
            </Block>
        </PageWrapper>
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