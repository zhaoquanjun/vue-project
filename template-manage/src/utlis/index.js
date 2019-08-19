let languageList={ "zh-CN":"简体中文", "en-US": "English", "ja-JP": "日本语", "es-ES": "Español", "ko-KR": "한국어" };
export const getLanguage = (language) =>{
    for (var x in languageList) {
        if (language == x) {
            return languageList[x];
        }
    }
}

/**
 * 时间格式化
 */
export const formatDateTime = (date, fmt) => {
    if (!date) {
        return "";
    }
    if (typeof date === 'string') {
        date = new Date(date);
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        let str = o[k] + '';
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length);   
}