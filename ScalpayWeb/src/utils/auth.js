import {observable} from "mobx";
import axios from "axios";
import {Role, Permission} from "~/const";

class Auth {
    @observable user = null;

    constructor() {
        this.user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
    }

    login = (username, password, isKeepLogin) => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        return axios.post("/api/auth/username", {
            username,
            password
        }, {skipInterceptor: true}).then(response => {
            response.data.projectPermissions = response.data.projectPermissions.reduce((map, obj) => {
                map[obj.projectKey] = obj.permission;
                return map;
            }, {});
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

    hasGlobalPermission = (permission) => {
        if (this.user === null) {
            return false;
        }

        if (this.user.role === Role.Admin) {
            return true;
        }

        return permission === Permission.Read;
    };

    hasProjectPermission = (projectKey, permission) => {
        if (this.user === null) {
            return false;
        }

        if (this.user.role === Role.Admin) {
            return true;
        }

        let projectPermission = this.user.projectPermissions[projectKey];

        if (!projectPermission) {
            return false;
        }

        if (projectPermission === Permission.Admin) {
            return true;
        }

        return permission === Permission.Read;
    }
}

export default new Auth();