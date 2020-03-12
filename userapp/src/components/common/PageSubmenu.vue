<template>
  <div class="submenu">
    <h4 class="submenu-title">
      <i>{{subTitle}}</i>
    </h4>
    <ul class="submenu-list">
      <li
        @click="handlerRoute(item,index)"
        v-for="(item,index) in menuList"
        :key="index"
        :class="{'active':lastRoute == item.code}"
      >
      <span :class="[item.children && item.children.length > 0==1?'haschildren':'nochildren']">
          <i v-show="item.children && item.children.length>0" class="icon iconfont" :class="[iconfonts(item.code)]"></i>
          {{item.name}}
          
      </span>
        <div v-show="item.children && item.children.length>0">
          <p 
            v-for="(item2,ind) in item.children"
            @click.stop="handlerRoute(item2,index)"
            :key="ind"
            :class="{'active':lastRoute== item2.code}"
          >
            {{item2.name}}
            <i class="unReadCount" v-if="item2.path === '/website/mysite/leaveword' && curUnReadCount !== 0">{{curUnReadCount}}</i>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { siteDomain } from "@/environment/index";
import * as msgBoardApi from "@/api/request/msgBoardApi";
export default {
  props: {
    unReadCount: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      children: [],
      lastRoute: "",
      parentPath: "",
      subTitle: "",
      curUnReadCount: this.unReadCount,
      curSiteId: this.$store.state.dashboard.siteId
    };
  },

  methods: {
    handlerRoute(item, index) {
      //有三级路由时，二级路由不跳转
      if (item.children && item.children.length > 0) {
        return
      }
      let domain = item.menuUrl.split("/")[0];
      if (siteDomain == domain) {
        this.$router.push(item.path);
        return;
      } else {
        window.location.href = "//" + item.menuUrl;
      }
    },
    async getUnReadCount() {
      let { data } = await msgBoardApi.getUnReadCount(this.curSiteId);
      this.curUnReadCount = data;
    },
    iconfonts(code) {
      switch (code) {
          case "mysite":
              return "iconicon-dash-Mymanagement";
          case "wechataccount":
              return "iconicon-dash-Publicpromotion";
          case "seo":
              return "iconicon-dash-seo";
          case "sitemanage":
              return "iconicon-dash-Webmanagement";
          case "sitemember":
              return "iconicon-dash-membermanagement";
          case "controlmanege":
              return "iconicon-dash-zhujian";
      }
    }
    
  },
  mounted() {
    let routerList = this.$route.path.split("/");
    let [, firstRoute, lastRoute] = this.$route.path.split("/");
    this.lastRoute = routerList[routerList.length-1];
    this.parentPath = firstRoute;
    this.curSiteId && this.getUnReadCount();
  },
  computed: {
    menuList() {
      let menuList1 = this.$store.state.dashboard.menuList;
      let children = [];
      menuList1.map(item => {
        if (this.parentPath == item.code) {
          this.subTitle = item.name;
          children = item.children;
        }
      });
      return children;
    }
  },
  watch: {
    $route(to, from) {
      let routerList = this.$route.path.split("/");
      let [, firstRoute, lastRoute] = this.$route.path.split("/");
      this.lastRoute = routerList[routerList.length-1];
      this.parentPath = firstRoute;
    },
    unReadCount() {
      this.unReadCount >=0 && (this.curUnReadCount = this.unReadCount);
      if(this.curUnReadCount < 0) {
        this.curUnReadCount = 0;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.submenu {
    width: 130px;
    height: 100vh;
    background: $--color-black-light;
    border-right: $--border-base;
    .submenu-title {
        height: 50px;
        line-height: 50px;
        color: $--color-white;
        font-size: 14px;
        text-align: center;
    }
    .submenu-list {
        li {
          cursor: pointer;
          line-height: 36px;
          font-size: $--font-size-small;
          span {
            display: inline-block;
            color: $--color-white;
            height: 36px;
            line-height: 36px;
            width: 100%;
            cursor: pointer;
          }
          .nochildren {
            text-align: center;
            &:hover {
              color: $--color-white;
              background: rgba(245, 246, 247, 0.1);
            }
          }
          .haschildren {
            padding-left: 0px;
            cursor: default;
            i {
              width: 14px;
              height: 36px;
              font-size: 14px;
              line-height: 36px;
              padding: 0 12px;
              color: $--color-white;
            }
          }
          p {
            cursor: pointer;
            padding-left: 40px;
            line-height: 36px;
            font-size: $--font-size-small;
            color:$--color-text-regular;
            &:hover {
              color: $--color-white;
              background: rgba(245, 246, 247, 0.1);
            }
          }
        }
    }
}
.unReadCount {
  line-height: 16px;
  position: absolute;
  margin-top: 4px;
  margin-left: 2px;
  background: $--color-danger;
  color: $--color-white !important;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  text-align: center;
}
.active {
    color: $--color-primary !important;
    span {
        color: $--color-primary !important;
    }
}
.active:hover {
    color: $--color-white;
    background: rgba(245, 246, 247, 0.1);
}
</style>