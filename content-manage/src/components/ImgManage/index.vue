<template>
  <el-container id="content-manage">
    <el-aside class="tree-aside">
      <h4 class="pic-type-title">
        <span>图片分类</span>
      </h4>

      <m-tree
        ref="myTree"
        :type="'image'"
        :tree-result="treeResult"
        :list-options="picSearchOptions"
        :isexpand="true"
        :isPopup="isPopup"
        @getList="getList"
        @create="newCategory"
        @batchRemove="batchRemoveCategory"
        @rename="renameCategory"
        @modifyNode="modifyNodeCategory"
      ></m-tree>
    </el-aside>
    <el-main style="overflow: hidden;">
      <img-list-header
        v-if="$store.state.dashboard.isContentwrite"
        :count-pic="countPic"
        :pic-search-options="picSearchOptions"
        :is-batch-header-show="isBatchHeaderShow"
        :is-grid="isGrid"
        :isPopup="isPopup"
        @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
        @getList="getList"
        @batchMove="batchMove"
        @batchDelete="batchDelete"
        @showType="showType"
      ></img-list-header>
      <el-main>
        <component
          ref="imgList"
          :is="componentId"
          :img-page-result="imgPageResult"
          :pic-search-options="picSearchOptions"
          :tree-result="treeResult"
          :multiple="multiple"
          @getList="getList"
          @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
          @rename="renamePic"
          @batchRemove="batchRemovePic"
          @moveClassify="moveClassify"
          @handleSelectionChange="handleSelectionChange"
        ></component>
        <el-dialog
          width="0"
          style="z-index:10"
          :close-on-click-modal="false"
          :show-close="false"
          :visible.sync="isInvitationPanelShow"
          :modal-append-to-body="false"
        ></el-dialog>
        <right-pannel
          :style="{ width: isInvitationlWidth + 'px' }"
          @closeRightPanel="closeRightPanel"
          :tree-result="treeResult"
        >
          <span slot="title-text">移动图片</span>
          <div class="category-content">
            <span name="cur-tip">移动至</span>
          </div>
          <SelectTree
            v-if="isInvitationPanelShow"
            :categoryName="curImgInfo.categoryName"
            :categoryId="curImgInfo.categoryId"
            :tree-result="treeResult"
            @chooseNode="chooseNode"
          ></SelectTree>
          <div slot="footer" class="pannel-footer">
            <button
              @click="updateCategoryPic"
              class="cl-button cl-button--small cl-button--primary"
            >
              确定
            </button>
            <button
              @click="cancelUpdateCategor"
              class="cl-button cl-button--small cl-button--primary_notbg"
            >
              取消
            </button>
          </div>
        </right-pannel>
      </el-main>
      <el-footer style="height:auto">
        <slot name="modal-footer"></slot>
      </el-footer>
    </el-main>
    <el-dialog
      title="上传图片"
      width="886px"
      :visible.sync="dialogTableVisible"
      :modal-append-to-body="false"
      class="uploadImgDialog"
    >
      <span slot="title">
        <span class="fs14">
          上传图片
          <el-tooltip
            class="item"
            effect="dark"
            content="一次可上传60张图片，单张图片大小不超过10MB"
            placement="right"
          >
            <i class="iconfont iconyiwen"></i>
          </el-tooltip>
        </span>
      </span>
      <upload-pic
        v-if="dialogTableVisible"
        @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
        @getTree="getTree"
        :tree-result="treeResult"
        :upload-pic-url="uploadPicUrl"
        :node-data="nodeData"
      />
    </el-dialog>
  </el-container>
</template>
<script>
import MTree from "@/components/common/MTree";

import UploadPic from "./UploadPic";
import ImgListHeader from "./ImgListHeader";
import ImgList from "./ImgList";
import GridList from "./GridList";
import RightPannel from "@/components/common/RightPannel";
import SelectTree from "@/components/common/SelectTree";
import * as imgManageApi from "@/api/request/imgManageApi";
import * as imgCategoryManageApi from "@/api/request/imgCategoryManageApi";
import environment from "@/environment/index.js";

