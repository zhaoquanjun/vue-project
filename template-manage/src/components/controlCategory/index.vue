<template>
  <el-container>
    <el-header class="templateTitle" style="height:50px">
      <span class="titleText">控件分类</span>
      <button class="cl-button cl-button--primary" @click="createTemplatedialogShow">新增分类</button>
    </el-header>
    <el-main class="contentWrap">
      <div>
        <List :listData="templateInfo" ref="list"></List>
      </div>
      <createCategoryDialog ref="createCategoryDialog"></createCategoryDialog>
    </el-main>
  </el-container>
</template>
<script>
import * as templateApi from "@/api/request/normalControlApi";
import List from "./controlCategoryList";
import CreateCategoryDialog from "./createCategoryDialog";
export default {
  data() {
    return {
      templateInfo: []
    };
  },
  components: {
    List,
    CreateCategoryDialog
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      //   this.$Loading.show();
      //   let para = {
      //     controlName: this.searchValue,
      //     firstType: this.firstTypeValue,
      //     secondType: this.secondTypeValue,
      //     ControlState: this.statusValue
      //   };
      //   let { data } = await templateApi.getNormalControls(para);
      //   this.$Loading.hide();
      //   this.templateInfo = data;
      //   console.log(data);
    },
    createTemplatedialogShow() {
      this.$refs.createCategoryDialog.showSettingTemplate();
    }
  }
};
</script>
<style lang="scss" scoped>
.templateTitle {
  height: 50px;
  padding: 0 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .titleText {
    font-size: $--font-size-base;
    font-weight: 600;
    color: $--color-text-primary;
    border-left: 2px solid $--color-primary;
    padding-left: 10px;
  }
}
.contentWrap {
  margin: 0 16px;
}
</style>


