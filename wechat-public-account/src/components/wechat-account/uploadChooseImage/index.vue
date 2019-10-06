<template>
  <el-container id="content-manage">
    <el-aside class="tree-aside"  style="border-right: 1px solid#e8eaf3;">
      <h4 class="pic-type-title">图片分类</h4>

      <m-tree
        :tree-result="treeResult"
        :img-page-result="imgPageResult"
        :pic-search-options="picSearchOptions"
        :isexpand="true"
        @getPicList="getPicList"
        @create="newCategory"
        @batchRemove="batchRemoveCategory"
        @rename="renameCategory"
        @modifyNode="modifyNodeCategory"
      ></m-tree>
    </el-aside>

    <el-main>
      <img-list-header
        :count-pic="countPic"
        :pic-search-options="picSearchOptions"
        :is-batch-header-show="isBatchHeaderShow"
        @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
        @getPicList="getPicList"
        @batchMove="batchMove"
        @batchDelete="batchDelete"
        @showType="showType"
      ></img-list-header>

      <el-main style="height: 540px; position: relative;">
        <component
          v-show="!loading"
          :is="componentId"
          :img-page-result="imgPageResult"
          :pic-search-options="picSearchOptions"
          :tree-result="treeResult"
          @getPicList="getPicList"
          @changeCategory="changeCategoryPic"
          @rename="renamePic"
          @batchRemove="batchRemovePic"
          @moveClassify="moveClassify"
          @handleSelectionChange="handleSelectionChange"
        ></component>
        <loading v-show="loading"></loading>
        <el-dialog
          width="0"
          style="z-index:10"
          :close-on-click-modal="false"
          :show-close="false"
          :visible.sync="isInvitationPanelShow"
          :modal-append-to-body="false"
        ></el-dialog>
        <right-pannel
          :style="{width:isInvitationlWidth+'px'}"
          @closeRightPanel="closeRightPanel"
          :tree-result="treeResult"
        >
          <span slot="title-text">移动图片分类</span>
          <div class="category-content">
            <span name="cur-tip">移动至</span>
          </div>
          <SelectTree
            :categoryName="curImgInfo.categoryName"
            :tree-result="treeResult"
            @chooseNode="chooseNode"
          />
          <div slot="footer" class="pannle-footer">
            <button @click="updateCategoryPic" class="sure">确定</button>
            <button @click="cancelUpdateCategor" class="cancel">取消</button>
          </div>
        </right-pannel>
      </el-main>
      <el-footer style="height: 40px; margin-top: 30px;">
        <slot name="modal-footer"></slot>
      </el-footer>
    </el-main>
    <el-dialog title="上传图片" :visible.sync="dialogTableVisible" :modal-append-to-body="false">
      <upload-pic
        @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
        :tree-result="treeResult"
        :upload-pic-url="uploadPicUrl"
      />
    </el-dialog>
  </el-container>
</template>
<script>
import { Message } from "element-ui";
import MTree from "./MTree";
import UploadPic from "./UploadPic";
import ImgListHeader from "./ImgListHeader";
import ImgList from "./ImgList";
import GridList from "./GridList";
import RightPannel from "./RightPannel";
import SelectTree from "./SelectTree";
import Loading from "_c/wechat-account/defineMenu/loading/loading";

import { getPicList, imgBatchRemove, changeCategory, imgRename, get, create, batchRemove, rename, modifyNode } from "@/api/request/account.js";
import environment from '@/environment/index.js';

