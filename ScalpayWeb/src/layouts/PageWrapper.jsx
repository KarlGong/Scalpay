import {Layout} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import cs from "classnames";
import "./PageWrapper.less";

@observer
export default class PageWrapper extends Component {
    static defaultProps = {
        style: {},
        className: "",
        breadcrumb: null
    };

    render = () => {
        return <Layout className={cs("page-wrapper", this.props.className)} style={this.props.style}>
            {this.props.breadcrumb ?
                <div className="breadcrumb">
                    {this.props.breadcrumb}
                </div>
                : null}
            {this.props.children}
        </Layout>
    }
}