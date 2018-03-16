import {Layout, Menu, Input, Icon, List} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import ItemInfo from "./ItemInfo";
import ProjectInfo from "./ProjectInfo";
import UserInfo from "./UserInfo";
import {AuditType} from "~/utils/store";
import axios from "axios";
import moment from "moment";
import global from "~/global";

@observer
export default class AuditsView extends Component {
    static defaultProps = {
        projectKey: null,
        ItemKey: null,
        OperatorUserName: null
    };

    criteria = {
        projectKey: this.props.projectKey,
        ItemKey: this.props.itemKey,
        OperatorUserName: this.props.OperatorUserName,
        pageIndex: 0,
        pageSize: 5
    };
    @observable loading = false;
    @observable audits = [];
    @observable totalCount = 0;

    componentDidMount = () => {
        this.fetchAudits();
    };

    render = () => {
        return <List
            pagination={{
                size: "small",
                showTotal: (total, range) => total ? `${range[0]}-${range[1]} of ${total} records` : "0-0 of 0 records",
                pageSize: this.criteria.pageSize,
                current: this.criteria.pageIndex + 1,
                total: this.totalCount,
                onChange: (page, pageSize) => {
                    this.criteria.pageIndex = page - 1;
                    this.criteria.pageSize = pageSize;
                    this.fetchAudits();
                }
            }}
            className="audits-view"
            itemLayout="horizontal"
            loading={this.loading}
            dataSource={this.audits}
            renderItem={audit => {
                let title = null;
                switch (audit.auditType) {
                    case AuditType.AddItem:
                        title = <span><UserInfo user={audit.operator}/> added item <ProjectInfo
                            project={audit.project}/> / <ItemInfo item={audit.item}/></span>;
                        break;
                    case AuditType.UpdateItem:
                        title = <span><UserInfo user={audit.operator}/> updated item <ProjectInfo
                            project={audit.project}/> / <ItemInfo item={audit.item}/></span>;
                        break;
                    case AuditType.DeleteItem:
                        title = <span><UserInfo user={audit.operator}/> deleted item <span
                            className="deleted">{audit.itemKey}</span></span>;
                        break;
                    case AuditType.AddProject:
                        title = <span><UserInfo user={audit.operator}/> added project <ProjectInfo
                            project={audit.project}/></span>;
                        break;
                    case AuditType.UpdateProject:
                        title = <span><UserInfo user={audit.operator}/> updated project <ProjectInfo
                            project={audit.project}/></span>;
                        break;
                    case AuditType.DeleteProject:
                        title = <span><UserInfo user={audit.operator}/> deleted project <span
                            className="deleted">{audit.projectKey}</span></span>;
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
            this.audits = res.data.data;
            this.totalCount = res.data.totalCount;
        }).finally(() => this.loading = false);
    }
}