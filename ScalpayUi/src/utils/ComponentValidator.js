import {observable} from "mobx";

export default class ComponentValidator {
    validators = [];

    constructor(validators) {
        if (Array.isArray(validators)) {
            this.validators = validators;
        } else {
            this.validators = [validators];
        }
    }

    validate = () => {
        return Promise.all(this.validators.map(v => v.validateAll()));
    };

    hasError = () => {
        return this.validators.some(v => v.hasError());
    }
}