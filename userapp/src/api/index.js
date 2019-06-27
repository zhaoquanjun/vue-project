import * as ajaxRequest from "./ajaxRequest";
/**
 *  InterfaceAuthor : 福全
 * 获取个人信息含权限
 */
export const getUserPolicy = (userId) => {
    console.log(userId, '获取用户的policy');
    let params = {
        userId: userId
    };
    console.log(userId,'获取用户的policy');
    return ajaxRequest.get('/api/userInfo/GetUserPolicy', params);
}
/**
 * InterfaceAuthor : 福全
 * 获取当前用户应用可配置的权限
 */
export const getAppPolicies = () => {
    return ajaxRequest.get('/api/appInfo/GetAppPolicies');
}
/**
 * 更新当前成员权限
 * @param {*} ids 
 */
export const updateUserPolicy = (options) => {
    let params = {
        userId: options.userId,
        appId: options.appId,
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
        appId: '',
        policyNames: options.names
    };
    return ajaxRequest.put("/api/userInfo/BatchUpdateUserPolicy", params)

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

export const updateUserRemark = (targetUserId, remark) => {
    console.log(targetUserId, remark);
    let params = {
        targetUserId: targetUserId,
        remark: remark
    };
    return ajaxRequest.put(`/api/userInfo/UpdateUserRemark/${targetUserId}/${remark}`, params);

}

/**
 * InterfaceAuthor : li tao
 * 邀请生成短链接
 */
export const getShortUrlByInviation = (names) => {
    let params = {
        permissionIds: names
    }
    return ajaxRequest.post('/api/ShortUrl/GetShortUrlByInviation',  params );
}

/**
 * InterfaceAuthor : xuzhuan
 * 修改用户名称
 */
export const updateUserName = (userName) => {
    
    return ajaxRequest.put('/api/userInfo/UpdateUserName', JSON.stringify(userName));
}
/**
 * InterfaceAuthor : xuzhuan
 * 验证用户已绑定的号码
 */
export const sendSourcePhoneCode = (phone) => {
    return ajaxRequest.put('/api/phone/SendSourcePhoneCode', JSON.stringify(phone));
}
/**
 * InterfaceAuthor : xuzhuan
 * 验证用户要更改绑定的新的号码
 */
export const sendTargetPhoneCode = (oldPhone, newPhone) => {
    let params = {
        oldPhone: oldPhone,
        newPhone: newPhone
    }
    return ajaxRequest.put(`/api/phone/SendTargetPhoneCode/${oldPhone}/${newPhone}`, params);
}
/**
 * InterfaceAuthor : xuzhuan
 * 验证用户的（原绑定的手机的）验证码是否正确
 */
export const isInvalidCode = (phone, code) => {
    let params = {
        phone: phone,
        code: code
    }
    return ajaxRequest.put(`/api/phone/IsInvalidCode/${phone}/${code}`, params);
}
/**
 * InterfaceAuthor : xuzhuan
 * 获取用户的账户信息
 */
export const getUserProfile = () => {
    return ajaxRequest.get('/api/userInfo/GetUserProfile');
}

/**
 * InterfaceAuthor : xuzhuan
 * 修改用户绑定的手机号码
 */
export const updateUserPhone = (phone,code) => {
    let params = {
        phone: phone,
        code: code
    }
    return ajaxRequest.put(`api/userInfo/UpdateUserPhone/${phone}/${code}`, params);
}
/**
 * InterfaceAuthor : xuzhuan
 * 获取dashbord
 */
export const getUserDashboard = () => {  
  
    let params = {
        appId: ''
    }
    return ajaxRequest.get('api/userInfo/GetUserDashboard', params);
}

/**
 * @name 获取左侧菜单列表信息
 * @method GET
 */
export const getSliderMenuList = () => {
    return ajaxRequest.get('/api/appinfo/GetAppMenusByUserId')
}

/**
 * @name 跳转权限
 * @method GET
 */
export const checkHasRootSkip = url => {
    return ajaxRequest.get('/api/menu/ValidateMenu', url)
}

/**
 * InterfaceAuthor : litao
 * 获取用户的第三方绑定信息
 */
export const getExternalUserInfo = () => {
    return ajaxRequest.get('/api/userInfo/GetExternalUserInfo');
}

/**
 * InterfaceAuthor : litao
 * 解除第三方登陆
 */
export const removeExternalUser = (provider) => {
    let params = {
        provider: provider
    }
    return ajaxRequest._delete(`/api/userInfo/RemoveExternalUser/${provider}`, params);
}

/**
 * InterfaceAuthor : litao
 * 获取微信JsLogin参数
 */
export const getWeChatJsLoginParams = (provider) => {
    return ajaxRequest.get('/api/userInfo/GetWeChatJsLoginParams');
}

export const updateAppIdToCookie = (provider) => {
    return ajaxRequest.put('/api/userInfo/UpdateAppIdToCookie');
}

//put: UpdateUserLastAppIdAndCookie(string appId)