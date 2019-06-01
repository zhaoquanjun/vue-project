import ajaxRequest from "./ajaxRequest";

/**
 * 谢奥
 */
export const testLogin = () => {
    return ajaxRequest.request({
        url:'http://192.168.199.99:8200/api/test/TestIsLogin',
        method:'get'
    });
}
/**
 *  InterfaceAuthor : 福全
 * 获取个人信息含权限
 */
export const getUserInfo = () => {
    return ajaxRequest.request({
        params: {
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
        },
        url: 'http://192.168.199.99:8100/api/userInfo/GetUserInfo',
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
        url: 'api/appInfo/GetAppPolicies',
        method: 'get'
    });
}
/**
 * 更新当前成员权限
 * @param {*} arrId 
 */
export const updateUserPolicy = (arrId) => {
    console.log(arrId,'23456765445')
    return ajaxRequest.request({
        params: {
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
            policies:JSON.stringify(arrId)
        },
        url: '/api/userInfo/UpdateUserPolicy',
        method: 'get'
    });
};
/**
 * 批量更新所选择成员的权限
 * @param {权限id集合} arrId 
 */
export const batchUpdateUserPolicy = (arrId) => {
    console.log(arrId,'23456765445')
    return ajaxRequest.request({
        params: {
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
            policyIds:JSON.stringify(arrId)
        },
        url: '/api/userInfo/BatchUpdateUserPolicy',
        method: 'get'
    });
};

/**
 * 删除当前成员列表中其中一个
 * @param {列表id} curId 
 */
export const deleteCurMember = (curId) => {
    return ajaxRequest.request({
        params: {
            id: curId, 
        },
        url: '/api/userInfo/DeleteUser',
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
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
            phone:''
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

