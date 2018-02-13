import {Layout, Menu, Input, Icon, Form, Spin, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import moment from "moment";
import Validator from "~/utils/Validator";

@observer
export default class ProjectPage extends Component {

    @observable project = {};
    validator = new Validator(this.project, {
        projectKey: {required: true},
        name: {required: true}
    });
    @observable loading = false;

    componentDidMount = () => {
        if (this.props.route.mode !== "add") {
            this.loading = true;
            axios.get("/api/projects/" + this.props.router.params.projectKey)
                .then((res) => this.project = res.data)
                .finally(() => this.loading = false);
        }
    };

    render = () => {
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };

        const actions = [];
        if (this.props.route.mode === "add") {
            actions.push(<Button key={0} style={{marginRight: "10px"}}>Cancel</Button>, <Button type="primary" key={1}>Add</Button>);
        } else if (this.props.route.mode === "view" && auth.hasPrivileges(Privilege.ProjectEdit)) {
            actions.push(<Button key={0}>Edit</Button>);
        } else if (this.props.route.mode === "edit") {
            actions.push(<Button key={0} style={{marginRight: "10px"}}>Cancel</Button>, <Button type="primary" key={1}>Update</Button>);
        }

        return <PageWrapper>
            <Spin spinning={this.loading}>
                <Form>
                    <Form.Item label="Project Key" {...formItemLayout}>
                        <span>{this.project.projectKey}</span>
                    </Form.Item>
                    <Form.Item label="Name" {...formItemLayout}>
                        <span>{this.project.name}</span>
                    </Form.Item>
                    <Form.Item label="Description" {...formItemLayout}>
                        <span>{this.project.description}</span>
                    </Form.Item>
                    <Form.Item label="Create Time" {...formItemLayout}>
                        <span>{moment(this.project.insertTime).fromNow()}</span>
                    </Form.Item>
                    <Form.Item label="Update Time" {...formItemLayout}>
                        <span>{moment(this.project.updateTime).fromNow()}</span>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 14, offset: 10 }}>
                        <span>
                            {actions}
                        </span>
                    </Form.Item>
                </Form>
            </Spin>
        </PageWrapper>
    }
}