<template>
    <el-container id="content-manage">
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <span>{{displayName}}分类</span>
            </h4>

            <m-tree
                ref="myTree"
                :treeResult="treeResult"
                :list-options="picSearchOptions"
                @getList="getPicList"
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
                @getPicList="getPicList"
                @batchDelete="batchDelete"
                @batchMove="batchMove"
            ></list-header>
            <el-main>
                <List
                    ref="tableList"
                    :img-page-result="imgPageResult"
                    :pic-search-options="picSearchOptions"
                    :tree-result="treeResult"
                    @getPicList="getPicList"
                    @changeCategory="changeCategoryPic"
                    @rename="renamePic"
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
                    :modal-append-to-body="false"
                >
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

                        <div slot="footer" class="pannle-footer">
                            <button @click="updateCategoryPic" class="sure">确定</button>
                            <button @click="cancelUpdateCategor" class="cancel">取消</button>
                        </div>
                    </right-pannel>
                </el-dialog>
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
                :accept="'video/*'"
                @getList="getPicList"
                @getTree="getTree"
                @closeDialog="closeDialog"
            />
        </el-dialog>
    </el-container>
</template>
<script>
import ChunkUpload from "@/components/common/ChunkUpload";
import MTree from "@/components/ImgManage/MTree";
import ListHeader from "@/components/FileManage/ListHeader";
import List from "./List";
import SelectTree from "@/components/common/SelectTree";
import RightPannel from "_c/ImgManage/RightPannel";
import * as videoManageApi from "@/api/request/videoManageApi";
import * as videoCategoryManageApi from "@/api/request/videoCategoryManageApi";
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
            displayName: "视频",
            contentType: "Video",
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
            }
        };
    },
    mounted() {
        this.getPicList();
        this.getTree();
    },
    methods: {
        // 获取列表
        async getPicList(node) {
            const loading = this.$loading({
                lock: true,
                spinner: "loading-icon",
                background: "rgba(255, 255, 255, 0.75)"
            });
            if (node) {
                this.nodeData = node; // 上传图片所需
            }
            let { data } = await videoManageApi.getPicList(
                this.picSearchOptions
            );
            loading.close();
            this.getTree();
            this.imgPageResult = data;
        },
        // 批量删除列表
        async batchRemovePic(idlist) {
            this.$confirm(
                `删除后，${this.displayName}将被移动到回收站，可在回收站中恢复，是否确定删除？`,
                "提示",
                {
                    iconClass: "icon-warning",
                    callback: async action => {
                        console.log(action);
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
                                this.getPicList();
                                this.getTree();
                            }
                        }
                    }
                }
            );
        },
        resetCategoryId() {
            this.picSearchOptions.categoryIdList = [];
            this.getPicList();
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
                this.getPicList();
                this.getTree();
            }
        },
        async renamePic(id, newname) {
            await videoManageApi.rename(id, newname);
            this.getPicList();
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
                        console.log(action);
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
        // 点击上传图片
        switchUploadBoxShowStatus(uploadImg) {
            this.dialogTableVisible = !this.dialogTableVisible;
            if (uploadImg === "uploadImg") this.getPicList();
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
            console.log(this.idsList.length);
            return this.idsList.length > 0 ? true : false;
        }
    },
    watch: {}
};
</script>
<style scoped>
.el-dialog__wrapper /deep/ .el-dialog {
    width: 900px;
}
</style>
<style lang="scss" scoped>
@import "../style/contentDetail";
</style>




