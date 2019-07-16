import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js"

export const backupSite = (siteName, siteId, description) => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/v1/Site/BackupSite`, {siteName: siteName, siteId: siteId, description: description});
}
export const recoverySite = (siteName, siteId, backupName) => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/v1/Site/RecoverySite`, {siteName: siteName, siteId: siteId, backupName: backupName});
}
export const getBackupSite = (id, isSystemBackup) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/site/GetBackupSites`, {siteId: id, isSystemBackup: isSystemBackup, pageIndex: 1, pageSize: 10});
}
export const updateDescription = (id, remark) => {
    return ajaxRequest.put(`${enbironmemy.siteManageApi}/api/v1/Site/UpdateDescription`, {id: id, description: remark});
}
export const exportBackup = idList => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/Site/ExportBackup`, { data: idList });
}
export const deleteBackup = (id, fileName, siteId) => {
    return ajaxRequest._delete(`${enbironmemy.siteManageApi}/api/v1/Site/DeleteBackup`, {id: id, fileName: fileName, siteId: siteId});
}
export const getBackupCount = (siteId) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/Site/GetBackupCount`, {siteId: siteId});
}
export const getSiteInfo = (siteId) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/Site/GetSiteInfo`, {siteId: siteId});
}