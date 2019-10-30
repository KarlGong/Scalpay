import {observable} from "mobx";
import axios from "axios";

class Auth {
    @observable user = null;

    constructor() {
        this.user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"))
    }

    login = (username, password, isKeepLogin) => {
        return axios.post("/api/auth/signIn", {
            username,
            password
        }).then(response => {
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