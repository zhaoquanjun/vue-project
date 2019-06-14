<template>
    <el-container>
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <svg-icon icon-class="img-type-title"></svg-icon>
                <span>图片分类</span>
            </h4>
            <h5 class="title-item" @click="resetCategoryId">全部分类({{totalSum}}) </h5><button @click="newCategory({DisplayName:'Test'})">新增</button>
            <m-tree :tree-result="treeResult"
                    :pic-search-options="picSearchOptions"
                    @getPicList="getPicList"
                    @create="newCategory"
                    @batchRemove="batchRemoveCategory"
                    @rename="renameCategory"
                    @modifyNode="modifyNodeCategory"></m-tree>
        </el-aside>
        <el-main>
            <img-list-header :pic-search-options="picSearchOptions"
                             @switchUploadBoxShowStatus="switchUploadBoxShowStatus"
                             @getPicList="getPicList"></img-list-header>

            <el-main>
                <img-list :img-page-result="imgPageResult"
                          :pic-search-options="picSearchOptions"
                          :tree-result="treeResult"
                          @getPicList="getPicList"
                          @changeCategory="changeCategoryPic"
                          @rename="renamePic"
                          @batchRemove="batchRemovePic"></img-list>
            </el-main>
        </el-main>

        <el-dialog title="上传图片" :visible.sync="dialogTableVisible">
            <upload-pic :tree-result="treeResult" :upload-pic-url="uploadPicUrl" />
        </el-dialog>
    </el-container>
</template>
<script>
    import MTree from "./MTree";
    import UploadPic from "./UploadPic";
    import ImgListHeader from "./ImgListHeader";
    import ImgList from "./ImgList";
    import GridList from "./GridList";
    import * as imgManageApi from "@/api/request/imgManageApi";
    import * as imgCategoryManageApi from "@/api/request/imgCategoryManageApi";
    import environment from "@/environment/index.js"

    export default {
        components: {
            MTree,
            ImgListHeader,
            ImgList,
            GridList,
            UploadPic
        },
        data() {
            return {
                imgPageResult: {},
                treeResult: null,
                dialogTableVisible: false,
                totalSum: 0,
                uploadPicUrl: environment.uploadPicUrl,
                picSearchOptions: { pageSize: 10, pageIndex: 1, orderByType: 1, isDescending: true, picCategoryId: null, keyword: "" }
            };
        },
        mounted() {
            this.getPicList({});
            this.getTree();
        },
        methods: {
            async getPicList() {
                let { data } = await imgManageApi.getPicList(this.picSearchOptions);
                this.imgPageResult = data;
            },
            async batchRemovePic(idlist) {
                let { data } = await imgManageApi.batchRemove(idlist);
                this.getPicList();
            },
            resetCategoryId() {
                this.picSearchOptions.picCategoryId = null;
                this.getPicList();
            },
            async changeCategoryPic(categoryId, idList) {
                await imgManageApi.changeCategory(categoryId, idList);
                this.getPicList();
            },
            async renamePic(id, newname) {
                await imgManageApi.rename(id, newname);
                this.getPicList();
            },
            async getTree() {
                let { data } = await imgCategoryManageApi.get();
                this.treeResult = data.treeArray;
                this.totalSum = data.totalSum;
            },
            async newCategory(entity) {
                console.log(entity);
                await imgCategoryManageApi.create(entity);
                this.getTree();
            },
            async batchRemoveCategory(idList) {
                await imgCategoryManageApi.batchRemove(idList);
                this.getTree();
            },
            async renameCategory(id, newName) {
                await imgCategoryManageApi.rename(id, newName);
                this.getTree();
            },
            async modifyNodeCategory(id, parentId, idOrderByArr) {
                await imgCategoryManageApi.modifyNode(id, parentId, idOrderByArr);
                this.getTree();
            },
            switchUploadBoxShowStatus() {
                this.dialogTableVisible = !this.dialogTableVisible;
            }
        }
    };
</script>
<style scoped>
    .el-main {
        /* padding: 0; */
    }

    .el-container /deep/ .tree-aside {
        width: 664px !important;
        height: 100vh;
        background: #fff;
        margin: 0 0 0 13px;
    }
</style>
<style lang="scss" scoped>
    .pic-type-title {
        height: 60px;
        line-height: 60px;
        padding-left: 14px;
        border-bottom: 1px solid #e8eaf3;
        border-right: 1px solid #e8eaf3;
        box-sizing: border-box;
        span

    {
        vertical-align: middle;
        padding-left: 10px;
    }

    }

    .title-item {
        padding: 28px 0 12px 12px;
    }
</style>



