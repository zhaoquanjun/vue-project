/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */

import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import { getLocal } from "@/libs/local.js";
import environment from "@/environment/index.js";
import store from "@/store/index";
import router from '@/router/index'
import securityService from "@/services/authentication/securityService";
// 环境的切换
// if (process.env.NODE_ENV == 'development') {    
//     axios.defaults.baseURL = environment.memberManageApi;
// }  else if (process.env.NODE_ENV == 'production') {    
//     axios.defaults.baseURL = '/';
// }
axios.defaults.baseURL = environment.memberManageApi;
if(process.env.NODE_ENV === "production"){
    axios.defaults.withCredentials=true; //允许携带cookie
}

// 请求超时时间
axios.defaults.timeout = 5000;
//设置put请求传输内容的格式
axios.defaults.headers.put['Content-Type'] = 'application/json-patch+json;charset=UTF-8';
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
    config =>{
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = getLocal('token');       
        token && (config.headers.Authorization = "Bearer " + token);
        config.headers.appid = store.state.dashboard.appid;
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
    error => {
        let status = error.response.status;
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录                
                // 未登录则跳转登录页面，并携带当前页面的路径                
                // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                case 401:
                    // alert('404')
                    // store.commit("SET_USER")
                    // window.localStorage.clear()
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
                    router.push({ path: '/404' })
                    break;
                // 其他错误，直接抛出错误提示                
                default:
                        Message({
                            message: status +"   "+ error.response.data,
                            type: 'error',
                            duration: 5 * 1000
                        })
                   
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
        axios.put(url,params)
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
                console.log(res,'删除方法')
                resolve(res);
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    });
}