import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js";


export const backupSite = (siteName, siteId, description) => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/v1/Backup/BackupSite`, {siteName: siteName, siteId: siteId, description: description});
}
export const recoverySite = (siteId, siteName, fileName) => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/v1/Backup/RecoverySite`, {siteId: siteId, siteName: siteName, fileName: fileName});
}
export const getBackupSite = (id, isSystemBackup) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/Backup/GetBackupSites`, {siteId: id, isSystemBackup: isSystemBackup, pageIndex: 1, pageSize: 10});
}
export const updateDescription = (id, remark) => {
    return ajaxRequest.put(`${enbironmemy.siteManageApi}/api/v1/Backup/UpdateDescription`, {id: id, description: remark});
}
export const exportBackup = (siteName, siteId, fileName) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/Backup/ExportBackup`, {siteName: siteName, siteId: siteId, backupName: fileName});
}
export const deleteBackup = (id, fileName, siteId) => {
    let params={id: id, fileName: fileName, siteId: siteId}
    return ajaxRequest._delete(`${enbironmemy.siteManageApi}/api/v1/Backup/DeleteBackup`, {data:params});
}
export const getBackupCount = (siteId) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/Backup/GetBackupCount`, {siteId: siteId});
}
export const getSiteInfo = (siteId) => {
    return ajaxRequest.get(`${enbironmemy.memberManageApi}/api/AppInfo/GetSiteInfo`, {siteId: siteId});
}