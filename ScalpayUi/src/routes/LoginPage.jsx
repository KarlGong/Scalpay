import {Layout, Menu, Input, Icon, Form, Button, Checkbox} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import auth from "~/utils/auth";
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
        return (
            <Layout className="login-page">
                <Form className="login-form">
                    <Form.Item validateStatus={this.basicValidator.getResult("username").status}
                               help={this.basicValidator.getResult("username").message}>
                        <Input prefix={<Icon type="user" className="input-icon"/>} placeholder="username"
                               onChange={(e) => {
                                   this.user.username = e.target.value;
                                   this.basicValidator.resetResult("username");
                               }} onBlur={() => this.basicValidator.validate("username")}/>
                    </Form.Item>
                    <Form.Item validateStatus={this.basicValidator.getResult("password").status}
                               help={this.basicValidator.getResult("password").message}>
                        <Input prefix={<Icon type="lock" className="input-icon"/>} type="password"
                               placeholder="Password"
                               onChange={(e) => {
                                   this.user.password = e.target.value;
                                   this.basicValidator.resetResult("password");
                               }} onBlur={() => this.basicValidator.validate("password")}
                               onKeyUp={e => e.keyCode === 13 && this.onSubmit()}/>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox checked={true}>Remember me</Checkbox>
                        <a className="forgot" href="">Forgot password</a>
                        <Button type="primary" loading={this.loading} className="login-button"
                                onClick={this.onSubmit}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Layout>
        )
    };

    onSubmit = () => {
        this.basicValidator.validateAll(() => {
            this.loading = true;
            auth.login(this.user.username, this.user.password)
                .then(() => global.history.push(this.props.router.location.query.returnUrl || "/"))
                .finally(() => this.loading = false);
        });
    }
}