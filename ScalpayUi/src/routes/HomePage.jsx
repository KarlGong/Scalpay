import {Breadcrumb} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PageWrapper from "~/layouts/PageWrapper";
import AuditsView from "~/components/AuditsView";

@observer
export default class HomePage extends Component {
    render = () => {
        return <PageWrapper
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Breadcrumb>}>
            <AuditsView pageSize={10}/>
        </PageWrapper>
    }
}