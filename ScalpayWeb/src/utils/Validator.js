import Schema from "async-validator";
import {observable} from "mobx";

export default class Validator {
    static defaultResult = {status: null, message: null};

    subject = {};
    descriptor;
    _results = {};
    @observable results = {};

    constructor(subject, descriptor) {
        this.subject = subject || {};
        this.descriptor = descriptor;
    }

    hasError = () => {
        return Object.entries(this.results).some(([fieldName, result]) => result.status === "error")
    };

    getResult = (fieldName) => {
        return this.results[fieldName] || Validator.defaultResult;
    };

    resetResult = (fieldName) => {
        if (!this._results[fieldName]) return;

        delete this._results[fieldName];
        this.results = this._results;
    };

    resetResults = () => {
        this._results = {};
        this.results = this._results;
    };

    setResult = (fieldName, result) => {
        this._results[fieldName] = result;
        this.results = this._results;
    };

    validate = (fieldName) => {
        return new Promise((resolve, reject) => {
            if (this.descriptor[fieldName]) {
                let status = this.getResult(fieldName).status;
                if (status === "success") {
                    resolve(this._results[fieldName]);
                } else if (status === "validating" || status === "error"){
                    reject(this._results[fieldName]);
                } else  {
                    let descriptor = {[fieldName]: this.descriptor[fieldName]};
                    this.setResult(fieldName, {status: "validating", message: null});
                    new Schema(descriptor).validate(this.subject, (errors, fields) => {
                        if (errors) {
                            // error
                            this.setResult(fieldName, {status: "error", message: errors[0].message});
                            reject(this._results[fieldName]);
                        } else {
                            // success
                            this.setResult(fieldName, {status: "success", message: null});
                            resolve(this._results[fieldName]);
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
