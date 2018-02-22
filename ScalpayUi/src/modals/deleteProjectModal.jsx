import {Layout, Menu, Input, Icon, Form, Spin, Modal, Button, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {render, unmountComponentAtNode} from "react-dom";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import Validator from "~/utils/Validator";
import global from "~/global";
import ProjectInfo from "~/components/ProjectInfo";


const target = document.createElement("div");
document.body.appendChild(target);

function open(project, onSuccess) {
    render(<DeleteProjectModal project={project} onSuccess={onSuccess}/>, target);
}

function close() {
    unmountComponentAtNode(target);
}

@observer
class DeleteProjectModal extends Component {
    static defaultProps = {
        project: {},
        onSuccess: (project) => {}
    };

    @observable loading = false;
    @observable visible = true;

    render = () => {
        return <Modal
            title={<span><Icon type="question-circle" style={{color: "#ff4d4f"}}/> Are you sure to delete this project?</span>}
            okText="Delete Project"
            okType="danger"
            cancelText="Cancel"
            visible={this.visible}
            maskClosable={false}
            confirmLoading={this.loading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => close()}
        >
            All the items under this project will also be deleted.
        </Modal>
    };

    handleOk = () => {
        this.loading = true;
        axios.delete("/api/projects/" + this.props.project.projectKey)
            .then(() => {
                this.loading = false;
                this.visible = false;
                message.success(<span>
                        Project <ProjectInfo project={this.props.project}/> is deleted successfully!
                    </span>);
                this.props.onSuccess(this.props.project);
            }, () => this.loading = false);
    };

    handleCancel = (e) => {
        this.visible = false;
    };
}

export default {open};