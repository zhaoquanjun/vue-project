import * as ajaxRequest from "../ajaxRequest";
import environment from "@/environment/index";

// 查询普通控件
export const getList = () => {
    return ajaxRequest.get(`${environment.templateApi}/api/v1/ControlCategory/GetList`);
}
// 新增分类
export const add = (para) => {
    return ajaxRequest.post(`${environment.templateApi}/api/v1/ControlCategory/Add`, para);
}
// 编辑分类
export const update = (para) => {
    return ajaxRequest.put(`${environment.templateApi}/api/v1/ControlCategory/Update`, para);
}
// 删除分类
export const deleteCategory = (IdList) => {
    return ajaxRequest._delete(`${environment.templateApi}/api/v1/ControlCategory/Delete`, { data: IdList });
}
// 获取分类
export const getDropDownList = (parentId) => {
    let para = ``
    if (parentId) {
        para = `?parentId=${parentId}`
    }
    return ajaxRequest.get(`${environment.templateApi}/api/v1/ControlCategory/GetDropDownList`, { parentId: parentId });
}
// 更新缓存
export const refresh = () => {
    return ajaxRequest.put(`${environment.templateApi}/api/v1/ControlCategory/Refresh`);
}