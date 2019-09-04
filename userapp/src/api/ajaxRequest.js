/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */

import axios from 'axios';
import { MessageBox, Message, Notification } from 'element-ui';
import { getLocal,setLocal } from "@/libs/local.js";
import environment from "@/environment/index.js";
import store from "@/store/index";
import router from '@/router/index'
import Cookies from "js-cookie"
import securityService from "@/services/authentication/securityService";
// 环境的切换
// if (process.env.NODE_ENV == 'development') {    
//     axios.defaults.baseURL = environment.memberManageApi;
// }  else if (process.env.NODE_ENV == 'production') {    
//     axios.defaults.baseURL = '/';
// }
axios.defaults.baseURL = environment.memberManageApi;
// if (process.env.NODE_ENV === "production") {
//     axios.defaults.withCredentials = true; //允许携带cookie
// }

// 请求超时时间
axios.defaults.timeout = 15000;
//设置put请求传输内容的格式
axios.defaults.headers.put['Content-Type'] = 'application/json-patch+json;charset=UTF-8';
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = true;
// 请求拦截器
axios.interceptors.request.use(
    config => {

        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = getLocal('token');
        token && (config.headers.Authorization = "Bearer " + token);
        if (process.env.NODE_ENV === 'development') {
            config.headers.AppId = getLocal('ymId') ? getLocal('ymId') : store.state.dashboard.appId;
        }
       
        //config.headers.SiteId = Cookies.get('SiteId') ? Cookies.get('SiteId') : store.state.dashboard.siteId;
        // config.headers.AppId = "823EB3BD-93F4-4655-B833-D604A6EF2032";//store.state.dashboard.appid;
        return config;
    },
    error => {
        return Promise.error(error);
    })

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是200的情况    
    (error) => {
        try {
            let status = error.response.status;
            if (error.response.status) {
                switch (error.response.status) {
                    case 400:
                            Notification({
                                customClass: "notify-error", //  notify-success ||  notify-error
                                message: error.response.data,
                                showClose: false,
                                type:"error",
                                duration:2000
                              
                            })
                            break;
                    // 401: 未登录                
                    // 未登录则跳转登录页面，并携带当前页面的路径                
                    // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                    case 401:
                        // alert('404')
                        // store.commit("SET_USER")
                        // window.sessionStorage.clear()
                        // securityService.signIn();
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
                        // alert('404')
                        // Notification({
                        //     message: error.response.data.message,
                        //     showClose: false,
                        //     type:"error",
                        //     duration:2000
                        // })
                        break;
                    // 其他错误，直接抛出错误提示                
                    default:
                        Notification({
                            customClass: "notify-error", //  notify-success ||  notify-error
                            message: error.response.data.message,
                            showClose: false,
                            type:"error",
                            duration:2000
                          
                        })

                }
                return Promise.reject(error.response);
            }
        } catch (e) {
            console.log(e)
        }
    }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
    var timestamp = (new Date()).valueOf();
    return new Promise((resolve, reject) => {
        axios.get(url +'?random='+timestamp, {
            params: params
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
export function post(url, params, fn) {
    return new Promise((resolve, reject) => {
        axios.post(url, params, fn)
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
                resolve(res);
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    });
}