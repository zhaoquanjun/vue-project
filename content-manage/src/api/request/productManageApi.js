import * as ajaxRequest from "../ajaxRequest";

// case
//GET   ajaxRequest.get(`url`,params);
//POST  ajaxRequest.post(`url`,params);
//PUT  ajaxRequest.put(`url`,params);
//DELETE  ajaxRequest._delete(`url`,params);

/**
 * 获取产品列表
 * @param {*} option 
 */
export const getProductList = (option) => {
    console.log("产品管理：调用 getProductList");
    return ajaxRequest.get(`http://localhost:8200/api/product/items/${option.pageIndex}/${option.pageSize}`,option);
}

export const getCategoryTree=() =>{
    console.log("产品管理：调用 getCategoryTree");
    return ajaxRequest.get(`http://localhost:8200/api/productcategory/gettree`);
    
}