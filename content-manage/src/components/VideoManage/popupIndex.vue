<template>
  <el-container id="videoContent-manage">
    <el-aside
      class="tree-aside"
      style="width:250px;height:686px;border-right:1px solid rgb(229, 229, 229);border-bottom:1px solid rgb(229, 229, 229);"
    >
      <h4 class="pic-type-title"><span>视频分类</span></h4>
      <m-tree
        style="height:calc(100% - 59px);padding-top:8px"
        ref="myTree"
        :treeResult="treeResult"
        :list-options="picSearchOptions"
        :isPopup="isPopup"
        :isSecond="isSecond"
        @getList="getList"
        @chooseCategoryNode="chooseNode"
        @create="newCategory"
        @batchRemove="batchRemoveCategory"
        @rename="renameCategory"
        @modifyNode="modifyNodeCategory"
      ></m-tree>
    </el-aside>

    <el-main style="padding:0">
      <list-header
        v-if="$store.state.dashboard.isContentwrite"
        :count-pic="countPic"
        :display-name="displayName"
        :pic-search-options="picSearchOptions"
        :is-batch-header-show="isBatchHeaderShow"
        :content-type="contentType"
        @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
        @getPicList="getList"
        @batchDelete="batchDelete"
        @batchMove="batchMove"
      ></list-header>
      <el-main style="padding:0px 24px">
        <List
          ref="tableList"
          :img-page-result="imgPageResult"
          :pic-search-options="picSearchOptions"
          :tree-result="treeResult"
          @getChecked="getChecked"
          @getList="getList"
          @changeCategory="changeCategoryPic"
          @rename="renamePic"
          @batchRemove="batchRemoveItem"
          @moveClassify="moveClassify"
          @handleSelectionChange="handleSelectionChange"
        ></List>
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
          <span slot="title-text">移动视频</span>
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
            <button @click="updateCategoryPic" class="cl-button cl-button--small cl-button--primary">确定</button>
            <button @click="cancelUpdateCategor" class="cl-button cl-button--small cl-button--primary_notbg">取消</button>
          </div>
        </right-pannel>
      </el-main>
      <el-footer>
        <slot name="modal-footer"></slot>
      </el-footer>
    </el-main>

    <el-dialog title="上传" :visible.sync="dialogTableVisible" :modal-append-to-body="false">
      <span slot="title">
        <span class="fs14">
          上传{{displayName}}
          <el-tooltip
            class="item"
            effect="dark"
            placement="right"
            content="一次最多可上传10个视频，单个视频大小不超过2G"
          >
            <i class="iconfont iconyiwen"></i>
          </el-tooltip>
        </span>
      </span>
      <chunk-upload
        v-if="dialogTableVisible"
        :tree-result="treeResult"
        :displayName="displayName"
        :uploadType="contentType"
        :node-data="nodeData"
        :apiHost="apiHost"
        @getList="getList"
        @getTree="getTree"
        @closeDialog="closeDialog"
      />
      <!-- :accept="'video/*'" -->
    </el-dialog>
  </el-container>
</template>
<script>
import MTree from "@/components/common/MTree";
import ListHeader from "@/components/FileManage/ListHeader";
import ChunkUpload from "@/components/common/ChunkUpload";
import SelectTree from "@/components/common/SelectTree";
import RightPannel from "@/components/common/RightPannel";
import List from "./popupList";
import environment from "@/environment/index.js";
import * as videoManageApi from "@/api/request/videoManageApi";
import * as videoCategoryManageApi from "@/api/request/videoCategoryManageApi";

