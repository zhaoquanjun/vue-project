import * as ajaxRequest from "./ajaxRequest";
import environment from "@/environment/index.js"
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
 * InterfaceAuthor : 徐专
 * CreateTime:2019.09.02
 * 获取当前用户应用可配置的权限包括他已有权限
 */
export const getEditUserAppPolicies = (userId) => {
    let para = { editUserId: userId };
    return ajaxRequest.get('/api/appInfo/GetEditUserAppPolicies', para);
}
/**
 * 更新当前成员权限
 * @param {*} ids 
 */
export const updateUserPolicy = (options) => {
    let params = {
        userId: options.userId,
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
export const getBeInvitedUsers = (options = { page: 1, phone: "",size:10 }) => {
    let params = {
        pageIndex: options.page,
        phone:options.phone,
        pageSize: options.size,
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
 
    let params = {
        targetUserId: targetUserId,
        remark: remark
    };
    return ajaxRequest.put(`/api/userInfo/UpdateUserRemark/${targetUserId}/${remark}`, );

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
export const sendSourcePhoneCode = () => {
    return ajaxRequest.put('/api/phone/SendSourcePhoneCode');
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
export const isInvalidCode = (code) => {
    let params = {
        code: code
    }
    return ajaxRequest.put(`/api/phone/IsInvalidCode/${code}`, params);
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
    return ajaxRequest.get('api/userInfo/GetUserDashboard');
}

/**
 * @name 获取左侧菜单列表信息
 * @method GET
 */
export const getSliderMenuList = () => {
    return ajaxRequest.get('/api/appinfo/GetAppMenusByUserId')
}


/**
 * InterfaceAuthor : litao
 * 获取用户的第三方绑定信息
 */
export const getExternalUserInfo = () => {
    return ajaxRequest.get('/api/userInfo/GetUserLoginProviders');
}

/**
 * InterfaceAuthor : litao
 * 解除第三方登陆
 */
export const removeExternalUser = (provider) => {
    let params = {
        provider: provider
    }
    return ajaxRequest._delete(`/api/userInfo/RemoveLoginProvider/${provider}`, params);
}

/**
 * InterfaceAuthor : litao
 * 获取微信JsLogin参数
 */
export const getWeChatJsLoginParams = (provider) => {
    return ajaxRequest.get('/api/userInfo/GetWeChatJsLoginParams');
}
/**
 * InterfaceAuthor : xuzhuan
 * 更新cookie中的appid
 */
export const updateAppIdAndSiteIdToCookie = () => {
    return ajaxRequest.get(`${environment.memberManageApi}/api/userInfo/GetAppIdAndUpdateToCookie`);
}

/**
 * InterfaceAuthor : xuzhuan
 * 更新用户当前使用的appid
 */
export const updateUserLastAppIdAndCookie = (appId) => {
    return ajaxRequest.post(`/api/userInfo/UpdateUserLastAppIdAndCookie/${appId}`);
}
//更新头像
export const updateUserPicture = (pictureUrl) => {
    let params ={
        pictureUrl:pictureUrl
    }
    return ajaxRequest.put(`/api/userInfo/UpdateUserPicture`,JSON.stringify(pictureUrl));
}
//设置密码
export const updateUserPwd = (options) => {
    return ajaxRequest.put(`/api/userInfo/UpdateUserPwd`,options);
}


/**
 * InterfaceAuthor : xuzhuan
 * 时间格式化
 */
export const formatDateTime = (date, fmt) => {
    if (!date) {
        return "";
    }
    if (typeof date === 'string') {
        date = new Date(date);
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        let str = o[k] + '';
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length);   
}


/**
 * InterfaceAuthor : litao
 * 生成绑定支付宝Url
 */
export const getAlipayBindUrl = () => {
    return ajaxRequest.get('/api/userInfo/getAlipayBindUrl');
}
