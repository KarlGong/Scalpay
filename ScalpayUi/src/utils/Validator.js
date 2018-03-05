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
            })
        });

    };

    validateAll = () => {
        return new Promise((resolve, reject) => {
            let errorFieldNames = [];
            let unvalidatedFieldNames = [];
            let validatingFieldNames = [];

            Object.keys(this.descriptor).map((fieldName) => {
                switch (this.getResult(fieldName).status) {
                    case null:
                        unvalidatedFieldNames.push(fieldName);
                        break;
                    case "error":
                        errorFieldNames.push(fieldName);
                        break;
                    case "validating":
                        validatingFieldNames.push(fieldName);
                        break;
                }
            });

            let descriptor = {};
            unvalidatedFieldNames.map((fieldName) => {
                descriptor[fieldName] = this.descriptor[fieldName];
                this._results[fieldName] = {status: "validating", message: null};
            });
            this.results = this._results;

            new Schema(descriptor).validate(this.subject, (errors, fields) => {
                unvalidatedFieldNames.map((fieldName) => {
                    this._results[fieldName] = {status: "success", message: null};
                });
                if (errors) {
                    // unvalidated error
                    Object.keys(fields).map((fieldName) => {
                        this._results[fieldName] = {status: "error", message: fields[fieldName][0].message}
                    });
                    this.results = this._results;
                    reject(this._results);
                } else {
                    // unvalidated success
                    this.results = this._results;
                    if (errorFieldNames.length || validatingFieldNames.length) {
                        reject(this._results);
                    } else {
                        resolve(this._results);
                    }
                }
            })
        });
    };
}
