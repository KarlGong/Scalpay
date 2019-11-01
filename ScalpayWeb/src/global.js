import {browserHistory} from "react-router";
import {notification} from "antd";
import axios from "axios";
import auth from "~/utils/auth";

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
        if (error.response.data.statusCode) {
            notification.error({
                message: "Error code " + error.response.data.statusCode,
                description: error.response.data.message,
                duration: 0,
            });
        } else {
            notification.error({
                message: error.message,
                description: error.response.data,
                duration: 0,
            });
        }
        return Promise.reject(error);
    }
);

export default {history}