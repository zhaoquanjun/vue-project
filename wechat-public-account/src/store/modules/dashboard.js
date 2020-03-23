import { updateAppIdToCookie, getSliderMenuList} from "@/api/request/common.js"
import { getCurSiteId, getAutoTranslateConfig, getSites } from "@/api/request/dashboardApi.js"
import { getSiteInfo } from "@/api/request/siteBackupApi";
import {setLocal} from '@/libs/local'
import { setCookie } from "@/libs/cookie"

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
        isContentwrite: false,
        siteList: [],
        autoTranslateSwitch: false
    },
    mutations: {
        SETAPPID(state, appId) {
            state.appId = appId;
            // appid => bqqje  对应的下一个字母
            setCookie("bqqje", appId)
        },
        SETSITEID(state, siteId) {
            state.siteId = siteId;
            // siteid => tjufje  对应的下一个字母
            setCookie("tjufje", siteId)
        },
        set_menuList(state,m){
            state.menuList = m;
            // setLocal("menulist", m)
        },
        set_authList(state, a){
            state.authList = a;
            state.hasRules = true;
            // setLocal("authList", a)
        },
        set_autoTranslateSwitch(state, status) {
          state.autoTranslateSwitch = status;
        },
    },
    actions: {
        async _setSiteId({ commit }) {
            let { data } = await getCurSiteId();
            if(data) {
                commit("SETSITEID", data)
            }
        },
        async _haveTemplate({ commit, state }) {
            if (!state.siteId) {
                let { data } = await getCurSiteId();
                commit("SETSITEID", data)
            }
            let { data } = await getSiteInfo(state.siteId);
            if (data.templateId == 0) {
                return false
            } else {
                return true
            }
        },
        async _updateAppIdAndSiteIdToCookie({ commit }){
            let { data } = await updateAppIdToCookie();
            commit("SETAPPID", data)
        },
        async _getMenuListData({ commit,state }) {
           let { data } = await getSliderMenuList();
             let { result1, pathArr } = filterMenuListData(data.menus);
            commit('set_menuList', result1);
            commit('set_authList', pathArr);
            data && data.operations.forEach(item => {
                if (item === "ContentWrite") {
                    state.isContentwrite = true;
                }
            })
            data.menus.forEach(async item => {
              // 判断是否有设计器权限
              if (item.code === "design") {
                let { data } = await getSites();
                state.siteList = data
                if (data.length > 1) {
                  let { data } = await getAutoTranslateConfig();
                  commit("set_autoTranslateSwitch", data)
                }
              }
            })
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
