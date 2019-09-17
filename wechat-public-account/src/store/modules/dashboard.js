import { updateAppIdToCookie, getSliderMenuList} from "@/api/request/common.js"
import {setLocal} from '@/libs/local'

// 序列化菜单
let filterMenuListData = (source) => {
    let cloneData = source;
    let pathArr=[];
    let result =  cloneData.filter(father => {
        pathArr.push(father.path)
        let branchArr = cloneData.filter(
            child => father.id == child.parentId
        );
        branchArr.length > 0 ? (father.children = branchArr) : "";
        return father.parentId == 0;
    });
    let result1 = Object.values(result).sort((c, d) => {
        return c.orderId - d.orderId;
    });
    return {result1,pathArr};
    
};
const dashboard = {
    state: {
        appId:"",
        siteId: "",
        menuList:[],
        authList:[], 
    },
    mutations: {
        SETAPPID(state, payload) {
            state.appId = payload;
            setLocal('ymId', payload);
        },
        SETSITEID(state, siteId) {
            state.siteId = siteId;
            setLocal('ymSd', siteId);
        },
        set_menuList(state,m){
            state.menuList = m;
            setLocal("menulist", m)
        },
        set_authList(state, a){
            state.authList = a;
            state.hasRules = true;
            setLocal("authList", a)
        },
    },
    actions: {
        async _updateAppIdToCookie({ commit }){
            let { data } = await updateAppIdToCookie();
            commit("SETAPPID", data)
        },
        async _getMenuListData({ commit,state }) {
           let { data } = await getSliderMenuList();
             let { result1, pathArr } = filterMenuListData(data.menus);
            commit('set_menuList', result1);
            commit('set_authList', pathArr);
            return data
        },
        async getCurRouteAuth({state,getters}, path) {
            if(!state.authList) return;
            return state.authList.some((item, index, array) => {
                return item === path;
            });
        },
    },
    getters: {
        getMenuList(state){
            if(!state.menuList) return 
            return state.menuList
        },
      
    }
};
export default dashboard;
