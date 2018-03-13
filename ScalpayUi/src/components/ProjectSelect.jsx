import {Layout, Menu, Input, Icon, Select, Spin} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import guid from "~/utils/guid";

@observer
export default class ProjectSelect extends Component {
    static defaultProps = {
        style: {},
        className: "",
        onChange: (value) => {},
        onBlur: () => {},
        allowClear: false,
        disabled: false,
        defaultValue: undefined
    };

    @observable resetKey = guid();
    lastSearchId = 0;
    @observable projects = [];
    @observable loading = false;
    criteria = {
        searchText: null,
        pageIndex: 0,
        pageSize: 20
    };

    componentDidMount = () => {
        if (this.props.defaultValue) {
            this.criteria.searchText = this.props.defaultValue;
            this.searchProjects().then(() => {
                this.criteria.searchText = null;
                this.resetKey = guid();
            });
        } else {
            this.searchProjects();
        }
        this.searchProjects = debounce(this.searchProjects, 500);
    };

    render = () => {
        return <Select
            key={this.resetKey}
            showSearch
            disabled={this.props.disabled}
            allowClear={this.props.allowClear}
            defaultValue={this.props.defaultValue || undefined}
            placeholder="Project"
            className={this.props.className}
            style={this.props.style}
            dropdownMatchSelectWidth={false}
            notFoundContent={this.loading ? <Spin size="small"/> : "Not Found"}
            filterOption={false}
            onSearch={(value) => {
                this.criteria.searchText = value || null;
                this.searchProjects();
            }}
            onChange={this.props.onChange}
            onBlur={this.props.onBlur}
        >
            {this.projects.map(project =>
                <Select.Option key={project.projectKey}>{project.name}</Select.Option>
            )}
        </Select>
    };

    searchProjects = () => {
        this.loading = true;
        this.projects = [];
        this.lastSearchId += 1;
        const searchId = this.lastSearchId;
        return axios.get("/api/projects", {
            params: this.criteria
        })
            .then(response => {
                if (searchId === this.lastSearchId) {
                    this.projects = response.data.data;
                    this.loading = false;
                }
            }, () => this.loading = false);
    }
}