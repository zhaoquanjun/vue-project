import * as ajaxRequest from "../ajaxRequest";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取文章列表
 * @param {*} option 
 */
export const getArticalList = (option) => {
    let params = {
        title: option.title || "",
        categoryId: option.categoryId|| 0,
        orderCondition: option.orderCondition || 0,
        publishStatus: option.publishStatus || null,
        isDescending:option.isDescending || true
    
    };
    let page ={
        pageIndex:option.pageIndex || 1,
        pageSize:option.pageSize|| 10
    };
    return ajaxRequest.get(`/api/News/GetCategoryTree/${page.pageIndex}/${page.pageSize}`,params);
}