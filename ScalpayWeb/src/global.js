import {browserHistory} from "react-router";
import {notification} from "antd";
import axios from "axios";
import auth from "~/utils/auth";
import {toString} from "~/utils/util";

const history = browserHistory;

axios.interceptors.request.use(
    config => {
        if (auth.user) {
            config.headers["Authorization"] = auth.user.token;
        }
        return config;
    },
    error => Promise.reject(error)
);

axios.interceptors.response.use(
    response => response,
    error => {
        if (!error.config.skipInterceptor) {
            if (error.response && error.response.status === 401) {
                if (history.getCurrentLocation().pathname !== "/login") {
                    history.push(`/login?returnUrl=${history.getCurrentLocation().pathname}`);
                }
            } else {
                notification.error({
                    message: error.message,
                    description: error.response && toString(error.response.data),
                    duration: 0,
                });
            }
        }
        return Promise.reject(error);
    }
);

export default {history}