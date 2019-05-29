import axios from 'axios';
class AjaxRequest {
    constructor() {
        this.baseURL = process.env.NODE_ENV == 'production' ? '/' : '/api';
        this.timeout = 3000; // 超时时间
        this.queue = {}; // 存放每次的请求
    }
    merge(options) {
        return { ...options, baseURL: this.baseURL, timeout: this.timeout }
    }
    setInterceptor(instance, url) {

        instance.interceptors.request.use((config) => {
            // config.headers.Authorization = getLocal('token');
            // if(Object.keys(this.queue).length === 0){
            //     store.commit('showLoading');
            // }
          
            config.headers["x-requested-with"] = "XMLHttpRequest";
            this.queue[url] = url;
            return config;
        });

        instance.interceptors.response.use((res) => {
            delete this.queue[url]; // 每次请求成功后 都删除队列里的路径
            if (Object.keys(this.queue).length === 0) {
                // store.commit('hideLoading');
            }
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
/**
 * jsonp方法
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
const jsonp = (url, params) => {
    return new Promise((resolve, reject) => {
        JSONP(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
export default new AjaxRequest;




