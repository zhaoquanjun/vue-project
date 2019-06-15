import * as ajaxRequest from "../ajaxRequest";

/**
 * 获取用户信息
 */
export const getUserProfileAsync = () => {
    let params = {
        userid: "823EB3BD-93F4-4655-B833-D604A6EF1171",     

    };
    return ajaxRequest.get('/api/userInfo/GetUserProfileAsync', params);
}
/**
 * 更新用户头像
 */
export const updateUserPicture = () => {
    let params = {
        userId: "823EB3BD-93F4-4655-B833-D604A6EF1171",   
        picUrl:"url"  

    };
    return ajaxRequest.get('/api/userInfo/UpdateUserPicture', params);
}
/**
 * 更新用户手机
 */
export const updateUserPhone = () => {
    let params = {
        userId: "823EB3BD-93F4-4655-B833-D604A6EF1171",   
        picUrl:"url"  

    };
    return ajaxRequest.get('/api/userInfo/UpdateUserPhone', params);
}