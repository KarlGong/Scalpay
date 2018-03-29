import React, {Component} from "react";
import {observer} from "mobx-react";
import cs from "classnames";
import "./FieldsViewer.less";

@observer
export default class FieldsViewer extends Component {
    static defaultProps = {
        fields: [],
        className: "",
        style: {}
    };

    render = () => {
        return <div className={cs("fields-viewer", this.props.className)} style={this.props.style}>
            {
                this.props.fields.map(([label, value]) => {
                    return <div key={label} className="item">
                        <div className="label">{label}</div>
                        <div className="value">{value}</div>
                    </div>
                })
            }

        </div>
    }
}