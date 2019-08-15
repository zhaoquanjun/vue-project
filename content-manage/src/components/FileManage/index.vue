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
                :list-options="picSearchOptions"
                :isexpand="true"
                @getList="getPicList"
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
                @editor="editor"
                @batchDelete="batchDelete"
                @batchTop="switchIsTopStatus"
                @batchMove="batchMove"
            ></list-header>

            <el-main>
                <List
                    :img-page-result="imgPageResult"
                    :pic-search-options="picSearchOptions"
                    :tree-result="treeResult"
                    :use-storage="useStorage"
                    @getPicList="getPicList"
                    @changeCategory="changeCategory"
                    @rename="rename"
                    @batchRemove="batchRemovePic"
                    @editor="editor"
                    @handleSelectionChange="handleSelectionChange"
                    @switchIsTopStatus="switchIsTopStatus"
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
                    <template v-if="editorOrMove">
                        <span slot="title-text">编辑文件</span>
                        <el-form
                            :model="ruleForm"
                            ref="ruleForm"
                            label-width="70px"
                            class="file-ruleForm"
                            @submit.native.prevent
                        >
                            <el-form-item label="文件名称" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="文件类型" prop="delivery">
                                <SelectTree
                                    :categoryName="curRowData.categoryName"
                                    :tree-result="treeResult"
                                    @chooseNode="chooseNode"
                                    :isexpand="true"
                                ></SelectTree>
                            </el-form-item>
                            <el-form-item label="下载链接">
                                <div class="download-link">
                                    <span class="ellipsis download-url">{{ruleForm.link}}</span>
                                    <button class="btn-small btn-bglightblue">复制</button>
                                </div>
                            </el-form-item>
                            <el-form-item label="下载密码">
                                <el-input
                                    type="password"
                                    v-model="ruleForm.pass"
                                    autocomplete="off"
                                ></el-input>
                            </el-form-item>
                        </el-form>

                        <div slot="footer" class="pannle-footer">
                            <button @click="updateCategoryPic" class="sure">确定</button>
                            <button @click="cancelUpdateCategor" class="cancel">取消</button>
                        </div>
                    </template>
                    <template v-else>
                        <span slot="title-text">编辑文件</span>
                        <div class="category-content">
                            <span name="cur-tip">移动至</span>
                        </div>
                        <SelectTree
                            :categoryName="curRowData.categoryName"
                            :tree-result="treeResult"
                            @chooseNode="chooseNode"
                            :isexpand="true"
                        ></SelectTree>
                        <div slot="footer" class="pannle-footer">
                            <button @click="updateCategoryPic" class="sure">确定</button>
                            <button @click="cancelUpdateCategor" class="cancel">取消</button>
                        </div>
                    </template>
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
import { getStorageUsage } from "@/api/request/contentCommonApi.js"
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
                pass: "",
                link: ""
            },
            displayName: "文件",
            nodeData: "", // 分类节点的名称
            componentId: "List",
            isImgList: false,
            countPic: 0,
            curRowData: {},
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
                isTop: null,
                isDescending: true,
                categoryIdList: [],
                keyword: "",
                isDelete: false
            },
            editorOrMove: true, // false:move | true:editor
            useStorage:{}
        };
    },
    mounted() {
        this.getPicList();
        this.getTree();
        this.getStorageUsage()
    },
    methods: {
        // 获取使用的内容
        async getStorageUsage(){
            let {data,status} = await getStorageUsage("File");
            this.useStorage = data;
        },
        // 获取列表
        async getPicList(node) {
            const loading = this.$loading({
                lock: true,
                spinner: "loading-icon",
                background: "rgba(255, 255, 255, 0.75)"
            });
            if (node) {
                this.nodeData = node;
            }
            let { data, status } = await videoManageApi.getPicList(
                this.picSearchOptions
            );
            if (status === 200) {
                loading.close();
            }
            this.imgPageResult = data;
        },
        // 批量删除列表
        async batchRemovePic(idlist) {
            this.$confirm(
                `删除后，网站中引用的文件数据将同步删除，同时文件将被移动到回收站，是否确认删除？`,
                "提示",
                {
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
                                this.$notify({
                                    customClass: "notify-success", //  notify-success ||  notify-error
                                    message: `删除成功`,
                                    duration: 1500,
                                    showClose: false
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
        // 移动分类
        async changeCategory(categoryId, idList) {
            let { data, status } = await videoManageApi.changeCategory(
                categoryId,
                idList
            );
            if (status == 200) {
            
                this.$notify({
                    customClass: "notify-success", //  notify-success ||  notify-error
                    message: `移动成功`,
                    duration: 1500,
                    showClose: false
                });
                this.isInvitationPanelShow = false;
                this.getPicList();
            }
        },
        // 重命名
        async rename(id, newname) {
            await videoManageApi.rename(id, newname);
            this.getPicList();
        },
        // 获取树节点
        async getTree() {
            let { data } = await videoCategoryManageApi.get();
            this.treeResult = data.treeArray;
            this.totalSum = data.totalSum;
        },
        // 创建新的分类
        async newCategory(entity) {
            console.log(entity);
            await videoCategoryManageApi.create(entity);
            this.getTree();
        },
        // 删除分类
        async batchRemoveCategory(idList) {
            this.$confirm(
                "若该分类下存在数据，删除后数据将自动移动到“全部分类”中，是否确认删除该分类？",
                "提示",
                {
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
                                    customClass: "notify-success", //  notify-success ||  notify-error
                                    message: `删除成功`,
                                    duration: 1500,
                                    showClose: false
                                });
                            }
                        }
                    }
                }
            );
        },
        // 重命名分类名称
        async renameCategory(id, newName) {
            await videoCategoryManageApi.rename(id, newName);
            this.getTree();
        },
        // 树节点移动
        async modifyNodeCategory(id, parentId, idOrderByArr) {
            await videoCategoryManageApi.modifyNode(id, parentId, idOrderByArr);
            this.getTree();
        },
        // 置顶
        async switchIsTopStatus(isTop, id) {
            let idList = id || this.idsList;
            let msg = !isTop ? "取消置顶" : "置顶";
            this.$confirm(`您确认要${msg}所选文件吗？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                iconClass: "icon-warning",
                callback: async action => {
                    if (action === "confirm") {
                        await videoManageApi.switchIsTopStatus(isTop, idList);
                        this.getPicList();
                    }
                }
            });
        },

        // 点击上传文件
        switchUploadBoxShowStatus(uploadImg) {
            this.dialogTableVisible = !this.dialogTableVisible;
            if (uploadImg === "uploadImg") this.getPicList();
        },
        // 编辑文件
        editor(b, data) {
            this.editorOrMove = true;
            this.isInvitationPanelShow = b;
            this.curRowData = data;
            console.log(data, "data");
            this.ruleForm = {
                name: data.title,
                pass: data.pwd || "",
                link: data.fullOssUrl
            };
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
        },
        // 点击确定按钮 更新图片分类
        updateCategoryPic() {
            let categoryId =
                this.moveToClassiFy.id || this.curRowData.categoryId; // 分类ID
            if (!!editorOrMove) {
                this.rename(this.curRowData.id, this.ruleForm.name);
            }

            this.changeCategory(categoryId, [this.curRowData.id]);
        },
        // 取消移动分类 关闭panel
        cancelUpdateCategor() {
            this.isInvitationPanelShow = false;
            this.moveToClassiFy = this.curRowData = "";
        },
        //批量移动
        batchMove() {
            this.isInvitationPanelShow = true;
            this.editorOrMove = false;
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
.file-ruleForm {
    padding: 32px 0;
}
.download-link {
    overflow: hidden;
    background-color: #eee;
    display: flex;
    justify-content: space-between;
    padding-left: 16px;
    .download-url {
        width: 80%;
    }
}
</style>





