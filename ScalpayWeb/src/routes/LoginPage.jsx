import {Button, Checkbox, Form, Icon, Input} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, untracked} from "mobx";
import auth from "~/utils/auth";
import PageWrapper from "~/layouts/PageWrapper";
import "./LoginPage.less";
import Validator from "~/utils/Validator";
import global from "~/global";

@observer
export default class LoginPage extends Component {

    loginParams = {username: null, password: null, isKeepLogin: true};
    validator = new Validator(this.loginParams, {
        username: {required: true},
        password: {required: true}
    });
    @observable loading = false;

    render = () => {
        return <PageWrapper className="login-page">
            <Form className="login-form">
                <div className="title">
                    Log in
                </div>
                <Form.Item validateStatus={this.validator.getResult("username").status}
                           help={this.validator.getResult("username").message}>
                    <Input prefix={<Icon type="user" className="input-icon"/>} placeholder="username"
                           onChange={(e) => {
                               this.loginParams.username = e.target.value;
                               this.validator.resetResults();
                           }} onBlur={() => this.validator.validate("username")}/>
                </Form.Item>
                <Form.Item validateStatus={this.validator.getResult("password").status}
                           help={this.validator.getResult("password").message}>
                    <Input prefix={<Icon type="lock" className="input-icon"/>} type="password"
                           placeholder="Password"
                           onChange={(e) => {
                               this.loginParams.password = e.target.value;
                               this.validator.resetResults();
                           }} onBlur={() => this.validator.validate("password")}
                           onKeyUp={e => e.keyCode === 13 && this.onSubmit()}/>
                </Form.Item>
                <Form.Item>
                    <Checkbox defaultChecked={untracked(() => this.loginParams.isKeepLogin)}
                              onChange={e => this.loginParams.isKeepLogin = e.target.value}>Keep me logged in</Checkbox>
                    <Button type="primary" loading={this.loading} className="login-button"
                            onClick={this.onSubmit}>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </PageWrapper>
    };

    onSubmit = () => {
        this.validator.validateAll().then(() => {
            this.loading = true;
            auth.login(this.loginParams.username, this.loginParams.password, this.loginParams.isKeepLogin)
                .then(() => global.history.push(this.props.router.location.query.returnUrl || "/"),
                    (res) => {
                        this.validator.setResult("username", {status: "error", message: res.response.data});
                        this.validator.setResult("password", {status: "error"});
                    }).finally(() => this.loading = false);
        });
    }
}