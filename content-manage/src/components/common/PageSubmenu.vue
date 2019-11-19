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
export default {
  data() {
    return {
      children: [],
      lastRoute: "",
      parentPath: "",
      subTitle: ""
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
    
  },
  mounted() {
    let routerList = this.$route.path.split("/");
    let [, firstRoute, lastRoute] = this.$route.path.split("/");
    this.lastRoute = routerList[routerList.length-1];
    this.parentPath = firstRoute;
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
    }
  }
};
</script>
<style lang="scss" scoped>
.submenu {
    width: 149px;
    height: calc(100vh - 50px);
    background: $--color-black-2;
    border-right: 1px solid #e5e5e5;
    .submenu-title {
        height: 40px;
        line-height: 40px;
        padding-left: 24px;
        font-size: 16px;
        padding-top: 5px;
        text-align: left;
        color: $--color-white;
    }
    .submenu-list {
        padding-top: 7px;
        li {
          cursor: pointer;
          line-height: 50px;
          font-size: 14px;
          font-weight:400;
          color:$--color-white;
          span {
            padding-left: 24px;
            cursor: pointer;
          }
          &:hover {
            color: #262626;
            background:#f0f3f7;
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
              background: #f0f3f7;
            }
            .active {
              color: #0595e6 !important;
            }
          }
        }
    }
}
.active {
   color: $--color-primary !important;
}
.active:hover {
    background: #fff ;
}
</style>