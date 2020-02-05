import {designerManageApi} from "@/environment/index"
import * as ajaxRequest from "../ajaxRequest";
import store from "@/store/index";
import Cookies from "js-cookie"
console.log(store)
//  当前站点 siteId   const siteId = store.state.dashoboard.siteId

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
    const siteId =store.state.dashboard.siteId?store.state.dashboard.siteId:Cookies("ymSd");
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
    const siteId =store.state.dashboard.siteId?store.state.dashboard.siteId:Cookies("ymSd");
    return ajaxRequest._delete(`${designerManageApi}/api/v1/DomainManage/RemoveAliYunToken/${siteId}`);
}
/**
 * 禁用https
 */
export const disableHttps = (siteDomainId) => {
    const siteId =store.state.dashboard.siteId?store.state.dashboard.siteId:Cookies("ymSd");
    return ajaxRequest._delete(`${designerManageApi}/api/v1/DomainManage/DisableHttps/${siteId}/${siteDomainId}`);
}
/**
 *  删除绑定域名
 */
export const deleteCdnDomain = (siteDomainId,forceDelete) => {
    const siteId =store.state.dashboard.siteId?store.state.dashboard.siteId:Cookies("ymSd");
    return ajaxRequest._delete(`${designerManageApi}/api/v1/DomainManage/DeleteCdnDomain/${siteId}/${siteDomainId}/${forceDelete}`);
}


// 轮询阿里云是否授权成功
export const isAliYunTokenSet = () => {
    const siteId =store.state.dashboard.siteId?store.state.dashboard.siteId:Cookies("ymSd");
    return ajaxRequest.get(`${designerManageApi}/api/v1/DomainManage/IsAliYunTokenSet/${siteId}`);
}



export const publishdata = () => {
    const siteId =store.state.dashboard.siteId?store.state.dashboard.siteId:Cookies("ymSd");
    return ajaxRequest.post(`${designerManageApi}/api/v1/Designer/publishdata?siteId=${siteId}`);
} 

