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

    @observable key = guid();
    lastSearchId = 0;
    @observable projects = [];
    @observable loading = false;

    componentDidMount = () => {
        this.searchProjects().then(() => this.key = guid());
    };

    render = () => {
        return <Select
            key={this.key}
            showSearch
            disabled={this.props.disabled}
            allowClear={this.props.allowClear}
            defaultValue={this.props.defaultValue}
            placeholder="Project"
            className={this.props.className}
            style={this.props.style}
            dropdownMatchSelectWidth={false}
            notFoundContent={this.loading ? <Spin size="small"/> : "Not Found"}
            filterOption={false}
            onSearch={debounce(this.searchProjects, 800)}
            onChange={this.props.onChange}
            onBlur={this.props.onBlur}
        >
            {this.projects.map(project =>
                <Select.Option key={project.projectKey}>{project.name}</Select.Option>
            )}
        </Select>
    };

    searchProjects = (value) => {
        this.loading = true;
        this.projects = [];
        this.lastSearchId += 1;
        const searchId = this.lastSearchId;
        return axios.get("/api/projects", {
            params: {
                searchText: value || null
            }
        })
            .then(response => {
                if (searchId === this.lastSearchId) {
                    this.projects = response.data
                }
            })
            .finally(() => this.loading = false);
    }
}