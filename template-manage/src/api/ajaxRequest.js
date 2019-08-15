/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import qs from 'qs';
import { getLocal } from "@/libs/local.js"
import environment from "@/environment/index.js"
import store from "@/store/index"
import router from '@/router/index'
import { MessageBox, Message, Loading, Notification } from 'element-ui';
import securityService from "@/services/authentication/securityService";
import Cookies from "js-cookie";
let loading        //定义loading变量
function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({

        lock: true,
        text: '拼命加载中……',
        // background: 'rgba(255, 255, 255, 0.7)',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}
//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}
axios.defaults.baseURL = environment.memberManageApi;
// 请求超时时间
axios.defaults.timeout = 15000;
//axios.defaults.withCredentials = true; //允许携带cookie
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.defaults.headers.put['Content-Type'] = 'application/json-patch+json;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = store.getters.token;
        token && (config.headers.Authorization = 'Bearer ' + token);
        //todo 测试阶段写死
        let appId = store.state.dashboard.appId;
        if (appId) {
            config.headers.AppId = store.state.dashboard.appId;
        } else {
            config.headers.AppId = getLocal('ymId');
        }
        //showFullScreenLoading()
        return config;
    },
    error => {
        return Promise.error(error);
    })

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // tryHideFullScreenLoading()

        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是200的情况    
    error => {
        // tryHideFullScreenLoading()
        console.log(error, "error");
        let status = error.response.status;
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录                
                // 未登录则跳转登录页面，并携带当前页面的路径                
                // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                case 401:
                    // router.push({ path: '/401' })
                    store.commit("SET_USER")
                    window.sessionStorage.clear()
                    securityService.signIn();

                    break;
                // 403 token过期                
                // 登录过期对用户进行提示                
                // 清除本地token和清空vuex中token对象                
                // 跳转登录页面                
                case 403:
                    alert('403')
                    break;
                // 404请求不存在                
                case 404:
                    // router.push({ path: '/404' })
                    break;
                // 其他错误，直接抛出错误提示  
                case 500:
                    Notification({
                        message: error.response.data.message,
                        duration: 5 * 1000,
                        customClass: "notify-error",  //  notify-success ||  notify-error
                        showClose: false,
                    })
                    return;
                default:
                    Notification({
                        message: error.response.data.message,
                        duration: 5 * 1000,
                        customClass: "notify-error",  //  notify-success ||  notify-error
                        showClose: false,
                    })

                    break;
            }

            return Promise.reject(error.response);
        }
    }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params, { indices: false })
            }
        })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            })
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            })
    });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            })
    });
}
// export function _delete(url, params){
//     return new Promise((resolve, reject) => {
//         axios.delete(url,data:{params})
//             .then(res => {
//                 resolve(res);
//             })
//             .catch(err => {
//                 reject(err)
//             })
//     });
// }


export function _delete(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, params)
            .then(res => {
                console.log(res)
                resolve(res);
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    });
}