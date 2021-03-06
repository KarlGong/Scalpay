import {Select, Spin} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import axios from "axios";
import debounce from "lodash.debounce";

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

    isFocused = false;
    lastSearchId = 0;
    @observable projects = [];
    @observable loading = false;
    criteria = {
        searchText: null,
        pageIndex: 0,
        pageSize: 20
    };

    constructor(props) {
        super(props);
        this.debounceSearchProjects = debounce(this.searchProjects, 500);
    };

    render() {
        return <Select
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
                this.debounceSearchProjects();
            }}
            onChange={this.props.onChange}
            onBlur={this.props.onBlur}
            onFocus={this.handleFocus}
        >
            {this.projects.map(project =>
                <Select.Option key={project.projectKey}>{project.projectKey}</Select.Option>
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
    };

    handleFocus = () => {
        if (!this.isFocused) {
            this.searchProjects();
            this.isFocused = true;
        }
    }
}