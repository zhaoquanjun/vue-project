import Cookies from "js-cookie";

let domain;
if (process.env.NODE_ENV === 'development') {
    domain = ""
}else{
    domain = { domain: '.wezhan.cn' }
}


export const setLocal = (key,value)=>{
    console.log(value)
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