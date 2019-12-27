/**
 * 验证是否是手机号
 * @param {*} tel 
 */
export const validateTel = (tel) => {
    // /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/
    var TEL_REGEXP = /^1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/
    if (TEL_REGEXP.test(tel)) {
        return true;
    }
    return false;
}
//邮箱验证
export const sendEmail = (email) => {
    var regEmail = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
    if (regEmail.test(this.email)) {
        return true;
    }
}
//去左右空格;
export function trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}