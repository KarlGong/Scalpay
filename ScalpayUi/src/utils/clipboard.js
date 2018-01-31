import {toJS} from "mobx";

class Clipboard {
    storage = {};

    set(type, value) {
        this.storage[type] = JSON.parse(JSON.stringify(toJS(value)));
    }

    get(type) {
        return this.storage[type];
    }
}

export default new Clipboard();