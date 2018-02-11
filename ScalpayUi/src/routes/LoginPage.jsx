import {Layout, Menu, Input, Icon, Form, Button, Checkbox} from "antd";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import auth from "~/utils/auth";
import "./LoginPage.less";
import Validator from "~/utils/Validator";

@observer
export default class LoginPage extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    user = {userName: null, password: null};
    validator = new Validator(this.user, {
        userName: {required: true},
        password: {required: true}
    });
    @observable loading = false;

    render = () => {
        return (
            <Layout className="login-page">
                <Form className="login-form">
                    <Form.Item validateStatus={this.validator.getResult("userName").status}
                               help={this.validator.getResult("userName").message}>
                        <Input prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>} placeholder="Username"
                               onChange={(e) => {
                                   this.user.userName = e.target.value;
                                   this.validator.resetResult("userName");
                               }} onBlur={() => this.validator.validate("userName")}/>
                    </Form.Item>
                    <Form.Item validateStatus={this.validator.getResult("password").status}
                               help={this.validator.getResult("password").message}>
                        <Input prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>} type="password"
                               placeholder="Password"
                               onChange={(e) => {
                                   this.user.password = e.target.value;
                                   this.validator.resetResult("password");
                               }} onBlur={() => this.validator.validate("password")}
                               onKeyUp={e => e.keyCode === 13 && this.onSubmit()}/>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox checked={true}>Remember me</Checkbox>
                        <a className="login-form-forgot" href="">Forgot password</a>
                        <Button type="primary" loading={this.loading} className="login-form-button" onClick={this.onSubmit}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Layout>
        )
    };

    onSubmit = () => {
        this.validator.validateAll(() => {
            this.loading = true;
            auth.login(this.user.userName, this.user.password)
                .then(() => this.context.router.push(this.context.router.location.query.returnUrl || "/"))
                .finally(() => this.loading = false);
        });
    }
}