import {Button, Checkbox, Form, Icon, Input} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import auth from "~/utils/auth";
import PageWrapper from "~/layouts/PageWrapper";
import "./LoginPage.less";
import Validator from "~/utils/Validator";
import global from "~/global";

@observer
export default class LoginPage extends Component {

    user = {username: null, password: null};
    validator = new Validator(this.user, {
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
                               this.user.username = e.target.value;
                               this.validator.resetResult("username");
                           }} onBlur={() => this.validator.validate("username")}/>
                </Form.Item>
                <Form.Item validateStatus={this.validator.getResult("password").status}
                           help={this.validator.getResult("password").message}>
                    <Input prefix={<Icon type="lock" className="input-icon"/>} type="password"
                           placeholder="Password"
                           onChange={(e) => {
                               this.user.password = e.target.value;
                               this.validator.resetResult("password");
                           }} onBlur={() => this.validator.validate("password")}
                           onKeyUp={e => e.keyCode === 13 && this.onSubmit()}/>
                </Form.Item>
                <Form.Item>
                    <Checkbox>Remember me</Checkbox>
                    <a className="forgot" href="">Forgot password</a>
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
            auth.login(this.user.username, this.user.password)
                .then(() => global.history.push(this.props.router.location.query.returnUrl || "/"))
                .finally(() => this.loading = false);
        });
    }
}