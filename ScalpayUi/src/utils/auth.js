import {observable} from "mobx";
import axios from "axios/index";

class Auth {
    @observable user = null;

    constructor() {
        this.user = JSON.parse(localStorage.getItem("Scalpay-User"));
    }

    login = (userName, password) => {
        return axios.post("/api/auth/signIn", {
            userName,
            password
        }).then(response => {
            this.user = response.data;
            localStorage.setItem("Scalpay-User", JSON.stringify(this.user));
        });
    };

    logout = () => {
        this.user = null;
        localStorage.removeItem("Scalpay-User");
    };
}

const auth = new Auth();

axios.interceptors.request.use(
    config => {
        if (auth.user) {
            config.headers["Scalpay-Api-Key"] = auth.user.apiKey;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default auth;