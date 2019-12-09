<template>
  <el-container>
    <el-header class="templateTitle" style="height:50px">
      <span class="titleText">控件分类</span>
      <div>
        <button class="cl-button cl-button--primary" @click="refresh">菜单更新</button>
        <button class="cl-button cl-button--primary_notbg" @click="createTemplatedialogShow">新增分类</button>
      </div>
    </el-header>
    <el-main class="contentWrap">
      <div>
        <List :listData="templateInfo" @deleteItem="deleteItem" @editItem="editItem" ref="list"></List>
      </div>
      <createCategoryDialog ref="createCategoryDialog" @getList="getList" ></createCategoryDialog>
    </el-main>
  </el-container>
</template>
<script>
import * as templateApi from "@/api/request/controlCategoryApi";
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
      this.$Loading.show();
      let { data } = await templateApi.getList();
      this.$Loading.hide();
      this.templateInfo = data;
    },
    editItem(row) {
      this.$refs.createCategoryDialog.showEditTemplate(row);
    },
    deleteItem(idList) {
      this.$confirm(`确定要删除分类吗？`, "提示", {
        iconClass: "icon-warning",
        callback: async action => {
          if (action === "confirm") {
            let { data, status } = await templateApi.deleteCategory(idList);
            if (status === 200) {
              this.getList();
              this.$notify({
                customClass: "notify-success",
                message: `分类删除成功`,
                duration: 2000,
                showClose: false
              });
            } else {
              this.$notify({
                customClass: "notify-error",
                message: "系统正忙，请稍后再试！",
                duration: 2000,
                showClose: false
              });
            }
          }
        }
      });
    },
    async refresh() {
      this.$confirm(`确定要更新菜单吗？`, "提示", {
        iconClass: "icon-warning",
        callback: async action => {
          if (action === "confirm") {
            let { data, status } = await templateApi.refresh();
            if (status === 200) {
              this.$notify({
                customClass: "notify-success",
                message: `更新成功`,
                duration: 2000,
                showClose: false
              });
            } else {
              this.$notify({
                customClass: "notify-error",
                message: "系统正忙，请稍后再试！",
                duration: 2000,
                showClose: false
              });
            }
          }
        }
      });
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


