import {observable} from "mobx";
import axios from "axios";
import {Role, Permission} from "~/const";

class Auth {
    @observable user = null;

    constructor() {
        this.user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"))
    }

    login = (username, password, isKeepLogin) => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        return axios.post("/api/auth/username", {
            username,
            password
        }, {skipInterceptor: true}).then(response => {
            this.user = response.data;
            let storage = isKeepLogin ? localStorage : sessionStorage;
            storage.setItem("user", JSON.stringify(this.user));
        });
    };

    logout = () => {
        this.user = null;
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
    };
}

export default new Auth();