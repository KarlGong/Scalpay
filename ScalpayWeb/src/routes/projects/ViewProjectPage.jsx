import {Breadcrumb, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import FieldsViewer from "~/layouts/FieldsViewer";
import CommandBar from "~/layouts/CommandBar";
import {Link} from "react-router";
import "./ViewProjectPage.less";
import global from "~/global";
import projectModal from "~/modals/projectModal";
import Block from "~/layouts/Block";
import VersionSelect from "~/components/VersionSelect";
import AuditsView from "~/components/AuditsView";

@observer
export default class ViewProjectPage extends Component {

    params = Object.assign({}, this.props.params);
    @observable project = {
        projectKey: this.params.projectKey,
        name: null,
        description: null,
        version: null,
        isLatest: false
    };
    @observable loading = false;

    componentDidMount = () => {
        this.loadProject();
    };

    componentWillReceiveProps = (props) => {
        if (JSON.stringify(this.params) !== JSON.stringify(props.params)) {
            this.params = props.params;
            this.loadProject();
        }
    };

    render = () => {
        let leftCommands = [];
        if (auth.hasPrivileges(Privilege.projectManage) && this.project.isLatest) {
            leftCommands.push(<Button onClick={() => this.editProject()}>Edit</Button>)
        }
        let rightCommands = [];
        if (this.project.isLatest) {
            rightCommands.push(<VersionSelect
                version={this.project.version}
                onChange={(version) => global.history.push("/projects/" + this.project.projectKey + "/v" + version)}/>)
        }

        return <PageWrapper
            className="view-project-page"
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/projects">Projects</Link></Breadcrumb.Item>
                {
                    this.params.projectVersion ?
                        [
                            <Breadcrumb.Item key={1}>
                                <Link to={"/projects/" + this.params.projectKey}>
                                    {this.params.projectKey}
                                </Link>
                            </Breadcrumb.Item>,
                            <Breadcrumb.Item key={2}>v{this.params.projectVersion}</Breadcrumb.Item>
                        ]
                        : <Breadcrumb.Item>{this.params.projectKey}</Breadcrumb.Item>
                }
            </Breadcrumb>}>
            <CommandBar leftItems={leftCommands} rightItems={rightCommands}/>
            <Block name="Basic" loading={this.loading}>
                <FieldsViewer fields={[
                    ["Project Key", this.project.projectKey],
                    ["Name", this.project.name],
                    ["Description", this.project.description]
                ]}/>
            </Block>
            {
                !this.params.projectVersion ?
                    <Block name="Activity">
                        <AuditsView projectKey={this.project.projectKey}/>
                    </Block>
                    : null
            }
        </PageWrapper>
    };

    loadProject = () => {
        this.loading = true;
        let url = "";
        if (this.params.projectVersion) {
            url = "/api/projects/" + this.params.projectKey + "/v" + this.params.projectVersion;
        } else {
            url = "/api/projects/" + this.params.projectKey;
        }
        axios.get(url)
            .then((res) => this.project = res.data.data)
            .finally(() => this.loading = false);
    };

    editProject = () => {
        projectModal.edit(this.project, (project) => this.loadProject());
    };
}