<template>
    <el-container id="content-manage">
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <span>{{displayName}}分类</span>
            </h4>
            <!-- <h5 class="title-item" @click="resetCategoryId">全部分类</h5> -->
            <!-- <button @click="newCategory({DisplayName:'Test'})">新增</button> -->
            <m-tree
                :tree-result="treeResult"
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
            <list-header
                :count-pic="countPic"
                :display-name="displayName"
                :pic-search-options="picSearchOptions"
                :is-batch-header-show="isBatchHeaderShow"
                @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
                @getPicList="getPicList"
                @batchMove="batchMove"
                @batchDelete="batchDelete"
            ></list-header>

            <el-main>
                <component
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
                    <span slot="title-text">编辑文件</span>
                    <el-form
                        :model="ruleForm"
                        ref="ruleForm"
                        label-width="70px"
                        class="demo-ruleForm"
                    >
                        <el-form-item label="文件名称" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="文件类型" prop="delivery">
                            <SelectTree
                                :categoryName="curImgInfo.categoryName"
                                :tree-result="treeResult"
                                @chooseNode="chooseNode"
                                :isexpand="true"
                            ></SelectTree>
                        </el-form-item>
                        <el-form-item label="下载链接">
                            <div class="download-link">
                                <span>www.baodu.com</span>
                                <button class="btn-small btn-bglightblue">复制</button>
                            </div>
                        </el-form-item>
                        <el-form-item label="下载密码">
                            <el-switch v-model="ruleForm.delivery"></el-switch>
                            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>

                    <div slot="footer" class="pannle-footer">
                        <button @click="updateCategoryPic" class="sure">确定</button>
                        <button @click="cancelUpdateCategor" class="cancel">取消</button>
                    </div>
                </right-pannel>
            </el-main>
            <el-footer>
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
                    <el-tooltip class="item" effect="dark" placement="right">
                        <svg-icon icon-class="tip-icon"></svg-icon>
                    </el-tooltip>
                </span>
            </span>
            <chunk-upload
                :tree-result="treeResult"
                :displayName="displayName"
                :node-data="nodeData"
                :uploadType="'File'"
                :apiHost="apiHost"
                :accept="'*/*'"
                @getList="getPicList"
            />
        </el-dialog>
    </el-container>
</template>
<script>
import ChunkUpload from "_c//common/ChunkUpload";
import MTree from "_c/ImgManage/MTree";
import ListHeader from "./ListHeader";
import List from "./List";
import SelectTree from "_c//common/SelectTree";
import RightPannel from "_c//ImgManage/RightPannel";
import * as videoManageApi from "@/api/request/fileManageApi";
import * as videoCategoryManageApi from "@/api/request/fileCategoryManageApi";
import environment from "@/environment/index.js";

export default {
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
            ruleForm: {
                name: "",
                delivery: false,
                pass: ""
            },
            displayName: "文件",
            nodeData: "", // 分类节点的名称
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
            if (node) {
                this.nodeData = node;
            }
            let { data } = await videoManageApi.getPicList(
                this.picSearchOptions
            );
            this.imgPageResult = data;
        },
        // 批量删除列表
        async batchRemovePic(idlist) {
            this.$confirm(
                `删除后，网站中引用的文件数据将同步删除，同时文件将被移动到回收站，是否确认删除？`,
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
                            } = await videoManageApi.batchRemove(true, idlist);
                            if (status === 200) {
                                this.getTree();
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.getPicList();
                            }
                        } else {
                            // this.$message({
                            //     type: "info",
                            //     message: "已取消删除"
                            // });
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
                this.$message({
                    type: "success",
                    message: "移动成功!"
                });
                this.isInvitationPanelShow = false;
                this.getPicList();
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
        },
        async newCategory(entity) {
            console.log(entity);
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
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                            }
                        } else {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
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
            console.log(data, "data");
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
                this.$message({
                    type: "error",
                    message: "请选择移动的分类!"
                });
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
        }
    },
    computed: {
        isInvitationlWidth() {
            return this.isInvitationPanelShow === true ? 480 : 0;
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
.download-link {
    overflow: hidden;
    background-color: #eee;
    display: flex;
    justify-content: space-between;
    padding-left:16px;

}
</style>





