<template>
    <div class="table-wrap">
        <el-table ref="multipleTable"
                  :data="imgPageResult.list"
                  tooltip-effect="dark"
                  class="content-table"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>

            <el-table-column label="图片名称">
                <template slot-scope="scope">
                    <img :src="scope.row.zoomOssUrl" class="cover">
                    <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="categoryName" label="分类"></el-table-column>

            <el-table-column prop="sizeStr" label="大小" show-overflow-tooltip></el-table-column>

            <!--<el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="createTimeStr" label="上传时间" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn" @click="handleMove(scope.$index, scope.row)">
                            <svg-icon style="width:27px;height:27px" icon-class="tab-move"></svg-icon>
                        </button>
                        <button class="handle-btn" @click="handleLook(scope.$index, scope.row)">
                            <svg-icon icon-class="tab-look"></svg-icon>
                        </button>
                        <button class="handle-btn" @click="batchRemove(scope.$index, scope.row)">
                            <svg-icon icon-class="l-recyclebin"></svg-icon>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageing">
            <el-pagination background
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="imgPageResult.totalRecord"
                           :page-count="imgPageResult.totalPage"
                           :page-size="picSearchOptions.pageSize"
                           :page-sizes="[5,10,15,20,50,100]"
                           @current-change="changePage"
                           @size-change="changeSize"></el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        // props:{
        //     imgList:{
        //         type:Object,
        //         default:()=>({})
        //     }
        // },
        props: ["imgPageResult", "picSearchOptions"],
        data() {
            return {
                imgVisible: false,
                multipleSelection: []
            };
        },

        methods: {
            /**
             * 单选或全选操作
             */
            handleSelectionChange(val) {
                console.log(val);
                this.multipleSelection = val;
            },
            /**
             * 移动分类
             */
            handleMove(index, row) {
                console.log(index, row);
            },
            /**
             * 查看大图
             */
            handleLook(index, row) {
                console.log(index, row);
                this.imgVisible = true;
            },
            /**
             * 删除操作
             */
            handleDelete(index, row) {
                console.log(index, row);
            },
            changePage(page) {
                this.picSearchOptions.pageIndex = page;
                this.$emit("getPicList");
            },
            changeSize(size) {
                this.picSearchOptions.pageSize = size;
                this.$emit("getPicList");
            },
            batchRemove(idList) {
                this.$emit("batchRemove", idList);
            }
        }
    };
</script>
<style>
    .el-table .has-gutter th {
        padding: 0;
        height: 32px;
        background: #00c1de !important;
    }

    .el-table th > .cell {
        color: #fff;
        font-weight: 400;
        font-size: 12px;
    }

    .el-table .el-table__row {
        height: 60px;
        /* line-height: 60px; */
    }
</style>
<style>
    .el-pagination.is-background .el-pager /deep/ li:not(.disabled).active {
        background-color: #01c0de !important;
    }

    .el-pagination /deep/ .el-pagination__total {
        color: #8c8c8c;
    }

    .el-pagination.is-background .el-pager /deep/ li {
        font-weight: 400;
        color: #252525;
        background-color: #fff !important;
        border: 1px solid rgba(229, 229, 229, 1);
    }

    .el-pager /deep/ .active {
        background-color: #01c0de !important;
    }
</style>

<style lang="scss" scoped>
    .table-wrap {
        margin: 0 21px;
    }

    .content-table {
        width: 100%;
        box-sizing: border-box;
    }

    .handle-btn-wrap {
        display: flex;
        justify-content: space-between;
        .handle-btn

    {
        background: #fff;
        //padding-right: 54px;
    }

    }

    .cover {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-right: 10px;
    }

    .pageing {
        float: right;
        margin-top: 24px;
    }
</style>
