import Schema from "async-validator";
import {observable, toJS} from "mobx";

export default class Validator {
    static defaultResult = {status: null, message: null};

    subject = {};
    descriptor = {};
    @observable results = {};

    constructor(subject, descriptor) {
        this.subject = subject || {};
        this.descriptor = descriptor || {};
    }

    hasError = () => {
        return Object.entries(this.results).some(([fieldName, result]) => result.status === "error")
    };

    getResult = (fieldName) => {
        return this.results[fieldName] || Validator.defaultResult;
    };

    resetResult = (fieldName) => {
        if (!this.results[fieldName]) return;

        delete this.results[fieldName];
    };

    resetResults = () => {
        this.results = {};
    };

    setResult = (fieldName, result) => {
        this.results[fieldName] = result;
    };

    validate = (fieldName) => {
        return new Promise((resolve, reject) => {
            if (this.descriptor[fieldName]) {
                let status = this.getResult(fieldName).status;
                if (status === "success") {
                    resolve(toJS(this.results[fieldName]));
                } else if (status === "validating" || status === "error"){
                    reject(toJS(this.results[fieldName]));
                } else  {
                    let descriptor = {[fieldName]: this.descriptor[fieldName]};
                    this.setResult(fieldName, {status: "validating", message: null});
                    new Schema(descriptor).validate(this.subject, (errors, fields) => {
                        if (errors) {
                            // error
                            this.setResult(fieldName, {status: "error", message: errors[0].message});
                            reject(toJS(this.results[fieldName]));
                        } else {
                            // success
                            this.setResult(fieldName, {status: "success", message: null});
                            resolve(toJS(this.results[fieldName]));
                        }
                    });
                }
            } else {
                throw new Error(`Validating descriptor of field ${fieldName} is not defined.`);
            }
        });
    };

    validateAll = () => {
        return Promise.all(Object.keys(this.descriptor).map(fieldName => this.validate(fieldName)));
    };
}