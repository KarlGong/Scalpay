import {Layout, Menu, Input, Icon, Select, Spin} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

@observer
export default class ProjectSelect extends Component {
    static defaultProps = {
        style: {},
        className: "",
        onChange: (value) => {},
        allowClear: false
    };

    focused = false;
    lastSearchId = 0;
    @observable projects = [];
    @observable loading = false;

    render = () => {
        return <Select
            showSearch
            allowClear={this.props.allowClear}
            placeholder="Project"
            className={this.props.className}
            style={this.props.style}
            dropdownMatchSelectWidth={false}
            notFoundContent={this.loading ? <Spin size="small"/> : "Not Found"}
            filterOption={false}
            onSearch={debounce(this.searchProjects, 800)}
            onChange={this.props.onChange}
            onFocus={() => {
                if (!this.focused) {
                    this.focused = true;
                    this.searchProjects()
                }
            }}
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
        axios.get("/api/projects", {
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