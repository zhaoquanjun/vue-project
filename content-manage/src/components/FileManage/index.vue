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
                @getList="getPicList"
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
                @editor="editor"
                @batchDelete="batchDelete"
                @batchTop="switchIsTopStatus"
                @batchMove="batchMove"
                @batchDownLoad="batchDownLoad"
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
                    @batchRemove="batchRemove"
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
                            class="file-ruleForm"
                            @submit.native.prevent
                        >
                            <el-form-item label="文件名称" prop="name" class="input-border">
                                <el-input v-model="ruleForm.name" @blur="fileNameBlur"></el-input>
                                <div
                                    class="el-form-item__error"
                                    v-if="error.errorTip"
                                >{{error.errorText}}</div>
                            </el-form-item>
                            <el-form-item label="文件分类" prop="delivery" class="select-tree">
                                <SelectTree
                                    :categoryName="curRowData.categoryName"
                                    :categoryId="curRowData.categoryId"
                                    :tree-result="treeResult"
                                    @chooseNode="chooseNode"
                                    :isexpand="true"
                                ></SelectTree>
                            </el-form-item>
                            <el-form-item label="下载链接">
                                <div class="download-link">
                                    <span class="ellipsis download-url">{{ruleForm.link}}</span>
                                    <button
                                        class="file-editor-btn"
                                        :class="{'link-btn-green':isCopy}"
                                        v-clipboard:copy="`${ruleForm.link}`"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"
                                    >{{copyTip}}</button>
                                </div>
                            </el-form-item>
                            <el-form-item label="下载密码" style="position:relative">
                                <el-input
                                    class="input-border"
                                    placeholder="请输入下载密码(非必填)"
                                    v-model="ruleForm.pass"
                                    autocomplete="off"
                                    @blur="fileNameBlur"
                                    @focus="pwdRule"
                                    @input="watchPawInput"
                                ></el-input>
                                <div class="pwd-rule" v-if="pwdRuleShow">
                                    <div
                                        :class="[watchPwd.firstRule === false ? 'error':'success']"
                                    >
                                        <i class="iconfont " :class="[watchPwd.firstRule === false ? 'iconicon-des-Wrongnumber':'iconxingzhuangjiehe']"></i>长度为6～16位（字母区分大小写）
                                    </div>
                                    <div
                                        :class="[watchPwd.secondRule === false ? 'error':'success']"
                                    >
                                        <i class="iconfont"  :class="[watchPwd.secondRule === false ? 'iconicon-des-Wrongnumber':'iconxingzhuangjiehe']"></i>只能包含数字、字母以及英文标点符号
                                    </div>
                                </div>
                                <div
                                    class="el-form-item__error"
                                    v-if="error.pwdTip"
                                >{{error.pwdErrorText}}</div>
                            </el-form-item>
                        </el-form>
                    </template>
                    <template v-else>
                        <span slot="title-text">移动文件</span>
                        <div class="category-content">
                            <span name="cur-tip">移动至</span>
                        </div>
                        <SelectTree
                            v-if="isInvitationPanelShow"
                            :categoryName="curRowData.categoryName"
                             :categoryId="curRowData.categoryId"
                            :tree-result="treeResult"
                            @chooseNode="chooseNode"
                            :isexpand="true"
                        ></SelectTree>
                    </template>
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
                        content="单个文件不允许超过50M，一次最多可上传100个文件"
                    >
                        <i class="iconfont iconyiwen"></i>
                    </el-tooltip>
                </span>
            </span>
            <chunk-upload
                v-if="dialogTableVisible"
                :tree-result="treeResult"
                :displayName="displayName"
                :node-data="nodeData"
                :uploadType="'File'"
                :apiHost="apiHost"
                :accept="'*/*'"
                @getList="getPicList"
                @getTree="getTree"
                @closeDialog="closeDialog"
            />
        </el-dialog>
    </el-container>
