import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";

@observer
export default class ProfilePage extends Component {
    render = () => {
        return <div>
            my profile
        </div>
    }
}