import axios from 'axios';
import { getLocal } from "@/libs/local.js"
// import store from "../store/index";
class AjaxRequest {
    constructor() {
        this.baseURL = process.env.NODE_ENV == 'production' ? '/' : 'http://192.168.199.99:8100';
        this.timeout = 3000; // 超时时间
    }
    merge(options) {
        return { ...options, baseURL: this.baseURL, timeout: this.timeout }
    }
    errorHandle  (error){
         // 对http 状态码做一些处理
         switch (error.response.status) {
            case 401:
                // 未登录
                break;
            case 403:
                // token过期
                break;
            case 404:
                //请求报错
                break;
        }
    }   
    setInterceptor(instance, url) {
        instance.interceptors.request.use(
            (config) => {
                const token = getLocal('token');
                token && (config.headers.Authorization = "Bearer " + token);
                return config;
            },

        );
        instance.interceptors.response.use(
            (res) => {
                // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
                // 否则的话抛出错误
                if (res.status === 200) {
                    //console.log(res)
                    return Promise.resolve(res);
                } else {
                    return Promise.reject(res);
                }
            },
            error => {
                this.errorHandle(error)
                return Promise.reject(error.response);

            }
        );
    }
    request(options) {
        let instance = axios.create();
        instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        this.setInterceptor(instance, options.url);
        console.log(options,'---------')
        let config = this.merge(options);
        return instance(config);
    }
}
export default new AjaxRequest;


