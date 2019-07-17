

export const setLocal = (key,value)=>{
    if(typeof value == 'object'){
        value = JSON.stringify(value);
    }
    sessionStorage.setItem(key,value);
}


export const getLocal = (key)=>{
    return sessionStorage.getItem(key);
}

export const removeLocal = (key)=>{
    return sessionStorage.removeItem(key);
}
