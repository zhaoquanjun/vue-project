<template>
    <div style="margin-left:20px">
        <el-button type="danger" @click="batchRemove(null)">
            批量删除
        </el-button>
        <el-button type="danger" @click="batchTop(null, false)">
            批量置顶
        </el-button>
        <el-button type="danger" @click="batchTop(null, true)">
            批量取消置顶
        </el-button>
        <el-button type="danger" @click="batchPublish(null,false)">
            批量上线
        </el-button>
        <el-button type="danger" @click="batchPublish(null,true)">
            批量下线
        </el-button>
        <el-table
            ref="multipleTable"
            :data="articlePageResult.list"
            tooltip-effect="dark"
            class="content-table"
            @selection-change="handleSelectionChange"
            @sort-change='sortByTopStatus'
        >
            <el-table-column type="selection"></el-table-column>

            <el-table-column prop="title" label="文章标题">
                <template slot-scope="scope">
                    <img :src="scope.row.pictureUrl" class="cover" alt>
                    <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="categoryName" label="分类"></el-table-column>

            <el-table-column prop="isPublishPrt" label="状态" show-overflow-tooltip></el-table-column>

            <el-table-column prop="isTopPrt" sortable="custom" label="置顶" show-overflow-tooltip></el-table-column>

            <el-table-column prop="createUser" label="作者" show-overflow-tooltip></el-table-column>

            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn" @click="handleMove(scope.row)">
                            <svg-icon icon-class="tab-move"></svg-icon>
                        </button>
                        <button class="handle-btn" @click="handleLook(scope.$index, scope.row)">
                            <svg-icon icon-class="tab-look"></svg-icon>
                        </button>
                        <button class="handle-btn" @click="batchRemove( scope.row)">
                            <svg-icon icon-class="l-recyclebin"></svg-icon>
                        </button>
                        <button class="handle-btn" @click="batchTop( scope.row)">
                            <svg-icon icon-class="l-recyclebin"></svg-icon>
                        </button>
                        <button class="handle-btn" @click="batchPublish( scope.row)">
                            <svg-icon icon-class="l-recyclebin"></svg-icon>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageing">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="articlePageResult.totalRecord"
                :page-count="articlePageResult.totalPage"
                :page-size="articlePageResult.pageSize"
                :page-sizes="[1,5,10,15,20,50,100]"
                @current-change="changePageNum"
                @size-change="changePageSize"
            ></el-pagination>
        </div>
        <!-- <el-dialog width="400px" :visible.sync="imgVisible" class="img-dialog">
            <el-card :body-style="{ padding: '0px' }">
                <img src="../../assets/avatar.jpeg" width="100%" height="100%">
            </el-card>
        </el-dialog> -->
    </div>
</template>

<script>
export default {
    props: ["articlePageResult", "articleSearchOptions", "treeResult"],
    data() {
        return {
            multipleSelection: []
        };
    },
    methods: {
        changePageNum(page) {
            this.articleSearchOptions.pageIndex = page;
            this.$emit("getArticleList");
        },
        changePageSize(size) {
            this.articleSearchOptions.pageSize = size;
            this.$emit("getArticleList");
        },
        sortByTopStatus: function(column, prop, order) {
            // descending ascending
            this.articleSearchOptions.OrderByTopOrder = column.order == "ascending" ? true : column.order == "descending" ? false : null;
            this.$emit("getArticleList");
        },
        /**
         * 单选或全选操作
         */
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getCheckArr(){
            let checkArr = this.multipleSelection;   // multipleSelection存储了勾选到的数据
            let params = [];
            let self = this;
            checkArr.forEach(function (item) {     
                params.push(item.id);       // 添加所有需要删除数据的id到一个数组，post提交过去
            });
            return params;
        },
        /**
         * 移动分类
         */
        handleMove(row) {
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
        batchRemove(row) {
            if(row == null || row == undefined){
                var idList = this.getCheckArr();
                this.$emit("batchRemove", idList);
            }else{
                this.$emit("batchRemove", [row.id]);
            }
        },
        /**
         * 置顶操作
         */
        batchTop(row, isTop) {
            if(row == null || row == undefined){
                var idList = this.getCheckArr();
                this.$emit("batchTop", idList, isTop);
            }else{
                this.$emit("batchTop", [row.id], row.isTop);
            }
        },
        /**
         * 上下线操作
         */
        batchPublish(row, isPublish) {
            if(row == null || row == undefined){
                var idList = this.getCheckArr();
                this.$emit("batchPublish", idList, isPublish);
            }else{
                this.$emit("batchPublish", [row.id], row.isPublish);
            }
        }
    }
};
</script>
<style >
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
<style >
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
.content-table {
    width: 100%;
    box-sizing: border-box;
}
.handle-btn-wrap {
    display: flex;
    justify-content: space-between;
}
.handle-btn {
    //padding-right: 54px;
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
