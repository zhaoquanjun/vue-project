import ajaxRequest from "./ajaxRequest";
import axios from "axios"
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
        url: '/api/userInfo/GetUserInfo',
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
        url: '/api/appInfo/GetAppPolicies',
        method: 'get'
    });
}
/**
 * 更新当前成员权限
 * @param {*} ids 
 */
export const updateUserPolicy = (ids) => {
    return ajaxRequest.request({
        params: {
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
            policies:JSON.stringify(['面板读','面板写','容器读','容器写'])
        },
        url: '/api/userInfo/UpdateUserPolicy',
        method: 'post'
    });
};


/**
 * 批量更新所选择成员的权限
 * @param {权限id集合} idList 
 */
export const batchUpdateUserPolicy = (idList) => {
    // let params=  {
    //     userId: "[823EB3BD-93F4-4655-B833-D604A6EF2032]",
    //     appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
    //     policyNames:'[面板读,面板写,容器读,容器写]'
    // };
    // axios.post("http://192.168.199.99:8100/api/userInfo/BatchUpdateUserPolicy",params)
    return ajaxRequest.request({
        params: {
            userId: "['823EB3BD-93F4-4655-B833-D604A6EF2032']",
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
            policyNames:JSON.stringify(['面板读','面板写','容器读','容器写'])
        },
        url: '/api/userInfo/BatchUpdateUserPolicy',
        method: 'post'
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
        method: 'post'
    });
}
/**
 * 批量删除成员列表
 * @param {id集合} ids 
 */
export const batchDeleteUsers = (ids) => {
    return ajaxRequest.request({
        params: {
            id: ids, 
        },
        url: '/api/userInfo/BatchDeleteUsers',
        method: 'post'
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
            phone:'',
            pageIndex:0,
            pageSize:3,
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
        url: '/api/appInfo/GetUserCurrentAppPolicy',
        method: 'get'
    });
}


/**
 * InterfaceAuthor : li tao
 * 获取权限所有权限
 */
export const getShortUrlByInviation = (names) => {
    return ajaxRequest.request({
        params: {
            appId: "123EB3BD-93F4-4655-B833-D604A6EF2022",
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032 &" + Math.random(),   
              
            permissionIds:"内容读,内容写"
        },
        url: '/api/ShortUrl/GetShortUrlByInviation',
        method: 'get'
    });
}

