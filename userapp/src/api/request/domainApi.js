import {designerManageApi} from "@/environment/index"
import * as ajaxRequest from "../ajaxRequest";
 import store from "@/store/index";
import Cookies from "js-cookie"
//  当前站点 siteId   const siteId = store.state.dashoboard.siteId

const siteId =Cookies("siteId")?Cookies("siteId"):store.state.dashboard.siteId

/**
 * 获取域名列表
 */
export const getCdnDomainList = (siteId) => {
  
    return ajaxRequest.get(`${designerManageApi}/api/v1/DomainManage/GetCdnDomainList/${siteId}`);
}

/**
 * 绑定域名并授权cdn
 */
export const bindDomainAndEnableCdn = (domain) => {

    return ajaxRequest.post(`${designerManageApi}/api/v1/DomainManage/BindDomainAndEnableCdn/${siteId}`, domain);
}

/**
 * 一键授权https
 */
export const oneKeyEnableHttps = (siteDomainId) => {
    return ajaxRequest.post(`${designerManageApi}/api/v1/DomainManage/OneKeyEnableHttps/${siteDomainId}`);
}

/**
 *  解析阿里云的cdn token
 */
export const resolveCdnByAliYunToken = (params) => {
    let option = {
        "id":0,
        "siteId": 0,
        "isForceUpdate": true
    }
    return ajaxRequest.put(`${designerManageApi}/api/v1/DomainManage/ResolveCdnByAliYunToken/`, params);
}


/**
 * 暂停CDN加速
 */
export const pauseCdn = (siteDomainId) => {
    return ajaxRequest.put(`${designerManageApi}/api/v1/DomainManage/PauseCdn/${siteDomainId}`);
}
/**
 * 打开CDN加速
 */
export const reopenCdn = (siteDomainId) => {
    return ajaxRequest.put(`${designerManageApi}/api/v1/DomainManage/ReopenCdn/${siteDomainId}`);
}

/**
 * 删除阿里云token
 */
export const removeAliYunToken = () => {
    return ajaxRequest._delete(`${designerManageApi}/api/v1/DomainManage/RemoveAliYunToken/${siteId}`);
}
/**
 * 禁用https
 */
export const disableHttps = (siteDomainId) => {
    return ajaxRequest._delete(`${designerManageApi}/api/v1/DomainManage/DisableHttps/${siteId}/${siteDomainId}`);
}
/**
 *  删除绑定域名
 */
export const deleteCdnDomain = (siteDomainId) => {
    return ajaxRequest._delete(`${designerManageApi}/api/v1/DomainManage/DeleteCdnDomain/${siteId}/${siteDomainId}`);
}


// 轮询阿里云是否授权成功
export const isAliYunTokenSet = () => {
    return ajaxRequest.get(`${designerManageApi}/api/v1/DomainManage/IsAliYunTokenSet/${siteId}`);
}