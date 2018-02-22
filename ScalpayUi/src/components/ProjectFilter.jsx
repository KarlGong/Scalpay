import {Layout, Menu, Input, Icon, Select, Spin} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import PropTypes from "prop-types";

@observer
export default class ProjectFilter extends Component {
    static defaultProps = {
        style: null,
        className: null,
        onChange: (value) => {}
    };

    @observable projects = [];

    componentDidMount = () => {
        this.searchProjects();
    };

    render = () => {
        return <Select
            allowClear
            showSearch
            className={this.props.className}
            placeholder="All Projects"
            dropdownMatchSelectWidth={false}
            onSearch={this.searchProjects}
            onChange={this.props.onChange}
            style={this.props.style}
        >
            {this.projects.map(project =>
                <Select.Option key={project.projectKey} title={project.projectKey}>{project.name}</Select.Option>
            )}
        </Select>
    };

    searchProjects = (value) => {
        axios.get("/api/projects", {
            params: {
                searchText: value || null
            }
        })
            .then(response => this.projects = response.data);
    }
}