<template>
  <el-header class="content-header">
    <div class="seachInput head-item">
      <el-input size="small" placeholder="产品名称" class="input-with-select">
        <el-button slot="append">
          <svg-icon icon-class="search-icon"></svg-icon>
        </el-button>
      </el-input>
    </div>
    <div class="head-item head-middle">
      <span>排序</span>
      <span class="select-sort">
        <el-select size="small" v-model="value" placeholder="请选择" @change="changeSelected">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
      <span @click="swithOrder">
        <svg-icon v-if="(this.order ==='asc')" icon-class="top-arrow"></svg-icon>
        <svg-icon v-else icon-class="off-arrow"></svg-icon>
      </span>
      <span class="list-mode mode-item">
        <svg-icon icon-class="list-mode "></svg-icon>
      </span>
      <span class="grid-mode mode-item">
        <svg-icon icon-class="grid-mode"></svg-icon>
      </span>
    </div>
    <div class="head-item head-right">
      <span class="upload-wrap">
        <svg-icon icon-class="upload-img"></svg-icon>
      </span>
    </div>
  </el-header>
</template>
<script>
export default {
  props: ["searchOption"],
  data() {
    return {
      options: [
        {
          value: "name",
          label: "产品名"
        },
        {
          value: "price",
          label: "价格"
        },
        {
          value: "time",
          label: "时间"
        }
      ],
      value: "name",
      order: "asc"
    };
  },
  methods: {
    changeSelected(value) {
      this.value = value;
    },
    swithOrder() {
      this.order = this.order === "asc" ? "desc" : "asc";
    },
    getList() {
      this.searchOption.sortOrder = this.value + "_" + this.order;
      this.$emit("getProductList");
    }
  }
};
</script>
<style <style lang="scss" scoped>
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8eaf3;
  background: #fff;
  margin-bottom: 24px;
}
.seachInput {
  display: inline-block;
  width: 248px;
  /* height: 36px; */
  box-sizing: border-box;
  margin-left: 22px;
}
.select-sort {
  display: inline-block;
  width: 117px;
  box-sizing: border-box;
  height: 32px;
  margin: 0 16px 0 7px;
}
.head-item {
  display: inline-block;
  flex: none;
}
.mode-item {
  display: inline-block;
  width: 45px;
  padding: 8px 0;
  text-align: center;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
.list-mode {
  border-right: none;
}
.head-right,
.head-middle {
  float: right;
}
.upload-wrap {
  margin-right: 25px;
  cursor: pointer;
  display: inline-block;
  width: 45px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #00c1de;
}
</style>
