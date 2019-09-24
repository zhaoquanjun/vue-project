<template>
    <el-container id="content-manage">
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <span>图片分类</span>
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
        <el-main style="overflow: hidden;">
            <img-list-header
                v-if="$store.state.dashboard.isContentwrite"
                :count-pic="countPic"
                :pic-search-options="picSearchOptions"
                :is-batch-header-show="isBatchHeaderShow"
                :is-grid="isGrid"
                @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
                @getList="getList"
                @batchMove="batchMove"
                @batchDelete="batchDelete"
                @showType="showType"
            ></img-list-header>
            <el-main>
                <component
                    :is="componentId"
                    :img-page-result="imgPageResult"
                    :pic-search-options="picSearchOptions"
                    :tree-result="treeResult"
                    :multiple="multiple"
                    @getList="getList"
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
                    :style="{width:isInvitationlWidth+'px'}"
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
                    <div slot="footer" class="pannle-footer">
                        <span @click="updateCategoryPic" class="sure">确定</span>
                        <button @click="cancelUpdateCategor" class="cancel">取消</button>
                    </div>
                </right-pannel>
            </el-main>
            <el-footer >
                <slot name="modal-footer"></slot>
            </el-footer>
        </el-main>
        <el-dialog
            title="上传图片"
            width="886px"
            :visible.sync="dialogTableVisible"
            :modal-append-to-body="false"
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
        <loading></loading>
    </el-container>
</template>
<script>
import MTree from "@/components/common/MTree";
// import loading from "@/components/common/loading";
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
    },
    components: {
        MTree,
        ImgListHeader,
        ImgList,
        GridList,
        UploadPic,
        RightPannel,
        SelectTree,
        loading
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
    methods: {
        // 获取列表
        async getList(node) {
            const loading = this.$loading({
                lock: true,
                spinner: "loading-icon",
                background: "rgba(255, 255, 255, 0.75)"
            });
            if (node) this.nodeData = node; // 上传图片所需
            let { data } = await imgManageApi.getList(this.picSearchOptions);
            loading.close();
            this.getTree();
            this.imgPageResult = data;
            this.imgPageResult.list.forEach((item, index) => {
                item.createTimeStr = this.imgPageResult.list[
                    index
                ].createTimeStr.split(" ")[0];
            });
        },
        // 批量删除列表
        async batchRemovePic(idlist) {
            this.$confirm(
                "删除后，图片将被移动到回收站，可在回收站中恢复，是否确定删除？",
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
                                status,
                                data
                            } = await imgManageApi.batchRemove(true, idlist);
                            if (status === 200) {
                                this.getTree();
                                this.$notify({
                                    customClass: "notify-success",
                                    message: `删除成功!`,
                                    showClose: false,
                                    duration: 1500
                                });
                                this.getList();
                            }
                        }
                    }
                }
            );
        },
        // resetCategoryId() {
        //     this.picSearchOptions.categoryIdList = [];
        //     this.getList();
        // },

        async changeCategoryPic(categoryId, idList) {
            let { data, status } = await imgManageApi.changeCategory(
                categoryId,
                idList
            );
            if (status == 200) {
                this.$notify({
                    customClass: "notify-success", //  notify-success ||  notify-error
                    message: `移动成功!`,
                    showClose: false,
                    duration: 1500
                });
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
                        console.log(action);
                        if (action === "confirm") {
                            let {
                                status
                            } = await imgCategoryManageApi.batchRemove(idList);
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
            console.log(data, "data--=======");
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
            if (this.idsList.length > 0) {
                idList = this.idsList;
            } else {
                idList.push(this.curImgInfo.id);
            }
            this.changeCategoryPic(categoryId || 0, idList);
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
            console.log(this.idsList.length);
            return this.idsList.length > 0 ? true : false;
        }
    },
    watch: {}
};
</script>

<style lang="scss" scoped>
@import "../style/contentDetail";
</style>



