import {Breadcrumb, Button, List, Avatar, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import PageWrapper from "~/layouts/PageWrapper";
import FieldsViewer from "~/layouts/FieldsViewer";
import CommandBar from "~/layouts/CommandBar";
import {Link} from "react-router";
import global from "~/global";
import itemModal from "~/modals/itemModal/itemModal";
import "./ProjectPage.less";
import {Role} from "~/utils/store";

@observer
export default class ProjectPage extends Component {

    @observable project = {
        projectKey: this.props.params.projectKey,
        name: "",
        description: "",
    };
    @observable items = [];
    @observable isLoadingItems = false;

    componentDidMount = () => {
        this.loadProject();
        this.loadItems();
    };

    render = () => {
        return <PageWrapper
            className="project-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/projects">Projects</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{this.project.projectKey}</Breadcrumb.Item>
            </Breadcrumb>}>
            <div className="info">
                <List.Item.Meta
                    avatar={
                        <Avatar size="large" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"/>
                    }
                    title={this.project.projectKey}
                    description={this.project.description}
                />
            </div>
            {/*<CommandBar leftItems={leftCommands} rightItems={rightCommands}/>*/}
            <List
                className="list"
                loading={this.isLoadingItems}
                itemLayout="horizontal"
                dataSource={this.items}
                header={<span>
                            <Input
                                style={{width: "250px"}}
                                prefix={<Icon type="search" style={{color: "rgba(0, 0, 0, .25)"}}/>}
                                allowClear
                                placeholder="Filter"
                                onChange={(e) => this.filterText = e.target.value || ""}/>
                    {
                        auth.user.role == Role.admin &&
                        <Button
                            style={{float: "right"}}
                            onClick={() => this.addItem()}>
                            Add Item
                        </Button>
                    }
                            </span>}
                renderItem={project => {
                    return <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar style={{backgroundColor: "#87d068"}} icon="user"/>}
                            title={<a onClick={() => global.history.push("/projects/" + project.projectKey)}>
                                {project.projectKey}
                            </a>}
                        />
                        <div>{project.description}</div>
                    </List.Item>
                }}
            >
            </List>
        </PageWrapper>
    };

    loadProject = () => {
        axios.get("/api/projects/" + this.props.params.projectKey)
            .then((res) => this.project = res.data);
    };

    loadItems = () => {
        this.isLoadingItems = true;
        axios.get("/api/projects/" + this.props.params.projectKey + "/items")
            .then((res) => this.items = res.data.data)
            .finally(() => this.isLoadingItems = false);
    };

    addItem = () => {
        itemModal.add(() => this.loadItems());
    };

    editProject = () => {
        projectModal.edit(this.project, (project) => this.loadProject());
    };
}