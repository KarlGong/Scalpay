import {Layout, Menu, Input, Icon, List, Button, Modal, message, Table, Breadcrumb} from "antd";
import React, {PureComponent, Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import {Link} from "react-router";
import axios from "axios";
import auth from "~/utils/auth";
import {Privilege} from "~/utils/store";
import PageWrapper from "~/layouts/PageWrapper";
import ProjectSelect from "~/components/ProjectSelect";
import ItemInfo from "~/components/ItemInfo";
import itemModal from "~/modals/itemModal/itemModal";
import global from "~/global";
import ProjectInfo from "~/components/ProjectInfo";
import guid from "~/utils/guid";
import Block from "~/layouts/Block";
import AuditsView from "~/components/AuditsView";

@observer
export default class HomePage extends Component {
    render = () => {
        return <PageWrapper
            breadcrumb={<Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Breadcrumb>}>
            <AuditsView pageSize={10}/>
        </PageWrapper>
    }
}