
let languageList={ "zh-CN":"简体中文", "en-US": "English", "ja-JP": "日本语", "es-ES": "Español", "ko-KR": "한국어" };
export const getLanguage = (language) =>{
    for (var x in languageList) {
        if (language == x) {
            return languageList[x];
        }
    }
}