import {browserHistory} from "react-router";
import {notification} from "antd";
import axios from "axios";

const history = browserHistory;

axios.interceptors.response.use(
    response => response,
    error => {
        notification.error({
            message: error.message,
            description: error.response.data,
            duration: 0,
        });
        return Promise.reject(error);
    }
);

export default {history}