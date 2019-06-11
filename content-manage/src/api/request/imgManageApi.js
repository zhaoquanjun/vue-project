import * as ajaxRequest from "../ajaxRequest";

// case

export const getList = () => {
    let params = {
        keyword:"",
        orderByType:"",
        isDescending:"",
        picCategoryId:"",
        // pageIndex: "1",
        // pageSize: "12"
    };
    return ajaxRequest.get('/api/Picture/', params);
}