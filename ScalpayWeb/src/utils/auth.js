import {observable} from "mobx";
import axios from "axios";
import {Role, Permission} from "~/const";

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

    getProjectPermission = (projectKey) => {
        if (this.user.role === Role.Admin) {
            return Promise.resolve(Permission.Admin);
        } else {
            return axios.get(`/api/projects/${projectKey}/permissions/${this.user.username}`)
                .then((res) => Promise.resolve(res.data.permission));
        }
    }
}

export default new Auth();