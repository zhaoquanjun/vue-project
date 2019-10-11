// import Cookies from "js-cookie";

// let domain;
// if (process.env.NODE_ENV === 'development') {
//     domain = ""
// }else{
//     domain = { domain: '.wezhan.cn' }
// }


// export const setLocal = (key,value)=>{
//     if(typeof value == 'object'){
//         value = JSON.stringify(value);
//     }
   
   
//     Cookies.set(key,value,domain);
// }
// export const getLocal = (key)=>{
//     return Cookies.get(key,domain);
// }

// export const removeLocal = (key)=>{
//     return Cookies.remove(key,domain);
// }
// //清除所有cookie函数
// export  const clearAllCookie = ()=> {
    
//     var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
//     if(keys) {
//         for(var i = keys.length; i--;){
//             removeLocal(keys[i])
//         }
//     }
// }
var ls = window.localStorage;

export const setLocal = (key, value, time)=>{
    if (value === 'undefined') {return};
    var data = {
       // time: time ? Date.now() + time : 0,
        value: value
    }
   
    if(typeof data == 'object'){
        data = JSON.stringify(data);
    }
    ls.setItem(key,data);
}
export const getLocal = (key)=>{

    var data = ls.getItem(key);
   
    data = JSON.parse(data) || {};
    
    if (data.time === 0) {
        return data.value;
    } else if (Date.now() > data.time) {
        ls.removeItem(key);
        return '';
    } else {
        return typeof data.value !== "undefined" ? data.value : '';
    }
   
}

export const removeLocal = (key) =>{
    return ls.removeItem(key);
}

export const clearAllLocal = ()=> {
    return ls.clear()
}



