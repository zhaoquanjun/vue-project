import * as ajaxRequest from "../ajaxRequest";
import enbironmemy from "@/environment/index.js"

export const backupSite = (siteName, siteId, description) => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/v1/Site/BackupSite`, {"siteName" : siteName, "siteId" : siteId, "description" : description});
}
export const recoverySite = () => {
    return ajaxRequest.post(`${enbironmemy.siteManageApi}/api/v1/Site/RecoverySite`);
}
export const getBackupSite = (id, isSystemBackup) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/site/GetBackupSites`, {siteId: id, isSystemBackup: isSystemBackup,pageIndex:1,pageSize:10});
}
export const getBackupSiteLogs = (id) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/Site/GetBackupSiteLogs`, {siteId: id});
}
export const updateDescription = (id, remark) => {
    return ajaxRequest.put(`${enbironmemy.siteManageApi}/api/v1/Site/UpdateDescription`, {"id": id,"description": remark});
}
export const exportBackup = idList => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/Site/ExportBackup`, { data: idList });
}
export const deleteBackup = (id, newName) => {
    return ajaxRequest._delete(`${enbironmemy.siteManageApi}/api/v1/Site/DeleteBackup`, {"id": id,});
}
export const getBackupCount = (id, siteId) => {
    return ajaxRequest.get(`${enbironmemy.siteManageApi}/api/v1/Site/GetBackupCount`, {});
}