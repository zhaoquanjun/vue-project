<template>
    <el-container>
        <el-aside class="tree-aside">
            <h4 class="pic-type-title">
                <svg-icon icon-class="img-type-title"></svg-icon>
                <span>图片分类</span>
            </h4>
            <h5 class="title-item">全部分类({{totalSum}}) <button @click="newCategory({DisplayName:'Test'})">新增</button></h5>
            <m-tree :tree-result="treeResult"
                    @create="newCategory"
                    @batchRemove="batchRemoveCategory"
                    @rename="renameCategory"
                    @modifyNode="modifyNodeCategory"></m-tree>
        </el-aside>
        <el-main>
            <content-header></content-header>
            <el-main>
                <!-- <grid-list></grid-list> -->
                <content-table :img-list="imgList"
                               @changePageNum="changePageNum"></content-table>
            </el-main>
        </el-main>

        <el-dialog title="收货地址" :visible.sync="dialogTableVisible">

        </el-dialog>
    </el-container>
</template>
<script>
    import MTree from "./MTree";
    import ContentHeader from "./ContentHeader";
    import ContentTable from "./ContentTable";
    import GridList from "./GridList";
    import { getPicList } from "@/api/request/imgManageApi";
    import * as imgCategoryManageApi from "@/api/request/imgCategoryManageApi";


    export default {
        components: {
            MTree,
            ContentHeader,
            ContentTable,
            GridList
        },
        data() {
            return {
                imgList: null,
                treeResult: null,
                dialogTableVisible: false,
                totalSum: 0
            };
        },
        mounted() {
            this._getPicList();
            this.getTree();
        },
        methods: {
            async _getPicList(options) {
                let { data } = await getPicList((options = {}));
                this.imgList = data;
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
            changePageNum(page) {
                console.log(page, "index页面");
                let options = {
                    pageIndex: page
                };
                this._getPicList(options);
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



