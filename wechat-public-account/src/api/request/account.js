import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

/**
 * 
 * @param {*} params Object {appId, 授权方 - （微信公众号/服务号/订阅号）/小程序/支付宝小程序（微信公众号/服务号/订阅号）}
 */
export const isAuth = param => {
  return ajaxRequest.get(`${environment.wechataccountApi}/api/v1/Platform/SelectPlatformDetailAuth`);
}

export const wxAuth = () => {
  return ajaxRequest.get(`${environment.wechataccountApi}/api/v1/OAuth/getweixinauthurl`);
}
