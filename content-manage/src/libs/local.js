import Cookies from "js-cookie";

export const setLocal = (key,value)=>{
    if(typeof value == 'object'){
        value = JSON.stringify(value);
    }
    //{ domain: '.wezhan.cn' })
    Cookies.set(key,value);
}
export const getLocal = (key)=>{
    return Cookies.get(key);
}

export const removeLocal = (key)=>{
    return Cookies.remove(key);
}