export default {
  props: {
    isGrid: {
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
    SelectTree,
    Loading
  },
  data() {
    return {
      componentId: "GridList",
      isImgList: false,
      countPic: 0,
      curImgInfo: {},
      moveToClassiFy: "",
      categoryName: "", //当前选中的分类名字
      idsList: [],
      selectedImg: [],
      isInvitationPanelShow: false,
      imgPageResult: {},
      treeResult: null,
      dialogTableVisible: false,
      totalSum: 0,
      loading: false,
      uploadPicUrl: environment.imageApi + '/api/picture',
      picSearchOptions: {
        pageSize: 20,
        pageIndex: 1,
        orderByType: 1,
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
    this.getPicList({});
    this.getTree();
  },
  methods: {
    // 获取列表
    async getPicList() {
      this.loading = true;
      let { data } = await getPicList(this.picSearchOptions);
      this.imgPageResult = data;
      this.loading = false;
    },
    // 批量删除列表
    async batchRemovePic(idlist) {
      this.$confirm("删除后，图片将被移动到回收站，可在回收站？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: async action => {
          if (action === "confirm") {
            let { status } = await imgBatchRemove(true, idlist);
            if (status === 200) {
              this.getTree();
              Message.success("删除成功!");
              this.getPicList();
            }
          } else {
            Message.info("已取消删除!");
          }
        }
      });
    },
    resetCategoryId() {
      this.picSearchOptions.categoryIdList = [];
      this.getPicList();
    },

    async changeCategoryPic(categoryId, idList) {
      let { status } = await changeCategory(categoryId, idList);
      if (status == 200) {
        Message.success("移动成功!");
        this.isInvitationPanelShow = false;
        this.getPicList();
      }
    },
    async renamePic(id, newname) {
      await imgRename(id, newname);
      this.getPicList();
    },
    async getTree() {
      let { data } = await get();
      this.treeResult = data.treeArray;
      this.totalSum = data.totalSum;
    },
    async newCategory(entity) {
      await create(entity);
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
          callback: async action => {
            if (action === "confirm") {
              let { status } = await batchRemove(idList);
              if (status === 200) {
                this.getTree();
                Message.success("删除成功!");
              }
            } else {
              Message.info("已取消删除");
            }
          }
        }
      );
    },
    async renameCategory(id, newName) {
      await rename(id, newName);
      this.getTree();
    },
    async modifyNodeCategory(id, parentId, idOrderByArr) {
      await modifyNode(id, parentId, idOrderByArr);
      this.getTree();
    },

    switchUploadBoxShowStatus(uploadImg) {
      this.dialogTableVisible = !this.dialogTableVisible;
      if (uploadImg === "uploadImg") this.getPicList({});
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
      this.$emit("getImgInfo", list);
    },
    // 点击确定按钮 更新图片分类
    updateCategoryPic() {
      if (!this.moveToClassiFy) {
        Message.error("请选择移动的分类!");
        return;
      }
      let categoryId = this.moveToClassiFy.id;
      let idList = [];
      if (this.idsList.length > 0) {
        idList = this.idsList;
      } else {
        idList.push(this.curImgInfo.id);
      }
      this.changeCategoryPic(categoryId, idList);
    },
    // 取消移动分类 关闭panel
    cancelUpdateCategor() {
      this.isInvitationPanelShow = false;
      this.moveToClassiFy = this.curImgInfo = "";
    },
    //批量移动
    batchMove() {
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
        this.getPicList();
      } else {
        this.componentId = "GridList";
        this.picSearchOptions.pageSize = 20;
        this.getPicList();
      }
    }
  },
  computed: {
    isInvitationlWidth() {
      return this.isInvitationPanelShow === true ? 331 : 0;
    },
    isBatchHeaderShow() {
      return this.idsList.length > 1 ? true : false;
    }
  },
  watch: {}
};
</script>
<style>
#content-manage {
  height: 90% !important;
  max-height: 700px !important;
}
#content-manage .el-main {
  padding: 0;
}
</style>

<style lang="scss" scoped>
.pic-type-title {
  height: 70px;
  line-height: 70px;
  padding-left: 16px;
  border-bottom: 1px solid #e8eaf3;
  border-right: 1px solid #e8eaf3;
  box-sizing: border-box;
}
.title-item {
  padding: 28px 0 12px 12px;
}
</style>



