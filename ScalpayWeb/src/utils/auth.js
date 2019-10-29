import {observable} from "mobx";
import axios from "axios";

class Auth {
    @observable user = null;

    constructor() {
        this.user = JSON.parse(localStorage.getItem("user"));
    }

    login = (username, password) => {
        return axios.post("/api/auth/signIn", {
            username,
            password
        }).then(response => {
            this.user = response.data;
            localStorage.setItem("user", JSON.stringify(this.user));
        });
    };

    logout = () => {
        this.user = null;
        localStorage.removeItem("user");
    };
}

export default new Auth();