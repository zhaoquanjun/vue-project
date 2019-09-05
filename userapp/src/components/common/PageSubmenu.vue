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
        :class="{'active':lastRoute==item.code}"
      >{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
import { siteDomain } from "@/environment/index";
export default {
  data() {
    return {
      children: "",
      lastRoute: "",
      parentPath: "",
      subTitle: ""
    };
  },

  methods: {
    handlerRoute(item, index) {
      let domain = item.menuUrl.split("/")[0];
      if (siteDomain == domain) {
        this.$router.push(item.path);
        return;
      } else {
        window.location.href = "//" + item.menuUrl;
      }
    },
    getChildrenMenuList(curPath) {
      this.menuList.forEach(item => {
        if (curPath == item.code) {
          this.children = item.children;
        }
      });
    }
  },
  mounted() {
    let [, firstRoute, lastRoute] = this.$route.path.split("/");
    this.lastRoute = lastRoute;
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
      // alert(1)
      console.log(this.$route);
      let [, firstRoute, lastRoute] = this.$route.path.split("/");
      this.lastRoute = lastRoute;
      this.parentPath = firstRoute;
    }
  }
};
</script>
<style lang="scss" scoped>
.submenu {
  max-width: 100px;
  height: calc(100vh);
  background: #fff;
  border-right: 1px solid #e5e5e5;
  .submenu-title {
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    padding-top: 5px;
  }
  .submenu-list {
    padding-top: 7px;
    li {
      cursor: pointer;
      height: 50px;
      line-height: 50px;
      padding-left: 12px;
      margin-bottom: 10px;
      &:hover {
        color: #262626;
        background: #e0fcff;
      }
    }
  }
}
.active {
  background: #e0faff;
  color: #0595e6;
}
.active:hover {
  color: #0595e6 !important;
  background: #e0fcff !important;
}
</style>
