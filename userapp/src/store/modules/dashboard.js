import { getUserCurrentAppPolicy, getUserDashboard, getSliderMenuList} from "@/api/index"
import { authRoutes } from "@/router/routes.js";
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
    let cloneData = JSON.parse(JSON.stringify(source));
    let result = cloneData.filter(father => {
        let branchArr = cloneData.filter(
            child => father.id == child.parentId
        );
        branchArr.length > 0 ? (father.children = branchArr) : "";
        return father.parentId == 0;
    });
    let result1 = Object.values(result).sort((c, d) => {
        return c.orderId - d.orderId;
    });
    return result1;
};
const dashboard = {
    state: {
        validateMenu:"",
        menuList:[],
        authList:[], 
        buttonAuth:{},
        hasRules:false 
    },
    mutations: {
        [types.GETVALIDATEMENU](state, payload) {
            // Base64.encode()
             setLocal('validateMenu',payload);
             state.validateMenu = payload;
            
             // setLocal('validateMenu', payload);
         },
         set_menuList(state,m){
             let v = JSON.parse(state.validateMenu)
             console.log(v.menuList)
            state.menuList = filterMenuListData(v);
           
           },
           set_authList(state, a){
             state.authList = a;
             state.hasRules = true;
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
            let { result, pathArr } = filterMenuListData(data);
            commit('set_menuList', result1);
          //  commit('set_authList', pathArr);
            data && commit("GETVALIDATEMENU", data)
            return data
        },
        async getAuthRoute({ commit, state }) {
            // 要拿到所有权限的路由  权限列表了
            let r = getNeedRoutes(state.authList);
            // 当前需要动态添加的路由
            return r;
        },
        async getCurRouteAuth({ state }, path) {
            let validateMenu = JSON.parse(state.validateMenu);
            return validateMenu.menuList.some((item, index, array) => {
                return `/${item.code}` === path;
            });
        }
    },
    getters: {

    }
};
export default login;
