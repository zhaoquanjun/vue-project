<template>
    <el-container class="member-container">
        <el-aside style="width:120px">
            <page-submenu :submenu-list="submenuList">
                <template v-slot:title>网站管理</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content">
            <el-row class="user-list">
                <span class="member-list-title fs14">我的网站</span>
            </el-row>

        </el-main>

    </el-container>
</template>

<script>
import PageSubmenu from "@/components/common/PageSubmenu";
export default {
  components:{
      PageSubmenu
  },
  data() {
      return {
          submenuList: [
                { name: "网站备份", url: "/website/backup" },
                { name: "我的网站", url: "/website/mysite" },
                { name: "公司信息", url: "/website/companyinfo" },
                { name: "域名管理", url: "/website/sitedomain" }
          ]
      }
  },
  computed: {

  },
}
</script>
<style>

</style>
