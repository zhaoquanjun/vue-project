import ajaxRequest from "../ajaxRequest";
import axios from "axios"
//import QS from "qs"
/**
 * 谢奥
 */
export const testLogin = () => {
    return ajaxRequest.request({
        url: 'http://192.168.199.99:8200/api/test/TestIsLogin',
        method: 'get'
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
        url: '/api/userInfo/GetUserPolicy',
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
export const updateUserPolicy = (names) => {
    let  params =  {
        userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
        policyNames: names
    };
    axios.post("http://192.168.199.99:8100/api/userInfo/UpdateUserPolicy",params)
    // return ajaxRequest.request({
    //     params: {
    //         userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
    //         appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
    //         policyNames: JSON.stringify(names)
    //     },
    //     url: '/api/userInfo/UpdateUserPolicy',
    //     method: 'post'
    // });
};


/**
 * 批量更新所选择成员的权限
 * @param {权限id集合} idList 
 */
export const batchUpdateUserPolicy = (options) => {
    let  params =  {
        userIds: options.userids,
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
        policyNames: options.names
    };
    axios.post("http://192.168.199.99:8100/api/userInfo/BatchUpdateUserPolicy",params)

    // return ajaxRequest.request({
    //     params: {
    //         userIds: JSON.stringify(options.userids),
    //         appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
    //         policyNames: JSON.stringify(options.names)
    //     },
    //     url: '/api/userInfo/BatchUpdateUserPolicy',
    //     method: 'post'
    // });
};


/**
 * 删除当前成员列表中其中一个
 * @param {列表id} curId 
 */
export const deleteCurMember = (curId) => {
    return ajaxRequest.request({
        params: {
            id: 10000,
        },
        url: '/api/userInfo/DeleteUserPolicyAppMap',
        method: 'post'
    });
}
/**
 * 批量删除成员列表
 * @param {id集合} ids 
 */
export const batchDeletMember = (ids) => {
    let params ={
        sourceUserId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        targetUserIds: [
          "823EB3BD-93F4-4655-B833-D604A6EF1171","823EB3BD-93F4-4655-B833-D604A6EF2132"
        ],
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
      }

    //   
    axios.delete("http://192.168.199.99:8100/api/userInfo/BatchDeleteUserPolicyAppMap",{data:params})

    // return ajaxRequest.request({
    //     params: {
    //         ids: JSON.stringify([10000,10037]),
    //     },
    //     url: '/api/userInfo/BatchDeleteUserPolicyAppMap',
    //     method: 'post'
    // });
}
/**
 * InterfaceAuthor : 徐专
 * 获取当前用户下的成员列表
 */
export const getBeInvitedUsers = (options = { page: 1, phone: "" }) => {
    return ajaxRequest.request({
        params: {
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
           
            pageIndex: options.page,
            pageSize: 3,
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
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
            permissionIds: names
        },
        url: '/api/ShortUrl/GetShortUrlByInviation',
        method: 'get'
    });
}

import ajaxRequest from "./ajaxRequest";
import axios from "axios"
//import QS from "qs"

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
        url: '/api/userInfo/GetUserPolicy',
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
export const updateUserPolicy = (names) => {
    let  params =  {
        userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
        policyNames: names
    };
    axios.post("http://192.168.199.99:8100/api/userInfo/UpdateUserPolicy",params)
    // return ajaxRequest.request({
    //     params: {
    //         userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
    //         appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
    //         policyNames: JSON.stringify(names)
    //     },
    //     url: '/api/userInfo/UpdateUserPolicy',
    //     method: 'post'
    // });
};


/**
 * 批量更新所选择成员的权限
 * @param {权限id集合} idList 
 */
export const batchUpdateUserPolicy = (options) => {
    let  params =  {
        userIds: options.userids,
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
        policyNames: options.names
    };
    axios.post("http://192.168.199.99:8100/api/userInfo/BatchUpdateUserPolicy",params)

    // return ajaxRequest.request({
    //     params: {
    //         userIds: JSON.stringify(options.userids),
    //         appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
    //         policyNames: JSON.stringify(options.names)
    //     },
    //     url: '/api/userInfo/BatchUpdateUserPolicy',
    //     method: 'post'
    // });
};


/**
 * 删除当前成员列表中其中一个
 * @param {列表id} curId 
 */
export const deleteCurMember = (curId) => {
    return ajaxRequest.request({
        params: {
            id: 10000,
        },
        url: '/api/userInfo/DeleteUserPolicyAppMap',
        method: 'post'
    });
}
/**
 * 批量删除成员列表
 * @param {id集合} ids 
 */
export const batchDeletMember = (ids) => {
    let params ={
        sourceUserId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        targetUserIds: [
          "823EB3BD-93F4-4655-B833-D604A6EF1171","823EB3BD-93F4-4655-B833-D604A6EF2132"
        ],
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
      }

    //   
     axios.delete("http://192.168.199.99:8100/api/userInfo/BatchDeleteUserPolicyAppMap",{data:params})

    // return ajaxRequest.request({
    //     data:{
    //         params
    //     },
       
    //     url: '/api/userInfo/BatchDeleteUserPolicyAppMap',
    //     method: 'delete'
    // });
}
/**
 * InterfaceAuthor : 徐专
 * 获取当前用户下的成员列表
 */
export const getBeInvitedUsers = (options = { page: 1, phone: "" }) => {
    return ajaxRequest.request({
        params: {
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
            appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
           
            pageIndex: options.page,
            pageSize: 3,
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
            userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
            permissionIds: names
        },
        url: '/api/ShortUrl/GetShortUrlByInviation',
        method: 'get'
    });
}

