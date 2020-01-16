<template>
    <el-container id="content-manage">
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <span>{{displayName}}分类</span>
            </h4>
            <m-tree
                ref="myTree"
                :tree-result="treeResult"
                :list-options="picSearchOptions"
                :isexpand="true"
                @getList="getList"
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
                @batchMove="batchMove"
                @batchDelete="batchDelete"
            ></list-header>

            <el-main>
                <List
                    ref="tableList"
                    :img-page-result="imgPageResult"
                    :pic-search-options="picSearchOptions"
                    :tree-result="treeResult"
                    :use-storage="useStorage"
                    @getList="getList"
                    @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
                    @changeCategory="changeCategoryPic"
                    @rename="renameItemTitle"
                    @batchRemove="batchRemovePic"
                    @moveClassify="moveClassify"
                    @handleSelectionChange="handleSelectionChange"
                ></List>
                <el-dialog
                    width="0"
                    style="z-index:10"
                    :close-on-click-modal="false"
                    :show-close="false"
                    :visible.sync="isInvitationPanelShow"
                ></el-dialog>
                <right-pannel
                    :style="{width:isInvitationlWidth+'px'}"
                    @closeRightPanel="closeRightPanel"
                >
                    <span slot="title-text">移动音频</span>
                    <div class="category-content">
                        <span name="cur-tip">移动至</span>
                    </div>
                    <SelectTree
                        v-if="isInvitationPanelShow"
                        :categoryName="curImgInfo.categoryName"
                        :categoryId="curImgInfo.categoryId"
                        :tree-result="treeResult"
                        @chooseNode="chooseNode"
                        :isexpand="true"
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
        <el-dialog
            title="上传"
            width="50%"
            :visible.sync="dialogTableVisible"
            :modal-append-to-body="false"
        >
            <span slot="title">
                <span class="fs14">
                    上传{{displayName}}
                    <el-tooltip
                        class="item"
                        effect="dark"
                        placement="right"
                        content="一次最多可上传10个音频，单个音频大小不超过50M"
                    >
                        <i class="iconfont iconyiwen"></i>
                    </el-tooltip>
                </span>
            </span>
            <chunk-upload
                v-if="dialogTableVisible"
                :tree-result="treeResult"
                :node-data="nodeData"
                :displayName="displayName"
                :uploadType="contentType"
                :apiHost="apiHost"
                @getList="getList"
                @getTree="getTree"
                @closeDialog="closeDialog"
            />
            <!-- :accept="'audio/*'" -->
        </el-dialog>
    </el-container>
</template>
<script>
import ChunkUpload from "@/components/common/ChunkUpload";
import MTree from "@/components/common/MTree";
import ListHeader from "@/components/FileManage/ListHeader";
import List from "./List";
import SelectTree from "@/components/common/SelectTree";
import RightPannel from "@/components/common/RightPannel";
import * as audioManageApi from "@/api/request/audioManageApi";
import * as audioCategoryManageApi from "@/api/request/audioCategoryManageApi";
import { getStorageUsage } from "@/api/request/contentCommonApi.js";
import environment from "@/environment/index.js";

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
        SelectTree
    },
    data() {
        return {
            displayName: "音频",
            contentType: "Audio",
            nodeData: {
                label: "全部分类",
                id: 0
            },
            componentId: "List",
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
            useStorage: {}
        };
    },
    mounted() {
        this.getList();
        this.getTree();
        this.getStorageUsage();
    },
    created(){
        this.keyupEnter();
    }, 
    methods: {
        keyupEnter(){
            document.onkeydown = e =>{
                if (e.keyCode === 13) {
                this.isInvitationPanelShow && this.updateCategoryPic();
                }
            }
        },
        // 获取使用的内容
        async getStorageUsage() {
            let { data, status } = await getStorageUsage("Audio");
            this.useStorage = data;
        },
        // 获取列表
        async getList(node) {
            this.$Loading.show();
            if (node) {
                this.nodeData = node; // 上传弹窗所需
            }
            let { data } = await audioManageApi.getList(this.picSearchOptions);
            this.$Loading.hide();
            this.getTree();
            this.imgPageResult = data;
        },
        // 批量删除列表
        async batchRemovePic(idlist) {
            this.$confirm(
                `删除后，网站中引用的音频将被同步删除，同时音频将被移动到回收站，是否确认删除？`,
                "提示",
                {
                 
                    iconClass: "icon-warning",
                    callback: async action => {
                        if (action === "confirm") {
                            let {
                                status,
                                data
                            } = await audioManageApi.batchRemove(true, idlist);
                            if (status === 200) {
                                this.$notify({
                                    customClass: "notify-success",
                                    message: `删除成功!`,
                                    showClose: false,
                                    duration: 1500
                                });
                                this.getTree();
                                this.getList();
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

        async changeCategoryPic(categoryId, idList) {
            let { data, status } = await audioManageApi.changeCategory(
                categoryId,
                idList
            );
            if (status == 200) {
                this.$notify({
                    customClass: "notify-success",
                    message: `移动成功!`,
                    showClose: false,
                    duration: 1000
                });
                this.isInvitationPanelShow = false;
                this.getList();
                this.getTree();
            }
        },
        async renameItemTitle(id, newname) {
            await audioManageApi.rename(id, newname);
            // this.getList();
        },
        async getTree() {
            let { data } = await audioCategoryManageApi.get();
            this.treeResult = data.treeArray;
            this.totalSum = data.totalSum;
            this.$refs.myTree.selectCategoryByNodeId(this.nodeData.id);
        },
        async newCategory(entity) {
            await audioCategoryManageApi.create(entity);
            this.getTree();
        },
        async batchRemoveCategory(idList) {
            this.$confirm(
                "若该分类下存在数据，删除后数据将自动移动到“全部分类”中，是否确认删除该分类？",
                "提示",
                {
                    iconClass: "icon-warning",
                    callback: async action => {
                        if (action === "confirm") {
                            let {
                                status
                            } = await audioCategoryManageApi.batchRemove(
                                idList
                            );
                            if (status === 200) {
                                this.getTree();
                                this.$notify({
                                    customClass: "notify-success",
                                    message: `删除成功!`,
                                    showClose: false,
                                    duration: 1000
                                });
                            }
                        } else {
                        }
                    }
                }
            );
        },
        async renameCategory(id, newName) {
            await audioCategoryManageApi.rename(id, newName);
            this.getTree();
        },
        async modifyNodeCategory(id, parentId, idOrderByArr) {
            await audioCategoryManageApi.modifyNode(id, parentId, idOrderByArr);
            this.getTree();
        },
        // 点击上传图片
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
            this.batchRemovePic(this.idsList);
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
    },
    watch: {}
};
</script>


<style lang="scss" scoped>
@import "../style/contentDetail";
</style>



