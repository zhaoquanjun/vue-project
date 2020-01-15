<template>
    <div class="videoManage">
        <el-header style="height:50px;">
            <div class="domain-menu">
                <el-tabs v-model="videoType" @tab-click="tabClick">
                    <el-tab-pane label="本地视频" name="local"></el-tab-pane>
                    <el-tab-pane label="阿里云视频" name="aliyun"></el-tab-pane>
                </el-tabs>
                <a :href="akskUrl">
                    <button class="cl-button cl-button--primary_notbg" v-show="videoType == 'aliyun'">修改AK/SK</button>
                </a>
            </div>
        </el-header>
        <el-container id="content-manage" style="margin-top:16px" v-show="videoType == 'local'">
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <span>{{displayName}}分类</span>
            </h4>

            <m-tree
                ref="myTree"
                :treeResult="treeResult"
                :list-options="picSearchOptions"
                @getList="getList"
                @chooseCategoryNode="chooseNode"
                @create="newCategory"
                @batchRemove="batchRemoveCategory"
                @rename="renameCategory"
                @modifyNode="modifyNodeCategory"
            ></m-tree>
        </el-aside>

        <el-main>
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
            <el-main>
                <List
                    ref="tableList"
                    :img-page-result="imgPageResult"
                    :pic-search-options="picSearchOptions"
                    :tree-result="treeResult"
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
            <el-footer style="height:auto">
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
    <div v-show="videoType == 'aliyun'">
        <aliyunVideo ref="aliyunVideo"></aliyunVideo>
    </div>
    </div>
</template>
<script>
import MTree from "@/components/common/MTree";
import ListHeader from "@/components/FileManage/ListHeader";
import ChunkUpload from "@/components/common/ChunkUpload";
import SelectTree from "@/components/common/SelectTree";
import RightPannel from "@/components/common/RightPannel";
import List from "./List";
import AliyunVideo from "./aliyunVideo";
import environment from "@/environment/index.js";
import { akskUrl } from "@/environment/index.js";
import * as videoManageApi from "@/api/request/videoManageApi";
import * as videoCategoryManageApi from "@/api/request/videoCategoryManageApi";

export default {
    props: {
        isGrid: {
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
        SelectTree,
        AliyunVideo
    },
    data() {
        return {
            videoType: "local",
            akskUrl: akskUrl,
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
            }
        };
    },
    mounted() {
        if(this.$route.query.aliyunVideo){
            this.videoType = "aliyun";
            this.$refs.aliyunVideo.init();
        }
        this.getList();
        this.getTree();
    },
    methods: {
        tabClick(item) {
            if(item.name == "aliyun"){
                this.$refs.aliyunVideo.init();
            }
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
                `删除后，网站中引用的${this.displayName}将被同步删除，同时${this.displayName}将被移动到回收站，是否确定删除？`,
                "提示",
                {
                    iconClass: "icon-warning",
                    callback: async action => {
                        if (action === "confirm") {
                            let {
                                status,
                                data
                            } = await videoManageApi.batchRemove(true, idlist);
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
        async getTree() {
            let { data } = await videoCategoryManageApi.get();
            this.treeResult = data.treeArray;
            this.totalSum = data.totalSum;
        },

        async changeCategoryPic(categoryId, idList) {
            let { data, status } = await videoManageApi.changeCategory(
                categoryId,
                idList
            );
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
        async renamePic(id, newname) {
            await videoManageApi.rename(id, newname);
            this.getList();
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
                            let {
                                status
                            } = await videoCategoryManageApi.batchRemove(
                                idList
                            );
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
            await videoCategoryManageApi.rename(id, newName);
            this.getTree();
        },
        async modifyNodeCategory(id, parentId, idOrderByArr) {
            await videoCategoryManageApi.modifyNode(id, parentId, idOrderByArr);
            this.getTree();
        },
        // 
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
        batchMove() {
            this.isInvitationPanelShow = true;
        },
        //批量删除
        batchDelete() {
            this.batchRemoveItem(this.idsList);
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

<style lang="scss" scoped>
@import "../style/contentDetail";
.videoManage {
    /deep/ .tree-aside {
        margin-left: 16px!important;
    }
    /deep/ .content-header {
        margin-bottom: 16px;
    }
    /deep/ .aside-tree .el-scrollbar {
        height: calc(100vh - 230px);
    }
}
.domain-menu {
  position: relative;
  height: 50px;
  background: $--color-white;
  border-radius: $--border-radius-base;
  border: $--border-base;
  margin: 24px 16px 0;
  .cl-button {
    position: absolute;
    right: 16px;
    top: 9px;
  }
}
.domain-menu /deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
.domain-menu /deep/ .el-tabs__active-bar.is-top {
  width: 0 !important;
}
.el-tabs /deep/ .el-tabs__item {
  height: 50px;
  line-height: 50px;
  margin: 0 24px;
  padding: 0;
  color: $--color-text-primary;
}
.el-tabs /deep/ .el-tabs__item.is-active {
  border-bottom: 2px solid $--color-primary;
}
</style>




