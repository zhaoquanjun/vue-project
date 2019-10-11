import { getUserCurrentAppPolicy, updateAppIdAndSiteIdToCookie, getSliderMenuList } from "@/api/index";
import { getSiteInfo } from "@/api/request/siteBackupApi";
import { getCurSiteId } from "@/api/request/dashboardApi";
import { authRoutes } from "@/router/routes.js";
import { setLocal } from "@/libs/local"

// 更具后台菜单路由 匹配出 所需要显示的路由
let getNeedRoutes = auth => {
    function r(authRoutes) {
        return authRoutes.filter(route => {
            if (auth.includes(route.name)) {
                if (route.children) {
                    route.children = r(route.children);
                }
                return true; // 有权限就返回
            }
        });
    }
    return r(authRoutes);
};
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
        GETUSERDASHBOARD(state, payload) {
            state.appId = payload;
            //setLocal('appid', payload);
        },
        SETSITEID(state, siteId) {
            state.siteId = siteId;
            setLocal('ymSd', siteId);
        },
        SETAPPID(state, appId) {
            state.appId = appId;
            console.log(appId, 'appIdappIdappIdappIdappIdappId')
            setLocal('ymId', appId);
        },
        GETVALIDATEMENU(state, payload) {
            // Base64.encode()
            setLocal('validateMenu', payload);
            state.validateMenu = payload;

            // setLocal('validateMenu', payload);
        },
        set_menuList(state, m) {
            // state.menuList = JSON.stringify(m);
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
            console.log(data,'9975678')
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
        async getAuthRoute({ commit, state }) {
            // 要拿到所有权限的路由  权限列表了
            let r = getNeedRoutes(state.authList);
            // 当前需要动态添加的路由
            return r;
        },
        async getCurRouteAuth({ state, getters }, path) {

            if (!state.authList) return;
            // let authList = JSON.parse(state.authList)
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
            // return JSON.parse(state.menuList)
            return state.menuList
        },

    }
};
export default dashboard;
