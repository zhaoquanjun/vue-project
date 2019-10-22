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
      <span>{{item.name}}</span>
        <div v-show="item.children">
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
import { wechataccountDomain } from "@/environment/index";
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
        if (wechataccountDomain == domain) {
            let wx_status = getLocal('wx_status') || this.$store.state.wxaccount.wx_status
            if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
                this.$router.replace({path:'/wechataccount/wxauther' });
            } else {
                this.$router.push(item.path);
            }
            return
        } else {
            window.location.href = "//" + item.menuUrl;
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
    width: 150px;
    height: calc(100vh - 50px);
    // border-right: 1px solid #e5e5e5;
     background: #F8FAFC;
    .submenu-title {
        height: 40px;
        line-height: 40px;
        padding-left: 24px;
        padding-top: 5px;
        text-align: left;
    }
    .submenu-list {
        padding-top: 7px;
        li {
          cursor: pointer;
          line-height: 50px;
          font-size: 14px;
          font-weight:400;
          color:rgba(38,38,38,1);
          span {
            padding-left: 24px;
            cursor: pointer;
          }
          p {
            cursor: pointer;
            padding-left: 40px;
            line-height: 50px;
            font-size: 14px;
            font-weight:400;
            color:rgba(38,38,38,1);
            &:hover {
              color: #262626;
              background: #fff;
            }
            .active {
              background: #fff !important;
              color: #0595e6 !important;
            }
          }
        }
    }
}
.active {
    background: #fff !important;
    color: #0595e6 !important;
}
.active:hover {
    background: #fff ;
}
</style>
