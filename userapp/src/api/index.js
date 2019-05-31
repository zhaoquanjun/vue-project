import ajaxRequest from "./ajaxRequest"
/**
 *  InterfaceAuthor : 福全
 * 获取个人信息含权限
 */
export const getUserInfo = () => {
    return ajaxRequest.request({
        params: {
            userId: "e90bced5-c809-4926-8198-b7dd967b5bd1",
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
        },
        url: 'http://192.168.199.245:5000/api/userInfo/GetUserInfo',
        method: 'get'
    });
}
/**
 * InterfaceAuthor : 福全
 * 获取当前用户应用可配置的权限
 */
export const getAppPolicies = () => {
    return ajaxRequest.request({
        params: {
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
        },
        url: 'http://192.168.199.245:5000/api/appInfo/GetAppPolicies',
        method: 'get'
    });
}
/**
 * InterfaceAuthor : 徐专
 * 获取当前用户下的成员列表
 */
export const getBeInvitedUsers = () => {
    return ajaxRequest.request({
        params:{
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
        },
        url: '/api/userInfo/GetBeInvitedUsers',
        method: 'get'
    });
}
/**
 * InterfaceAuthor : 恒东
 * 获取权限所有权限
 */
export const getUserCurrentAppPolicy = () => {
    return ajaxRequest.request({
        params: {
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
        },
        url: 'http://192.168.199.103:9100/api/appInfo/GetUserCurrentAppPolicy',
        method: 'get'
    });
}