export default {
  props: {
    isGrid: {
      type: Boolean,
      default: false
    },
    isPopup: {
      type: Boolean,
      default: false
    },
    isSecond: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MTree,
    ListHeader,
    List,
    ChunkUpload,
    RightPannel,
    SelectTree
  },
  data() {
    return {
      displayName: "视频",
      contentType: "Video",
      nodeData: {
        label: "全部分类",
        id: 0
      },
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
      apiHost: environment.contentApi,
      picSearchOptions: {
        pageSize: 10,
        pageIndex: 1,
        orderByType: 1,
        isDescending: true,
        categoryIdList: [],
        keyword: "",
        isDelete: false
      },
      checkedList: []
    };
  },
  mounted() {
    this.getList();
    this.getTree();
  },
  methods: {
    getChecked(checkedList) {
      this.checkedList = checkedList;
      this.$emit("getCheckedList", this.checkedList);
    },
    // 获取列表
    async getList(node) {
      this.$Loading.show();
      if (node) {
        this.nodeData = node; // 上传图片所需
      }
      let { data } = await videoManageApi.getList(this.picSearchOptions);
      this.$Loading.hide();
      this.getTree();
      this.imgPageResult = data;
    },
    // 批量删除列表
    async batchRemoveItem(idlist) {
      this.$confirm(
        `删除后，${this.displayName}将被移动到回收站，可在回收站中恢复，是否确定删除？`,
        "提示",
        {
          iconClass: "icon-warning",
          callback: async action => {
            if (action === "confirm") {
              let { status } = await videoManageApi.batchRemove(true, idlist);
              if (status === 200) {
                this.$notify({
                  customClass: "notify-success",
                  message: `删除成功!`,
                  showClose: false,
                  duration: 1500
                });
                this.getList();
                this.getTree();
              }
            }
          }
        }
      );
    },
    resetCategoryId() {
      this.picSearchOptions.categoryIdList = [];
      this.getList();
    },

    async renameCategory(id, newName) {
      await videoCategoryManageApi.rename(id, newName);
      this.getTree();
    },
    async modifyNodeCategory(id, parentId, idOrderByArr) {
      await videoCategoryManageApi.modifyNode(id, parentId, idOrderByArr);
      this.getTree();
    },

    switchUploadBoxShowStatus(uploadImg) {
      this.dialogTableVisible = !this.dialogTableVisible;
      if (uploadImg === "uploadImg") this.getList();
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
      let categoryId = this.moveToClassiFy
        ? this.moveToClassiFy.id
        : this.curImgInfo.categoryId;
      let idList =
        this.idsList.length > 0 ? this.idsList : [this.curImgInfo.id];
      this.changeCategoryPic(categoryId, idList);
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
      this.batchRemoveItem(this.idsList);
    },
    async renamePic(id, newname) {
      await videoManageApi.rename(id, newname);
      this.getList();
    },

    async changeCategoryPic(categoryId, idList) {
      let { status } = await videoManageApi.changeCategory(categoryId, idList);
      if (status == 200) {
        this.$notify({
          customClass: "notify-success",
          message: `移动成功!`,
          showClose: false,
          duration: 1500
        });
        this.isInvitationPanelShow = false;
        this.getList();
        this.getTree();
      }
    },
    async getTree() {
      let { data } = await videoCategoryManageApi.get();
      this.treeResult = data.treeArray;
      this.totalSum = data.totalSum;

      this.$refs.myTree.selectCategoryByNodeId(this.nodeData.id);
    },
    async newCategory(entity) {
      await videoCategoryManageApi.create(entity);
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
              let { status } = await videoCategoryManageApi.batchRemove(idList);
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
    // 关闭上传文件弹窗
    closeDialog() {
      this.dialogTableVisible = false;
    }
  },
  computed: {
    isInvitationlWidth() {
      return this.isInvitationPanelShow === true ? 331 : 0;
    },
    isBatchHeaderShow() {
      return this.idsList.length > 0 ? true : false;
    }
  }
};
</script>
<style scoped>
.el-dialog__wrapper /deep/ .el-dialog {
  width: 900px;
}
</style>
<style lang="scss" scoped>
// 文章 产品详情
// 设置的关键词
.keyword-list {
  // position: absolute;
  display: inline-block;
  z-index: 1;
  top: 50px;
  left: 0;
  width: 100%;
  border: $--border-base;
  padding: 5px;
  box-sizing: border-box;
  li {
    // word-break: break-all;
    // display: inline-block;
    // padding: 5px 10px;
    // margin: 0 5px 8px;
    // background: #609ee9;
    // border-radius: 30px;
    // font-size: 12px;
    // color: #fff;
    position: relative;
    word-break: break-all;
    cursor: pointer;
    display: inline-block;
    margin: 0 4px 4px 0px;
    min-height: 23px;
    line-height: 21px;
    padding: 0 26px 0 10px;
    font-size: $--font-size-small;
    vertical-align: top;
    background-color: #609ee9;
    border-radius: 16px;
    // border: 1px #609ee9 solid;
    color: #fff;
    overflow: hidden;

    i {
      color: #fff;
    }
    .el-icon-close {
      position: absolute;
      top: 2.5px;
      right: 0;
      bottom: 1px;
      min-height: 21px;
      height: 100%;

      margin-left: 6px;
      padding: 0px 10px;
      // border-left: 1px #5C9AE6 solid;
      display: block;
      // border-radius: 0 20px 20px 0;
      overflow: hidden;
      font-size: 16px;
    }
  }
}



.article-content {
  .content-item {
    padding: 21px 16px 20px;
    background: #fff;
    box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.03);
    margin-bottom: 16px;
    // overflow: hidden;
  }
  .content-title {
    padding-bottom: 20px;
    // height: 20px;
    font-size: $--font-size-small;
    font-weight: 600;
    color: rgba(38, 38, 38, 1);
    // line-height: 20px;
  }
  .set-article,
  .seo-key {
    padding-top: 0;
    padding-bottom: 0;
  }
}
// .select-sort {
//     display: inline-block;
//     width: 117px;
//     box-sizing: border-box;
//     height: 32px;
//     margin: 0 0 0 7px;
// }
.select-sort {
  padding-left: 16px;
}
.category {
  width: 300px;
  height: auto;
}
.quill-editor {
  //height: 500px;
}
.ql-container {
  height: 400px;
}
#videoContent-manage .tree-aside {
  height: auto;
}
#videoContent-manage {
  margin-top: 0;
}
#videoContent-manage .content-header {
  margin: 0;
  border: none;
}

</style>




