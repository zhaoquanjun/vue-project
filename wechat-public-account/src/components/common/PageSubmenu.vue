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
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { siteDomain } from "@/environment/index";
import { getLocal } from '@/libs/local'
export default {
  data() {
    return {
      children: [],
      lastRoute: "",
      parentPath: "",
      parentPaths: "",
      subTitle: "",
      wechatList: [],
    };
  },
created(){
     console.log(getLocal("menulist"),'0000') 
},
  methods: {
    handlerRoute(item, index) {
      //有三级路由时，二级路由不跳转
      if (item.children && item.children.length > 0) {
        return
      }
      let domain = item.menuUrl.split("/")[0];
        if (siteDomain == domain) {
            let wx_status = getLocal('wx_status') || this.$store.state.wxaccount.wx_status
            if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
                this.$router.replace({path:'/wechat/wxauther' });
            } else {
                this.$router.push(item.path);
            }
            return
        } else {
            window.location.href = "//" + item.menuUrl;
        }
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
              return "iconicon-banpipei"    
      }
    }
  },
  mounted() {
    let routerList = this.$route.path.split("/");
    let [, firstRoute, lastRoute] = this.$route.path.split("/");
    this.lastRoute = routerList[routerList.length-1];
    this.parentPath = firstRoute;
  },
  computed: {
    menuList() {
      let menuList1 = this.$store.state.dashboard.menuList || getLocal("menulist");
      let children = [];
      console.log('999children',menuList1,this.parentPath,this.parentPath)
      menuList1.map(item => {
        if (item.code == 'website') {
                this.subTitle = item.name;
                children = item.children;
        }
      });
      console.log('999children',children)
      return children;
    }
  },
  watch: {
    $route(to, from) {
      let routerList = this.$route.path.split("/");
      let [, firstRoute, lastRoute] = this.$route.path.split("/");
      this.lastRoute = routerList[routerList.length-1];
      this.parentPath = firstRoute;
      this.parentPaths = routerList[routerList.length-2];
    }
  }
};
</script>
<style lang="scss" scoped>
.submenu {
    width: 130px;
    height: calc(100vh - 50px);
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
          line-height: 32px;
          font-size: $--font-size-small;
          span {
            display: inline-block;
            color: $--color-white;
            height: 32px;
            line-height: 32px;
            width: 100%;
            padding-left: 24px;
            cursor: pointer;
          }
          .nochildren {
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
              height: 32px;
              font-size: 14px;
              line-height: 32px;
              padding: 0 12px;
              color: $--color-white;
            }
          }
          p {
            cursor: pointer;
            padding-left: 40px;
            line-height: 32px;
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