</template>
<script>
import ChunkUpload from "_c/common/ChunkUpload";
import MTree from "@/components/common/MTree";
import ListHeader from "./ListHeader";
import List from "./List";
import SelectTree from "_c/common/SelectTree";
import RightPannel from "@/components/common/RightPannel";
import * as fileManageApi from "@/api/request/fileManageApi";
// fileCategoryManageApi fileManageApi
import * as fileCategoryManageApi from "@/api/request/fileCategoryManageApi";
import {
    getStorageUsage,
    adminDownload
} from "@/api/request/contentCommonApi.js";
import environment from "@/environment/index.js";
import { trim } from "@/utlis/index.js";
import { setTimeout } from "timers";
import { config } from "@vue/test-utils";

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
            pwdRuleShow: false,
            ruleForm: {
                name: "",
                pass: "",
                link: ""
            },
            copyTip: "复制",
            isCopy: false,
            displayName: "文件",
            contentType: "File",
            nodeData: {
                label: "全部分类",
                id: 0
            },
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
                isDelete: false,
                fileExtensionType: null
            },
            editorOrMove: true, // false:move | true:editor
            useStorage: {},
            error: {
                errorTip: false,
                errorText: "",
                pwdTip: false,
                pwdErrorText: ""
            },
            watchPwd: {
                firstRule: false,
                secondRule: false
            }
        };
    },
    mounted() {
        this.getPicList();
        this.getTree();
        this.getStorageUsage();
    },
    methods: {
        // 获取使用的内存
        async getStorageUsage() {
            let { data, status } = await getStorageUsage("File");
            this.useStorage = data;
        },
        // 获取列表
        async getPicList(node) {
             this.$Loading.show();
            if (node) {
                this.nodeData = node;
            }
            let { data, status } = await fileManageApi.getPicList(
                this.picSearchOptions
            );
             this.$Loading.hide();
            if (status === 200) {
                this.getTree();
            }
            this.imgPageResult = data;
        },
        // 批量删除列表
        async batchRemove(idlist) {
            this.$confirm(
                `删除后，网站中引用的文件数据将同步删除，同时文件将被移动到回收站，是否确认删除？`,
                "提示",
                {
                    iconClass: "icon-warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let {
                                status,
                                data
                            } = await fileManageApi.batchRemove(true, idlist);
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
                        }
                    }
                }
            );
        },
        // 批量下载
        async batchDownLoad() {
            this.selectedRow.forEach(item => {
                this.adminDownload(item);
            });
        },
        /**
         * 下载
         */
       async adminDownload(row) {
                let type = row.fileType;
                let id = row.id;
                let { data } = await adminDownload(type, id);
                //不用a标签而用iframe是因为a标签点击多次相当于做了多次重定向,未加载完成之前会以最后一次为准
                var link = document.createElement("iframe");
                link.style.display = "none";
                //iframe需要和父页面同协议http对应http https对应https
                link.src = window.location.protocol + data.substr(data.indexOf(":")+1);
                document.body.appendChild(link);
            },
        resetCategoryId() {
            this.picSearchOptions.categoryIdList = [];
            this.getPicList();
        },
        // 移动分类
        async changeCategory(categoryId, idList) {
            let { data, status } = await fileManageApi.changeCategory(
                categoryId,
                idList
            );
            if (status == 200) {
                this.$notify({
                    customClass: "notify-success", //  notify-success ||  notify-error
                    message: `${!!this.editorOrMove ? "保存成功" : "移动成功"}`,
                    duration: 1500,
                    showClose: false
                });
                this.isInvitationPanelShow = false;
                this.getPicList();
                this.getTree();
            }
        },
        // 重命名
        async rename(id, newname) {
            let { status, data } = await fileManageApi.rename(id, newname);
            this.getPicList();
        },
        // 获取树节点
        async getTree() {
            let { data } = await fileCategoryManageApi.get();
            this.treeResult = data.treeArray;
            this.totalSum = data.totalSum;
            this.$refs.myTree.selectCategoryByNodeId(this.nodeData.id);
        },
        // 创建新的分类
        async newCategory(entity) {
            console.log(entity);
            await fileCategoryManageApi.create(entity);
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
                            } = await fileCategoryManageApi.batchRemove(idList);
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
            await fileCategoryManageApi.rename(id, newName);
            this.getTree();
        },
        // 树节点移动
        async modifyNodeCategory(id, parentId, idOrderByArr) {
            await fileCategoryManageApi.modifyNode(id, parentId, idOrderByArr);
            this.getTree();
        },
        // 置顶
        async switchIsTopStatus(isTop, id) {
            let idList = id || this.idsList;
            let msg = !isTop ? "取消置顶" : "置顶";
            this.$confirm(`您确认要${msg}所选文件吗？`, "提示", {
                iconClass: "icon-warning",
                callback: async action => {
                    if (action === "confirm") {
                        let {
                            data,
                            status
                        } = await fileManageApi.switchIsTopStatus(
                            isTop,
                            idList
                        );
                        if (status == 200) {
                            this.$notify({
                                customClass: "notify-success", //  notify-success ||  notify-error
                                message: `${msg}成功`,
                                duration: 1500,
                                showClose: false
                            });
                        }
                        this.getPicList();
                    }
                }
            });
        },
        // 设置密码
        async batchSetPwd(ids) {
            let option = {
                idList: [ids],
                pwd: this.ruleForm.pass
            };
            let { data, status } = await fileManageApi.batchSetPwd(option);
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
            this.ruleForm = {
                name: data.title,
                pass: data.pwd || "",
                link: `${location.origin}${data.downloadPage}`
            };
            this.error.errorTip = false;
            this.error.errorText = "";
            this.error.pwdTip = false;
            this.error.pwdErrorText = "";
        },
        closeRightPanel(b) {
            this.isInvitationPanelShow = b;
        },
        // 关闭上传文件弹窗
        closeDialog() {
            this.dialogTableVisible = false;
        },
        //选择移动分类时的节点
        chooseNode(node) {
            this.moveToClassiFy = node;
        },
        // 批量更新的选中数量
        handleSelectionChange(list) {
            this.selectedRow = list;
            this.idsList = [];
            this.countPic = list.length;
            if (list.length < 1) return;
            list.forEach(item => {
                this.idsList.push(item.id);
            });
            this.selectedImg = list;
        },
        // 点击确定按钮 更新分类
        updateCategoryPic() {
            let categoryId = this.moveToClassiFy
                ? this.moveToClassiFy.id
                : this.curRowData.categoryId;
            if (!!this.editorOrMove) {
                if (!this.fileNameBlur()) return;
                this.batchSetPwd(this.curRowData.id, this.ruleForm.pass);
                this.rename(this.curRowData.id, this.ruleForm.name);
            }
            let idList =
                this.idsList.length > 0 ? this.idsList : [this.curRowData.id];
            this.changeCategory(categoryId, idList);
        },
        // 取消移动分类 关闭panel
        cancelUpdateCategor() {
            this.isInvitationPanelShow = false;
            this.moveToClassiFy = this.curRowData = "";
        },
        //批量移动
        batchMove() {
            this.curRowData = {
                categoryName: "全部分类",
                categoryId: 0
            };
            this.isInvitationPanelShow = true;
            this.editorOrMove = false;
        },
        //批量删除
        batchDelete() {
            this.batchRemove(this.idsList);
        },
        // 验证编辑面板
        fileNameBlur() {
            this.watchPwd.secondRule = false;
            this.watchPwd.firstRule = false;
            this.pwdRuleShow = false;
            if (!trim(this.ruleForm.name)) {
                this.error.errorTip = true;
                this.error.errorText = "文件名称不能为空";
                return false;
            } else if (trim(this.ruleForm.name).length > 250) {
                this.error.errorTip = true;
                this.error.errorText = "文件名称不能超过250个字符";
                return false;
            } else {
                this.error.errorTip = false;
                this.error.errorText = "";
            }
            // let pwdReg = /^[a-zA-Z0-9\p{P}\p{S}]{6,16}$/;
            let pwdReg = new RegExp( "^[A-Za-z\\d@$,.!%*#?&]{6,16}$");
            if (trim(this.ruleForm.pass) && !pwdReg.test(this.ruleForm.pass)) {
                this.error.pwdTip = true;
                this.error.pwdErrorText = "密码设置不符合要求";
                return false;
            } else {
                this.error.pwdTip = false;
                this.error.pwdErrorText = "";
                return true;
            }
        },
        watchPawInput() {
            let pwdReg = new RegExp(
                "^[A-Za-z\\d@$,.!%*#?&]{6,16}$"
            );
            let pwdLength = trim(this.ruleForm.pass).length;
            if (pwdLength >= 6 && pwdLength <= 16) {
                this.watchPwd.firstRule = true;
            } else {
                this.watchPwd.firstRule = false;
                this.watchPwd.secondRule = false;
            }
            if (trim(this.ruleForm.pass) && !pwdReg.test(this.ruleForm.pass)) {
                this.watchPwd.secondRule = false;
                this.error.pwdTip = true;
                this.error.pwdErrorText = "密码设置不符合要求";
                return false;
            } else if(trim(this.ruleForm.pass)){
                this.watchPwd.secondRule = true;
                this.error.pwdTip = false;
                this.error.pwdErrorText = "";
                return true;
            }
            if (!trim(this.ruleForm.pass)){
                 this.watchPwd.secondRule = false;
             }
        },
        pwdRule() {
            this.pwdRuleShow = true;
        },
        onCopy() {
            this.$notify({
                customClass: "notify-success", //  notify-success ||  notify-error
                message: `复制成功`,
                duration: 1500,
                showClose: false
            });
            this.copyTip = "复制成功";
            this.isCopy = true;
            setTimeout(() => {
                this.copyTip = "复制";
                this.isCopy = false;
            }, 1500);
        },
        onError() {
            this.$message.error("prompt.copyFail");
        }
    },
    computed: {
        isInvitationlWidth() {
            return this.isInvitationPanelShow === true ? 400 : 0;
        },
        isBatchHeaderShow() {
            console.log(this.idsList.length);
            return this.idsList.length > 0 ? true : false;
        }
    },
    watch: {
        isInvitationlWidth() {
            this.isCopy = false;
            this.copyTip = "复制";
        }
    }
};
</script>
<style lang='scss'  scoped>
.el-dialog__wrapper /deep/ .el-dialog__body {
    padding: 0;
}
.el-dialog__wrapper /deep/ .el-dialog {
    width: 800px;
}
.el-form /deep/ .el-form-item__label {
    float: none;
    text-align: left;
}
.el-form /deep/ .input-border .el-input__inner {
    border: none;
    border-bottom: $--border-base;
    border-radius: 0;
}
.el-form /deep/ .input-border .el-input__inner:hover {
    border-bottom: 1px solid $--color-primary;
}
.el-form /deep/ .select-tree .el-select {
    width: 100%;
}
.el-form /deep/ .select-tree .el-input__inner {
    height: 40px;
    height: 40px;
}
.select-tree /deep/ .el-tree .el-tree-node__content {
    width: 100%;
}
</style>
<style lang="scss" scoped>
@import "../style/contentDetail";
.file-ruleForm {
    padding: 32px 15px;
}
.pwd-rule {
    position: absolute;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.2);
    padding: 16px;
    border-radius: 2px;
    top: 90px;
    > div {
        line-height: 25px;
    }
    &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        top: -20px;
        left: 32px;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent #fff transparent;
        z-index: 4000;
    }
    .error {
        i {
            color: #fb4d68;
        }
    }
    .success {
        color: $--color-text-primary;
    }
}
.download-link {
    overflow: hidden;

    display: flex;
    justify-content: space-between;
    .download-url {
        box-sizing: border-box;
        padding: 0 8px;
        background-color: #eaeaea;
    }
    .file-editor-btn {
        flex: none;
        // padding: 0;
        width: 96px;
        margin-left: 8px;
        color: $--background-color-base;
        background: $--color-primary;
        box-sizing: border-box;
    }
    .link-btn-green {
        color: $--background-color-base;
        background: $--color-success;
    }
}
.iconfont.iconxingzhuangjiehe{
    color:#23cd5d;
}
</style>





