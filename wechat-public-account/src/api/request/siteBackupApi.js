import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js";


/**
 * 获取站点信息
 */
export const getSiteInfo = siteId => {
  return ajaxRequest.get(
      `${enbironmemy.pageApi}/api/SiteInfo/GetSiteInfo`,
    { siteId: siteId }
  );
};
