import Validator from "~/utils/Validator";

export default class ComponentValidator {
    validators = [];
    subComponentValidators = [];

    constructor(validators) {
        if (Array.isArray(validators)) {
            validators.map(v => this.addValidator(v));
        } else {
            this.addValidator(validators)
        }
    }

    addValidator(validator) {
        if (validator instanceof ComponentValidator) {
            this.subComponentValidators.push(validator)
        } else if (validator instanceof Validator) {
            this.validators.push(validator);
        }
    }

    validate = () => {
        return Promise.all(this.validators.map(v => v.validateAll()).concat(this.subComponentValidators.map(v => v.validate())));
    };

    hasError = () => {
        return this.validators.some(v => v.hasError());
    }
}