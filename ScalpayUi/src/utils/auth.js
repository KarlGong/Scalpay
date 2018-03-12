import {observable} from "mobx";
import axios from "axios";
import {Privilege} from "~/utils/store";

class Auth {
    @observable user = null;

    constructor() {
        this.user = JSON.parse(localStorage.getItem("Scalpay-User"));
    }

    login = (username, password) => {
        return axios.post("/api/auth/signIn", {
            username,
            password
        }).then(response => {
            this.user = response.data.data;
            localStorage.setItem("Scalpay-User", JSON.stringify(this.user));
        });
    };

    logout = () => {
        this.user = null;
        localStorage.removeItem("Scalpay-User");
    };

    hasPrivileges = (...privileges) => {
        return this.user && privileges.every(ele => this.user.privileges.indexOf(ele) > -1);
    }
}

export default new Auth();