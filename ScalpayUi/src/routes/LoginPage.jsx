import {Layout, Menu, Input, Icon, Form, Button, Checkbox} from "antd";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import "./LoginPage.less";
import Validator from "~/utils/Validator";

@observer
export default class LoginPage extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    @observable user = {username: null, password: null};
    @observable validator = new Validator(this.user, {
        username: {required: true},
        password: {required: true}
    });

    render = () => {
        return (
            <Layout className="login-page">
                <Form className="login-form">
                    <Form.Item validateStatus={this.validator.getResult("username").status}
                               help={this.validator.getResult("username").message}>
                        <Input prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>} placeholder="Username"
                               onChange={(e) => {
                                   this.user.username = e.target.value;
                                   this.validator.resetResult("username");
                               }} onBlur={() => this.validator.validate("username")}/>
                    </Form.Item>
                    <Form.Item validateStatus={this.validator.getResult("password").status}
                               help={this.validator.getResult("password").message}>
                        <Input prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>} type="password"
                               placeholder="Password"
                               onChange={(e) => {
                                   this.user.password = e.target.value;
                                   this.validator.resetResult("password");
                               }} onBlur={() => this.validator.validate("password")}/>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox checked={true}>Remember me</Checkbox>
                        <a className="login-form-forgot" href="">Forgot password</a>
                        <Button type="primary" className="login-form-button" onClick={this.onSubmit}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Layout>
        )
    };

    onSubmit = () => {
        this.validator.validateAll(() => {
            this.context.router.push(this.context.router.location.query.returnUrl || "/");
        });
    }
}