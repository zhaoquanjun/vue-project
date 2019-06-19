import * as ajaxRequest from "./ajaxRequest";

/**
 *  InterfaceAuthor : 福全
 * 获取个人信息含权限
 */
export const getUserPolicy = () => {
    let params = {
        userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
    };
    return ajaxRequest.get('/api/userInfo/GetUserPolicy', params);
}
/**
 * InterfaceAuthor : 福全
 * 获取当前用户应用可配置的权限
 */
export const getAppPolicies = () => {
    let params = {
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
    };
    return ajaxRequest.get('/api/appInfo/GetAppPolicies', params);
}
/**
 * 更新当前成员权限
 * @param {*} ids 
 */
export const updateUserPolicy = (options) => {
    let params = {
        userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
        remark: options.remark,
        policyNames: options.names
    };
    return ajaxRequest.put('/api/userInfo/UpdateUserPolicy', params);

};


/**
 * 批量更新所选择成员的权限
 * @param {权限id集合} idList 
 */
export const batchUpdateUserPolicy = (options) => {
    let params = {
        userIds: options.userids,
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
        policyNames: options.names
    };
    return ajaxRequest.post("/api/userInfo/BatchUpdateUserPolicy", params)

};


/**
 * 删除当前成员列表中其中一个
 * @param {列表id} curId 
 */
// export const deleteCurMember = (curId) => {
//     let params = {
//         id: 10000,
//     };
//     return ajaxRequest._delete("/api/userInfo/DeleteUserPolicyAppMap", {data:params})
// }
/**
 * 批量删除成员列表
 * @param {id集合} ids 
 */
export const batchDeletMember = (options) => {
    let params = options;
    return ajaxRequest._delete("/api/userInfo/BatchDeleteUserPolicyAppMap", {data:params})
}
/**
 * InterfaceAuthor : 徐专
 * 获取当前用户下的成员列表
 */
export const getBeInvitedUsers = (options = { page: 1, phone: "" }) => {
    let params = {
        userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        appId: "823EB3BD-93F4-4655-B833-D604A6EF2022",
        pageIndex: options.page,
        phone:options.phone,
        pageSize: 3,
    };
    return ajaxRequest.get('/api/userInfo/GetBeInvitedUsers', params);
}
/**
 * 修改备注
 */

/**
 * InterfaceAuthor : 恒东
 * 获取权限所有权限
 */
// export const getUserCurrentAppPolicy = () => {
//     return ajaxRequest.request({
//         params: {
//             appId: "823EB3BD-93F4-4655-B833-D604A6EF2022"
//         },
//         url: '/api/appInfo/GetUserCurrentAppPolicy',
//         method: 'get'
//     });
// }

/**
 * 更新备注
 * @param {*} names 
 */

export const updateUserRemark = (options) => {
    console.log(options)
    let params = {
        targetUserId: options.targetUserId,
        remark: options.remarkValue
    };
    return ajaxRequest.put('/api/userInfo/UpdateUserRemark', params);

}

/**
 * InterfaceAuthor : li tao
 * 获取权限所有权限
 */
export const getShortUrlByInviation = (names) => {
    let params = {
        appId: "123EB3BD-93F4-4655-B833-D604A6EF2022",
        userId: "823EB3BD-93F4-4655-B833-D604A6EF2032",
        permissionIds: names
    }
    return ajaxRequest.get('/api/ShortUrl/GetShortUrlByInviation', params);
}


