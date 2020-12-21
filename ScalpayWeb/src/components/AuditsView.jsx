import {List} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import ItemInfo from "./ItemInfo";
import ProjectInfo from "./ProjectInfo";
import UserInfo from "./UserInfo";
import {AuditType} from "~/const";
import axios from "axios";
import moment from "moment";

@observer
export default class AuditsView extends Component {
    static defaultProps = {
        projectKey: null,
        ItemKey: null,
        OperatorUserName: null,
        pageSize: 5
    };

    criteria = {
        projectKey: this.props.projectKey,
        ItemKey: this.props.itemKey,
        OperatorUserName: this.props.OperatorUserName,
        pageIndex: 0,
        pageSize: this.props.pageSize
    };
    @observable loading = false;
    @observable audits = [];
    @observable totalCount = 0;

    componentDidMount = () => {
        this.fetchAudits();
    };

    render() {
        return <List
            pagination={this.totalCount ? {
                size: "small",
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
                pageSize: this.criteria.pageSize,
                current: this.criteria.pageIndex + 1,
                total: this.totalCount,
                onChange: (page, pageSize) => {
                    this.criteria.pageIndex = page - 1;
                    this.criteria.pageSize = pageSize;
                    this.fetchAudits();
                }
            } : null}
            className="audits-view"
            itemLayout="horizontal"
            loading={this.loading}
            dataSource={this.audits}
            renderItem={audit => {
                let title = null;
                switch (audit.auditType) {
                    case AuditType.addItem:
                        title = <span>
                            <UserInfo username={audit.operator}/>
                            <span> added item </span>
                            <ProjectInfo projectKey={audit.projectKey}/>
                            <span> / </span>
                            <ItemInfo itemKey={audit.itemKey} version={audit.args.itemVersion}/>
                        </span>;
                        break;
                    case AuditType.updateItem:
                        title = <span>
                            <UserInfo username={audit.operator}/>
                            <span> updated item </span>
                            <ProjectInfo projectKey={audit.projectKey}/>
                            <span> / </span>
                            <ItemInfo itemKey={audit.itemKey} version={audit.args.fromItemVersion}/>
                            <span> to </span>
                            <ItemInfo itemKey={audit.itemKey} version={audit.args.toItemVersion}/>
                        </span>;
                        break;
                    case AuditType.addProject:
                        title = <span>
                            <UserInfo username={audit.operator}/>
                            <span> added project </span>
                            <ProjectInfo projectKey={audit.projectKey} version={audit.args.projectVersion}/>
                        </span>;
                        break;
                    case AuditType.updateProject:
                        title = <span>
                            <UserInfo username={audit.operator}/>
                            <span> updated project </span>
                            <ProjectInfo projectKey={audit.projectKey} version={audit.args.fromProjectVersion}/>
                            <span> to </span>
                            <ProjectInfo projectKey={audit.projectKey} version={audit.args.toProjectVersion}/>
                        </span>;
                        break;
                }

                return <List.Item>
                    <List.Item.Meta
                        title={title}
                    />
                    <div>{moment(audit.insertTime).fromNow()}</div>
                </List.Item>
            }}/>
    };

    fetchAudits = () => {
        this.loading = true;
        axios.get("/api/audits", {
            params: this.criteria
        }).then((res) => {
            this.audits = res.data.value;
            this.totalCount = res.data.totalCount;
        }).finally(() => this.loading = false);
    }
}