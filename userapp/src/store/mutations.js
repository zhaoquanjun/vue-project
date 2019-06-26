import * as types from "./mutation-types.js"
import { setLocal } from '@/libs/local'
let Base64 = require('js-base64').Base64;
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
//   let filterMenuListData = (data) =>{
//     let filterList = [];
//     let obj = {};
//     // data.menuList.map((it, i) => {
//     //   if (data.resourceUrls.indexOf(it.menuUrl) !== -1) {
//     //     filterList.push(it);
//     //   }
//     // });
//     let pathArr = [];
//     data.menuList
//         .sort((a, b) => {
//             return a.parentId - b.parentId;
//         })
//         .map((it, i) => {
//             pathArr.push(it.code);
//             //   debugger;
//             if (obj[it.parentId]) {
//                 obj[it.parentId].children =
//                     obj[it.parentId].children &&
//                     obj[it.parentId].children.length
//                         ? obj[it.parentId].children
//                         : [];
//                 obj[it.parentId].children.push(it);
//                 obj[it.parentId].children.sort((v, k) => {
//                     return v.orderId - k.orderId;
//                 });
//             } else {
//                 if (it.parentId == 0) {
//                     obj[it.id] = it;
//                 } else {
//                     filterList.push(it);
//                 }
//             }
//         });
//     let result = Object.values(obj).sort((c, d) => {
//         return c.orderId - d.orderId;
//     });
  
//     return { result, pathArr };
//   };
  let filterMenuListData = (menuList) =>{
    let arr = []; // [cart]
    function r(pid){
      return menuList.filter(menu=>{ // 格式化菜单变成我们需要的结果
        if(menu.pid === pid){
          arr.push(menu.auth); // 把后端返回的所有路径权限都放到数组中
          let children = r(menu.id);
          menu.children =children.length?children:null;
          return true;
        }
      })
    }
    return {result:r(-1),pathArr:arr};
  }

const mutations = {
   
    /**
     * 是否显示  右侧面板（权限配置）
     * @param {*} state 
     * @param {*} flag 
     */
    [types.ISRIGHTPANNELSHOW](state, flag) { state.isRightPanelShow = flag; },
    /**
     * 关闭右侧面板
     * @param {*} state 
     * @param {*} flag 
     */
    [types.CLOSERIGHTPANNEL](state, flag) {
        state.isRightPanelShow = flag;
        state.isInvitationPanelShow = flag;
    },

    /**
     * 右侧邀请面板
     * @param {*} state 
     * @param {*} flag 
     */
    [types.ISINVITATIONPANELSHOW](state, flag) { state.isInvitationPanelShow = flag; },
    /**
     * 
     * @param {*} state 
     * @param {获取到用户信息} payload 
     */
    [types.USERCURRENTAPPPOLICY](state, payload) { state.userCurAppPolicy = payload },

    [types.GETUSERDASHBOARD](state, payload) {

        state.appid = payload;
        setLocal('appid', payload);
    },
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
};
export default mutations;