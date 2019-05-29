import ajaxRequest from "./ajaxRequest"
import jsonp from "jsonp";
export const GetCaptcha = ()=>{

    return ajaxRequest.request({
        url:'/Verification/GetCaptcha',
        method:'get'
    });
};

export const login = ()=>{
    return ajaxRequest.request({
        url:'/login',
        method:'get'
    });
};
export const getAuth = () => {
    return ajaxRequest.request({
        url:'/api/test/TestIsLogin',
        method:'get'
    });
}