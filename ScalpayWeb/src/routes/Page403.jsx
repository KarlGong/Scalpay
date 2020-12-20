import {Layout, Menu, Input, Result, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import PageWrapper from "~/layouts/PageWrapper";

@observer
export default class Page403 extends Component {
    render() {
        return <PageWrapper style={{background: "#f0f2f5", justifyContent: "center", alignItems: "center"}}>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
            />
        </PageWrapper>
    }
}