export default {
  props: {
    isGrid: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    isPopup: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MTree,
    ImgListHeader,
    ImgList,
    GridList,
    UploadPic,
    RightPannel,
    SelectTree
  },
  data() {
    return {
      nodeData: { id: 0, label: "全部分类" },
      componentId: "ImgList",
      isImgList: false,
      countPic: 0,
      curImgInfo: "",
      moveToClassiFy: "",
      categoryName: "", //当前选中的分类名字
      idsList: [],
      selectedImg: [],
      isInvitationPanelShow: false,
      imgPageResult: {},
      treeResult: null,
      dialogTableVisible: false,
      totalSum: 0,
      uploadPicUrl: environment.uploadPicUrl,
      picSearchOptions: {
        pageSize: 10,
        pageIndex: 1,
        orderByType: "CreateTime",
        isDescending: true,
        categoryIdList: [],
        keyword: "",
        isDelete: false
      }
    };
  },
  mounted() {
    if (this.isGrid) {
      this.componentId = "GridList";
    }
    this.getList();
  },
  created() {
    this.keyupEnter();
  },
  methods: {
    keyupEnter() {
      document.onkeydown = e => {
        if (e.keyCode === 13) {
          this.isInvitationPanelShow && this.updateCategoryPic();
        }
      };
    },
    // 获取列表
    async getList(node) {
      this.$Loading.show();
      if (node) this.nodeData = node; // 上传图片所需
      let { data } = await imgManageApi.getList(this.picSearchOptions);
      this.$Loading.hide();
      this.getTree();
      this.imgPageResult = data;
      this.imgPageResult.list.forEach((item, index) => {
        item.createTimeStr = this.imgPageResult.list[index].createTimeStr.split(
          " "
        )[0];
      });
    },
    // 批量删除列表
    async batchRemovePic(idlist) {
      let message = [];
      message.push(
        this.$createElement(
          "p",
          { style: "color: #262626" },
          `删除后，图片将被移动到回收站，可在回收站中恢复，是否确定删除？`
        )
      );
      message.push(
        this.$createElement(
          "p",
          { style: "color: #8C8C8C" },
          "删除后，使用图片的地方将受影响"
        )
      );
      this.$confirm("提示", {
        title: "提示",
        message: this.$createElement("div", null, message),
        iconClass: "icon-warning",
        customClass: "large",
        showCancelButton: true,
        closeOnClickModal: false,
        callback: async action => {
          if (action === "confirm") {
            idlist.forEach(item => {
              if (item.id == this.curImgInfo.id) {
                this.curImgInfo = "";
                this.$emit("getImgInfo", "");
              }
            });
            let { status } = await imgManageApi.batchRemove(true, idlist);
            if (status === 200) {
              this.getTree();
              this.$notify({
                customClass: "notify-success",
                message: `删除成功!`,
                showClose: false,
                duration: 1500
              });
              this.clearSelectedList();
              this.$emit("getImgInfo", "");
              this.getList();
            }
          }
        }
      });
    },

    // 清空选中的列表
    clearSelectedList() {
      this.$refs.imgList && this.$refs.imgList.clearSelectedList();
    },
    async changeCategoryPic(categoryId, idList, flag) {
      let { status } = await imgManageApi.changeCategory(categoryId, idList);
      if (status == 200) {
        if (flag) {
          this.$notify({
            customClass: "notify-success", //  notify-success ||  notify-error
            message: `移动成功!`,
            showClose: false,
            duration: 1500
          });
        }

        this.isInvitationPanelShow = false;
        this.getList();
      }
    },
    async renamePic(id, newname) {
      await imgManageApi.rename(id, newname);
      // this.getList();
    },
    async getTree() {
      let { data } = await imgCategoryManageApi.get();
      this.treeResult = data.treeArray;
      this.totalSum = data.totalSum;
      this.$refs.myTree.selectCategoryByNodeId(this.nodeData.id);
    },
    async newCategory(entity) {
      await imgCategoryManageApi.create(entity);
      this.getTree();
    },
    async batchRemoveCategory(idList) {
      this.$confirm(
        "若该分类下存在数据，删除后数据将自动移动到“全部分类”中，是否确认删除该分类？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "medium",
          iconClass: "icon-warning",
          callback: async action => {
            if (action === "confirm") {
              let { status } = await imgCategoryManageApi.batchRemove(idList);
              if (status === 200) {
                this.getTree();

                this.$notify({
                  customClass: "notify-success",
                  message: `删除成功!`,
                  showClose: false,
                  duration: 1500
                });
              }
            }
          }
        }
      );
    },
    async renameCategory(id, newName) {
      await imgCategoryManageApi.rename(id, newName);
      this.getTree();
    },
    async modifyNodeCategory(id, parentId, idOrderByArr) {
      await imgCategoryManageApi.modifyNode(id, parentId, idOrderByArr);
      this.getTree();
    },
    // 点击上传图片
    switchUploadBoxShowStatus(uploadImg) {
      this.dialogTableVisible = !this.dialogTableVisible;
      if (uploadImg === "uploadImg") {
        this.getList();
        this.picSearchOptions.keyword = "";
      }
    },
    moveClassify(b, data) {
      this.isInvitationPanelShow = b;
      this.curImgInfo = data;
    },
    closeRightPanel(b) {
      this.isInvitationPanelShow = b;
    },
    //选择移动分类时的节点
    chooseNode(node) {
      this.moveToClassiFy = node;
    },
    // 批量更新的选中数量
    handleSelectionChange(list) {
      this.idsList = [];
      this.countPic = list.length;
      if (list.length < 1) return;
      list.forEach(item => {
        this.idsList.push(item.id);
      });
      this.selectedImg = list;
      this.$emit("getImgInfo", list); // img插件所需
    },
    // 点击确定按钮 更新图片分类
    updateCategoryPic() {
      let categoryId = this.moveToClassiFy.id;
      let idList = [];
      let flag = true;
      if (this.idsList.length > 0) {
        idList = this.idsList;
      } else {
        idList.push(this.curImgInfo.id);
      }
      if (
        (categoryId === 0 || categoryId === undefined) &&
        idList.length === 1
      ) {
        flag = false;
      } else {
        flag = true;
      }
      this.changeCategoryPic(categoryId || 0, idList, flag);
      return false;
    },
    // 取消移动分类 关闭panel
    cancelUpdateCategor() {
      this.isInvitationPanelShow = false;
      this.moveToClassiFy = this.curImgInfo = "";
    },
    //批量移动

    batchMove(isHeader) {
      if (isHeader) {
        this.curImgInfo = {
          categoryName: "全部分类",
          categoryId: 0
        };
      }
      this.isInvitationPanelShow = true;
    },
    //批量删除
    batchDelete() {
      this.batchRemovePic(this.idsList);
    },
    //展示方式
    showType(val) {
      if (val === "list") {
        this.componentId = "ImgList";
        this.picSearchOptions.pageSize = 10;
        this.getList();
      } else {
        this.componentId = "GridList";
        this.picSearchOptions.pageSize = 20;
        this.getList();
      }
    }
  },
  computed: {
    isInvitationlWidth() {
      return this.isInvitationPanelShow === true ? 331 : 0;
    },
    isBatchHeaderShow() {
      return this.idsList.length > 0 ? true : false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
@import "../style/contentDetail";
.el-dialog__wrapper /deep/ .el-dialog {
  margin-top: 70px !important;
}
.uploadImgDialog /deep/ .el-dialog__header {
  padding: 0 20px;
  height: 44px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-dialog__headerbtn {
    top: 7px;
  }
}
</style>
