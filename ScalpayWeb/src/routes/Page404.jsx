import {Layout, Menu, Input, Result, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import PageWrapper from "~/layouts/PageWrapper";

@observer
export default class Page404 extends Component {
    render = () => {
        return <PageWrapper style={{background: "#f0f2f5", justifyContent: "center", alignItems: "center"}}>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
            />
        </PageWrapper>
    }
}