import axios from 'axios';
import {getLocal} from "@/libs/local.js"
// import store from "../store/index";
class AjaxRequest {
    constructor() {
        this.baseURL = process.env.NODE_ENV == 'production' ? '/' : '/api';
        this.timeout = 3000; // 超时时间
    }
    merge(options) {
        return { ...options, baseURL: this.baseURL, timeout: this.timeout }
    }
    setInterceptor(instance, url) {   
        instance.interceptors.request.use((config) => {         
            config.headers.Authorization = "Bearer"+ getLocal('token');
            return config;
        });
        instance.interceptors.response.use((res) => {
            return res.data;
        });
    }
    request(options) {
        let instance = axios.create();
        this.setInterceptor(instance, options.url);
        let config = this.merge(options);
        return instance(config);
    }
}
export default new AjaxRequest;




