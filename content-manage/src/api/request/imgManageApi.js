import * as ajaxRequest from "../ajaxRequest";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取图片列表
 * @param {*} option 
 */
export const getPicList = (option) => {
    console.log(option.keyword)
    let params = {
        keyword: option.keyword || "",
        orderByType: option.orderByType|| "",
        isDescending:option.isDescending || true,
        picCategoryId: option.picCategoryId || "",
    
    };
    let page ={
        pageIndex:option.pageIndex || 1,
        pageSize:option.pageSize|| 9
    }
    return ajaxRequest.get(`/api/Picture/${page.pageIndex}/${page.pageSize}`,params);
}