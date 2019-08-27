import Cookies from "js-cookie";

let domain;
if (process.env.NODE_ENV === 'development') {
    domain = ""
}else{
    domain = { domain: '.wezhan.cn' }
}


export const setLocal = (key,value)=>{
    if(typeof value == 'object'){
        value = JSON.stringify(value);
    }
   
   
    Cookies.set(key,value,domain);
}
export const getLocal = (key)=>{
    return Cookies.get(key,domain);
}

export const removeLocal = (key)=>{
    return Cookies.remove(key,domain);
}
//清除所有cookie函数
export  const clearAllCookie = ()=> {
    
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;){
            removeLocal(keys[i])
        }
    }
}

