<template>
  <div
    class="m-aside"
    :style="{width:width+'px',transition: 'width .5s linear',backgroundColor:'#fff'}"
    @mouseenter="collapseOpen(150,0.8)"
    @mouseleave="collapseClose"
  >
    <!--   @mouseenter="collapseOpen(150,0.8)"
    @mouseleave="collapseClose"-->
    <el-aside class="m-asideleft" :style="{width:width+'px'}">
      <!-- <ul class="left-menu">
        <li class="left-menu-item">
          <svg-icon icon-class="l-home"></svg-icon>
          <span class="menu-item-content">控制台首页</span>
        </li>

        <li class="left-menu-item">
          <svg-icon icon-class="l-content"></svg-icon>
          <span class="menu-item-content">内容管理</span>
        </li>
        <li class="left-menu-item">
          <svg-icon icon-class="l-website"></svg-icon>
          <span class="menu-item-content">网站管理</span>
        </li>
        <li class="left-menu-item">
          <svg-icon icon-class="l-smallprogram"></svg-icon>
          <span class="menu-item-content">小程序</span>
        </li>
        <li class="left-menu-item">
          <svg-icon icon-class="l-weixin"></svg-icon>
          <span class="menu-item-content">微信公众号</span>
        </li>
        <li class="left-menu-item">
          <svg-icon icon-class="l-form"></svg-icon>
          <span class="menu-item-content">表单管理</span>
        </li>
        <li class="left-menu-item">
          <svg-icon icon-class="l-member"></svg-icon>
          <span class="menu-item-content">电商会员</span>
        </li>
        <li class="left-menu-item">
          <svg-icon icon-class="l-system"></svg-icon>
          <span class="menu-item-content">系统设置</span>
        </li>
        <li class="left-menu-item">
          <svg-icon icon-class="l-recyclebin"></svg-icon>
          <span class="menu-item-content">回收站</span>
        </li>
      </!-->
      <ul class="left-menu">
        <li
          class="left-menu-item"
          v-for="(it, i) in menuList"
          :key="i"
          @mouseenter="changeCurHoverItem(i)"
          @click="skipPages(it)"
        >
          <svg-icon :icon-class="'l-' + it.code"></svg-icon>
          <span class="menu-item-content">{{it.name}}</span>
        </li>
      </ul>
    </el-aside>
    <LeftNavComponents
      v-if="menuList.length"
      :style="{width:width1+'px !important',transition: 'width '+time+' linear',backgroundColor:'#fff'}"
      class="m-asideright"
      :menuList="menuList[curIndex]"
    ></LeftNavComponents>
  </div>
</template>
<script>
import { getSliderMenuList } from "@/api/index";
import LeftNavComponents from "../Aside/LeftNavComponents";

