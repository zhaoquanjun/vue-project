import { getUserCurrentAppPolicy, updateAppIdAndSiteIdToCookie, getSliderMenuList } from "@/api/index";
import { getSiteInfo } from "@/api/request/siteBackupApi";
import { getCurSiteId } from "@/api/request/dashboardApi";
import { setLocal } from "@/libs/local"


// 序列化菜单
let filterMenuListData = (source) => {

    let cloneData = source;
    let pathArr = [];
    let result = cloneData.filter(father => {
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
    return { result1, pathArr };

};
const dashboard = {
    state: {
        appId: "",
        siteId: "",
        validateMenu: "",
        menuList: [],
        authList: [],
        buttonAuth: {},
        hasRules: false,
        isSiteInfoShow: false,
        isWechataccountShow: false,
        isMicroShow: false,
        isFormShow: false
    },
    mutations: {
       
        SETSITEID(state, siteId) {
            state.siteId = siteId;
            setLocal('ymSd', siteId);
        },
        SETAPPID(state, appId) {
            state.appId = appId;
            if(process.env.NODE_ENV === "development"){
                setLocal('ymId', appId);
              }
           
        },
        set_menuList(state, m) {
            state.menuList = m;
            setLocal("menulist", m)

        },
        set_authList(state, a) {
            state.authList = a;
            state.hasRules = true;
            setLocal("authList", a)
        },
        reset_store(state) {
            state.appId = "";
            state.siteId = "";
        }
    },
    actions: {
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
        async _updateAppIdAndSiteIdToCookie({ commit }) {
            let { data } = await updateAppIdAndSiteIdToCookie();
            commit("SETAPPID", data)
        },
        async _getMenuListData({ commit, state }) {
            let { data } = await getSliderMenuList();
            let { result1, pathArr } = filterMenuListData(data.menus);
            commit('set_menuList', result1);
            commit('set_authList', pathArr);
            data.menus.forEach(item => {
                if (item.code === "design") {
                    state.isSiteInfoShow = true
                }
                if (item.code == "wechataccount") {
                    state.isWechataccountShow = true
                }
                if (item.code == "micro") {
                    state.isMicroShow = true
                }
                if (item.code == "form") {
                    state.isFormShow = true
                }
            })
            return data
        },
      
        async getCurRouteAuth({ state, getters }, path) {
            if (!state.authList) return;
            return state.authList.some((item, index, array) => {
                return item === path;
            });
        },
        getChildrenMenuList({ state }, curPath) {
            if (!state.menuList) return
            return new Promise((resolve, reject) => {
                state.menuList.map((item, index) => {
                    if (curPath == item.code) {
                        resolve(item)
                    }
                })
            })

        }
    },
    getters: {
        getMenuList(state) {
            if (!state.menuList) return
            return state.menuList
        },

    }
};
export default dashboard;
