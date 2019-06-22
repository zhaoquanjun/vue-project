<template>
  <el-aside>
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo">
      <el-menu-item v-for="(item,index) in menuList.children" :key="index" @click="skipPage(item)">
        <span>{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<script>
import { checkHasRootSkip } from "@/api/index";
export default {
  props: ["menuList"],
  mounted() {
    console.log(this.menuList)
  },
  methods: {
    async skipPage(it) {
      let { data, status } = await checkHasRootSkip({url: it.menuUrl});
      if (status == 200) {
        let path = it.menuUrl.split('/')[1]
        this.$router.push(`${path}`)
      }
    }
  }
};
</script>

