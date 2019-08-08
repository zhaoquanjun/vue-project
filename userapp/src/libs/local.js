
import Cookies from "js-cookie";
export const setLocal = (key,value)=>{
    if(typeof value == 'object'){
        value = JSON.stringify(value);
    }
    Cookies(key,value);
};
export const getLocal = (key)=>{
    return Cookies(key);
};
export const removeLocal = (key)=>{
    return Cookies.remove(key);
};


