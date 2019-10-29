
let languageList={ "zh-CN":"中文", "en-US": "英文", "ja-JP": "日文", "es-ES": "西班牙语", "ko-KR": "韩语" };
export const getLanguage = (language) =>{
    for (var x in languageList) {
        if (language == x) {
            return languageList[x];
        }
    }
}