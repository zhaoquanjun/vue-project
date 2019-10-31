import Cookies from "js-cookie";
const baseServerUrl = window.location.hostname.indexOf('clouddream.net') == -1 ? 'wezhan.cn':'clouddream.net';
let domain;
if (process.env.NODE_ENV === 'development') {
    domain = ""
}else{
    domain = { domain: baseServerUrl }
}


export const setCookie = (key,value)=>{
    if(typeof value == 'object'){
        value = JSON.stringify(value);
    }
   
   
    Cookies.set(key,value,domain);
}
export const getCookie = (key)=>{
    return Cookies.get(key,domain);
}

export const removeCookie = (key)=>{
    return Cookies.remove(key,domain);
}
//清除所有cookie函数
export  const clearAllCookie = ()=> {
    
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;){
            removeCookie(keys[i])
        }
    }
}