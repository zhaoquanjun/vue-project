import { getUserCurrentAppPolicy, getUserDashboard, getSliderMenuList} from "@/api/index"
import { authRoutes } from "@/router/routes.js";
import {setLocal} from "@/libs/local"

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
    console.log(result1,pathArr)
    return {result1,pathArr};
    
};
const dashboard = {
    state: {
        appid:"",
        validateMenu:"",
        menuList:[],
        authList:[], 
        buttonAuth:{},
        hasRules:false 
    },
    mutations: {
        GETUSERDASHBOARD(state, payload) {
            state.appid = payload;
            setLocal('appid', payload);
        },
        GETVALIDATEMENU(state, payload) {
            // Base64.encode()
             setLocal('validateMenu',payload);
             state.validateMenu = payload;
            
             // setLocal('validateMenu', payload);
         },
         set_menuList(state,m){
            state.menuList = JSON.stringify(m);
            setLocal("menulist", m)

           },
           set_authList(state, a){
             state.authList = JSON.stringify(a);
             state.hasRules = true;
             setLocal("authList", a)
           },
    },
    actions: {
        async _getUserDashboard({ commit }) {
            let { data } = await getUserDashboard();
            if (data == null) {
                data = await getUserDashboard();
            }
            data && commit("GETUSERDASHBOARD", data.currentAppId)
        },
        async _getMenuListData({ commit }) {
           let { data } = await getSliderMenuList();
             let { result1, pathArr } = filterMenuListData(data);
            commit('set_menuList', result1);
            commit('set_authList', pathArr);
            return data
        },
        async getAuthRoute({ commit, state }) {
            // 要拿到所有权限的路由  权限列表了
            let r = getNeedRoutes(state.authList);
            // 当前需要动态添加的路由
            return r;
        },
        async getCurRouteAuth({state,getters}, path) {
              
            if(!state.authList) return
            let authList = JSON.parse(state.authList)
            return authList.some((item, index, array) => {
                return item === path;
            });
        }
    },
    getters: {
        getMenuList(state){
            if(!state.menuList) return 
            return JSON.parse(state.menuList)
        }
    }
};
export default dashboard;