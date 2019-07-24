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
 * 获取备份信息
 */
export const getBackupSite = (id, isSystemBackup) => {
  return ajaxRequest.get(
    `${enbironmemy.siteManageApi}/api/v1/Backup/GetBackupSites`,
    { siteId: id, isSystemBackup: isSystemBackup, pageIndex: 1, pageSize: 20 }
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
  let params={id: id, fileName: fileName, siteId: siteId}
  return ajaxRequest._delete(
    `${enbironmemy.siteManageApi}/api/v1/Backup/DeleteBackup`,
    { data:params }
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
    `${enbironmemy.memberManageApi}/api/SiteInfo/GetSiteInfo`,
    { siteId: siteId }
  );
};