import {toJS} from "mobx";

class Clipboard {
    storage = {};

    set(dataType, value) {
        this.storage[dataType] = JSON.stringify(toJS(value));
    }

    get(dataType) {
        return JSON.parse(this.storage[dataType]);
    }
}

export default new Clipboard();