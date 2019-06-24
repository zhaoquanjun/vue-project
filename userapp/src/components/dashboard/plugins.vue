<template>
  <el-row class="plugin-section" :gutter="16">
    <el-col class="plugins-box" :span="12" v-for="(it, idx) in plugins" :key="idx">
      <div class="box-inner"  @click="checkSkipRoot(it)">
        <span class="plugin-l plugin-item"></span>
        <span class="plugin-r plugin-item">
          <h2>{{it.name}}</h2>
          <p>{{it.description}}</p>
          <p>{{it.isActive ? '激活' : '未激活'}}</p>
        </span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { checkHasRootSkip } from "@/api/index";
export default {
  props: ['plugins'],
  data() {
    return {
      
    };
  },
  methods: {
    async checkSkipRoot(it) {
      let {data, status} = await checkHasRootSkip({url: it.menuUrl})
      if (status == 200) {
        location.href = `${it.menuUrl}`
      }
    }
  }
};
</script>

<style lang="scss" scoped>
body {
  background: #f5f5f6;
}
.plugin-section {
  display: flex;
  justify-content: space-between;
  align-content: center;
  flex-wrap: wrap;
  .plugins-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 48px;
    margin-bottom: 16px;
    cursor: pointer;
    .box-inner {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: #fff;
      padding-bottom: 32px;
      .plugin-item {
        display: block;
      }
      .plugin-l {
        width: 48px;
        height: 48px;
      }
      .plugin-r {
        margin-left: 40px;
        h2 {
          font-size: 18px;
          line-height: 25px;
          padding-top: 30px;
        }
        p:first-of-type {
          font-size: 12px;
          padding-top: 4px;
          line-height: 17px;
          color: #8C8C8C;
        }
        p:last-of-type {
          font-size: 12px;
          padding-top: 18px;
          line-height: 17px;
          color: #00c1de;
        }
      }
    }
  }
}
</style>
