import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js";

/**
 * 备份站点
 */
export const backupSite = (siteName, siteId, description) => {
  return ajaxRequest.post(
    `${enbironmemy.siteManageApi}/api/v1/Backup/BackupSite`,
    { siteName: siteName, siteId: siteId, description: description }
  );
};
/**
 * 还原站点
 */
export const recoverySite = (siteId, siteName, fileName) => {
  return ajaxRequest.post(
    `${enbironmemy.siteManageApi}/api/v1/Backup/RecoverySite`,
    { siteId: siteId, siteName: siteName, fileName: fileName }
  );
};

/**
 * 获取站点还原状态信息
 */
export const getRecoverySiteStatus = (siteId) => {
  return ajaxRequest.get(
    `${enbironmemy.siteManageApi}/api/v1/backup/GetRecoverySiteStatus`,
    { siteId: siteId }
  );
};

/**
 * 获取备份信息
 */
export const getBackupSite = (id, isSystemBackup) => {   
  return ajaxRequest.get(
    `${enbironmemy.siteManageApi}/api/v1/Backup/GetBackupSites`,
      { siteId: id, isSystemBackup: isSystemBackup, pageIndex: 1, pageSize: 20}
  );
};
/**
 * 修改备注
 */
export const updateDescription = (id, remark) => {
  return ajaxRequest.put(
    `${enbironmemy.siteManageApi}/api/v1/Backup/UpdateDescription`,
    { id: id, description: remark }
  );
};
/**
 * 下载备份包
 */
export const exportBackup = (siteName, siteId, fileName) => {
  return ajaxRequest.get(
    `${enbironmemy.siteManageApi}/api/v1/Backup/ExportBackup`,
    { siteName: siteName, siteId: siteId, backupName: fileName }
  );
};
/**
 * 删除备份
 */
export const deleteBackup = (id, fileName, siteId) => {
  let params = { id: id, fileName: fileName, siteId: siteId }
  return ajaxRequest._delete(
    `${enbironmemy.siteManageApi}/api/v1/Backup/DeleteBackup`,
    { data: params }
  );
};
/**
 * 获取备份状态
 */
export const getBackupCount = (siteId) => {
  return ajaxRequest.get(
    `${enbironmemy.siteManageApi}/api/v1/Backup/GetBackupCount`,
    { siteId: siteId }
  );
};
/**
 * 获取站点信息
 */
export const getSiteInfo = siteId => {
  return ajaxRequest.get(
      `${enbironmemy.designerManageApi}/api/v1/SiteInfo/GetSiteInfo`,
    { siteId: siteId }
  );
};
/**
 * 获取站点信息
 */
export const getSiteInfoBySite = siteId => {
  return ajaxRequest.get(
      `${enbironmemy.designerManageApi}/api/v1/SiteInfo/GetSiteInfoBySiteId`,
    { siteId: siteId }
  );
};
/**
 * 网站icon
 */
export const updateSiteIcon = option => {
  return ajaxRequest.put(`${enbironmemy.designerManageApi}/api/v1/siteInfo/UpdateSiteIcon`,option);
};
/**
 *禁止右键保存图片
 */
export const updateSitePoweredBy = option => {
  return ajaxRequest.put(`${enbironmemy.designerManageApi}/api/v1/siteInfo/UpdateSitePoweredBy`,option);
};
/**
 *禁止右键保存图片
 */
export const updateSiteRightCopy = option => {
  return ajaxRequest.put(`${enbironmemy.designerManageApi}/api/v1/siteInfo/UpdateSiteRightCopy`,option);
};
/**
 * 显示阿里云服务信息
 */
export const updateSiteServiceInfo = option => {
  return ajaxRequest.put(`${enbironmemy.designerManageApi}/api/v1/siteInfo/UpdateSiteServiceInfo`,option);
};