export default {
  data() {
    return {
      flag: 0,
      width: 50,
      width1: 0,
      time: "0.8s",
      curIndex: 0,
      menuList: [],
      menuData: {
        pluginList: [
          {
            pluginCode: "DashBoard",
            name: "微站用户面板",
            description: "微站用户面板",
            isActive: true,
            id: 1000
          },
          {
            pluginCode: "Content",
            name: "微站内容管理",
            description: "微站内容管理",
            isActive: true,
            id: 1001
          },
          {
            pluginCode: "Pc/Mobile",
            name: "Pc/Mobile设计器",
            description: "Pc/Mobile设计器",
            isActive: true,
            id: 1002
          },
          {
            pluginCode: "MicroProgram",
            name: "小程序设计器",
            description: "小程序设计器",
            isActive: true,
            id: 1003
          },
          {
            pluginCode: "Form",
            name: "微站表单",
            description: "微站表单",
            isActive: true,
            id: 1004
          },
          {
            pluginCode: "Identity",
            name: "登录中心",
            description: "微站统一登录中心",
            isActive: true,
            id: 1005
          }
        ],
        menuList: [
          {
            code: "content",
            name: "内容管理",
            orderId: 2,
            parentId: 0,
            menuUrl: "content.console.wezhan.cn",
            pluginId: 1001,
            id: 1
          },
          {
            code: "website",
            name: "网站管理",
            orderId: 3,
            parentId: 0,
            menuUrl: "dashboard.console.wezhan.cn/website",
            pluginId: 1000,
            id: 3
          },
          {
            code: "micro",
            name: "小程序",
            orderId: 4,
            parentId: 0,
            menuUrl: "dashboard.console.wezhan.cn/micro",
            pluginId: 1000,
            id: 26
          },
          {
            code: "board",
            name: "控制台首页",
            orderId: 1,
            parentId: 0,
            menuUrl: "dashboard.console.wezhan.cn",
            pluginId: 1000,
            id: 8
          },
          {
            code: "wechat",
            name: "微信公众号",
            orderId: 5,
            parentId: 0,
            menuUrl: "dashboard.console.wezhan.cn/wechat",
            pluginId: 1000,
            id: 10
          },
          {
            code: "form",
            name: "表单管理",
            orderId: 6,
            parentId: 0,
            menuUrl: "form.console.wezhan.cn",
            pluginId: 1004,
            id: 11
          },
          {
            code: "system",
            name: "系统设置",
            orderId: 8,
            parentId: 0,
            menuUrl: "dashboard.console.wezhan.cn/system",
            pluginId: 1000,
            id: 14
          },
          {
            code: "recycle",
            name: "回收站",
            orderId: 9,
            parentId: 0,
            menuUrl: "dashboard.console.wezhan.cn/recycle",
            pluginId: 1000,
            id: 15
          },
          {
            code: "news",
            name: "文章管理",
            orderId: 2,
            parentId: 1,
            menuUrl: "content.console.wezhan.cn/news",
            pluginId: 1001,
            id: 16
          },
          {
            code: "product",
            name: "产品管理",
            orderId: 1,
            parentId: 1,
            menuUrl: "content.console.wezhan.cn/product",
            pluginId: 1001,
            id: 17
          },
          {
            code: "picture",
            name: "图片管理",
            orderId: 3,
            parentId: 1,
            menuUrl: "content.console.wezhan.cn/picture",
            pluginId: 1001,
            id: 18
          },
          {
            code: "role",
            name: "员工角色管理",
            orderId: 1,
            parentId: 14,
            menuUrl: "dashboard.console.wezhan.cn/system/role",
            pluginId: 1000,
            id: 21
          }
        ],
        resourceUrls: [
          "dashboard.console.wezhan.cn/system/role",
          "form.console.wezhan.cn",
          "dashboard.console.wezhan.cn/wechat",
          "dashboard.console.wezhan.cn/micro",
          "content.console.wezhan.cn",
          "content.console.wezhan.cn/news",
          "content.console.wezhan.cn/picture",
          "content.console.wezhan.cn/product",
          "onlinenew",
          "outlinenew"
        ]
      }
    };
  },
  components: {
    LeftNavComponents
  },
  created() {
    // this.getMenuListData();
    this.filterMenuListData(this.menuData.menuList);
  },
  methods: {
    async getMenuListData() {
      let { data } = await getSliderMenuList();
      this.filterMenuListData(data.menuList);
    },
    filterMenuListData(data) {
      let filterList = [];
      let obj = {};
      data.map((it, i) => {
        if (this.menuData.resourceUrls.indexOf(it.menuUrl) !== -1) {
          filterList.push(it);
        }
      });
      filterList
        .sort((a, b) => {
          return a.parentId - b.parentId;
        })
        .map((it, i) => {
          //   debugger;
          if (obj[it.parentId]) {
            console.log(it.name);
            obj[it.parentId].children =
              obj[it.parentId].children && obj[it.parentId].children.length
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
      this.menuList = Object.values(obj).sort((c, d) => {
        return c.orderId - d.orderId;
      });
    },
    changeCurHoverItem(i) {
      this.curIndex = i;
    },
    skipPages(it) {
        if (it.children) return;
        location.href = `${it.menuUrl}`
    },
    collapseOpen(width, time) {
      this.width = width;
      this.width1 = 120;
      this.time = time + "s";
    },
    collapseClose() {
      this.width = 50;
      this.width1 = 0;
      this.time = "0s";
    }
  }
};
</script>

<style scoped>
.left-menu-item:hover {
  background: #e5f8fa;
}
.left-menu-item .svg-icon {
  stroke: #5f9ee9 !important;
  fill: #5f9ee9 !important;
}
.svg-icon:hover path {
  fill: red;
}

.m-aside {
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  z-index: 10;
}
.m-asideleft {
  overflow: hidden;
  height: 100%;
}
.m-asideright {
  width: 0px !important;
  position: absolute;
  left: 150px;
  z-index: 10;
  top: 0;
  text-align: center;
  overflow: hidden;
}
.el-menu {
  height: 100%;
}
</style>
<style lang="scss" scoped>
// 手写菜单
.left-menu {
  height: 100%;
  border-right: solid 1px #e6e6e6;
  background: #fff;
  .left-menu-item {
    padding: 0 20px;
    line-height: 40px;
    white-space: nowrap;
    .menu-item-content {
      margin-left: 20px;
    }
  }
}
</style>

