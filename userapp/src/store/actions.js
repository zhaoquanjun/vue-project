
import { getUserCurrentAppPolicy, getUserDashboard, getSliderMenuList} from "@/api/index"
import { authRoutes } from "@/router/routes.js";
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
let filterMenuListData = (data) =>{
  let filterList = [];
  let obj = {};
  // data.menuList.map((it, i) => {
  //   if (data.resourceUrls.indexOf(it.menuUrl) !== -1) {
  //     filterList.push(it);
  //   }
  // });
  let pathArr = [];
  data.menuList
      .sort((a, b) => {
          return a.parentId - b.parentId;
      })
      .map((it, i) => {
          pathArr.push(it.code);
          //   debugger;
          if (obj[it.parentId]) {
              obj[it.parentId].children =
                  obj[it.parentId].children &&
                  obj[it.parentId].children.length
                      ? obj[it.parentId].children
                      : [];
              obj[it.parentId].children.push(it);
              obj[it.parentId].children.sort((v, k) => {
                  return v.orderId - k.orderId;
              });
          } else {
              if (it.parentId == 0) {
                  obj[it.id] = it;
              } else {
                  filterList.push(it);
              }
          }
      });
  let result = Object.values(obj).sort((c, d) => {
      return c.orderId - d.orderId;
  });

  return { result, pathArr };
};

const actions = {
    async _getUserDashboard({ commit }) {
      
        let { data } = await getUserDashboard();
        if (data == null) {
            data = await getUserDashboard();
        }
        console.log(data);
        //currentAppId
        data && commit("GETUSERDASHBOARD", data.lastLoginOutAppId)
    },


    async _getMenuListData({ commit }) {
      let { data } = await getSliderMenuList();
      let {result, pathArr } = filterMenuListData(data);
      commit('set_menuList',result);
      commit('set_authList',pathArr);
      data && commit("GETVALIDATEMENU", data)
      return data
    },
    async getAuthRoute({commit,state}){
      // 要拿到所有权限的路由  权限列表了
      let r = getNeedRoutes(state.authList);
      // 当前需要动态添加的路由
      return r;
    }
};
export default actions;
