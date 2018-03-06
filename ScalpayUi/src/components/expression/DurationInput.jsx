import {Layout, Menu, Input, Icon, InputNumber} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import cs from "classnames";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import moment from "moment";
import NumberInput from "./NumberInput";
import "./DurationInput.less";

@observer
export default class DurationInput extends Component {
    static defaultProps = {
        style: {},
        className: "",
        defaultValue: "P0Y0M0DT0H0M0S",
        onChange: (value) => {
        }
    };

    inputs = {};

    constructor(props) {
        super(props);
        let duration = moment.duration(this.props.defaultValue);
        this.years = duration.years();
        this.months = duration.months();
        this.days = duration.days();
        this.hours = duration.hours();
        this.minutes = duration.minutes();
        this.seconds = duration.seconds();
    }

    render = () => {
        return <div
            style={this.props.style}
            className={cs("duration-input", this.props.className)}
        >
            <div className="row">
                <NumberInput
                    min={0}
                    precision={0}
                    step={1}
                    ref={instance => this.inputs["years"] = instance}
                    defaultValue={this.years}
                    onChange={value => {
                        this.years = value;
                        this.handleChange();
                    }}
                />
                <div className="label">Years</div>
                <NumberInput
                    min={0}
                    precision={0}
                    step={1}
                    ref={instance => this.inputs["months"] = instance}
                    defaultValue={this.months}
                    onChange={value => {
                        this.months = value;
                        this.handleChange();
                    }}
                />
                <div className="label">Months</div>
                <NumberInput
                    min={0}
                    precision={0}
                    step={1}
                    ref={instance => this.inputs["days"] = instance}
                    defaultValue={this.days}
                    onChange={value => {
                        this.days = value;
                        this.handleChange();
                    }}
                />
                <div className="label">Days</div>
            </div>
            <div className="row">
                <NumberInput
                    min={0}
                    precision={0}
                    step={1}
                    ref={instance => this.inputs["hours"] = instance}
                    defaultValue={this.hours}
                    onChange={value => {
                        this.hours = value;
                        this.handleChange();
                    }}
                />
                <div className="label">Hours</div>
                <NumberInput
                    min={0}
                    precision={0}
                    step={10}
                    ref={instance => this.inputs["minutes"] = instance}
                    defaultValue={this.minutes}
                    onChange={value => {
                        this.minutes = value;
                        this.handleChange();
                    }}
                />
                <div className="label">Minutes</div>
                <NumberInput
                    min={0}
                    precision={0}
                    step={10}
                    ref={instance => this.inputs["seconds"] = instance}
                    defaultValue={this.seconds}
                    onChange={value => {
                        this.seconds = value;
                        this.handleChange();
                    }}
                />
                <div className="label">Seconds</div>
            </div>
        </div>
    };

    handleChange = () => {
        let duration = moment.duration({
            years: this.years,
            months: this.months,
            days: this.days,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
        });
        this.props.onChange(duration.toISOString());
    };

    validate = () => {
        return Promise.all(Object.values(this.inputs).map(input => input.validate()));
    }
}