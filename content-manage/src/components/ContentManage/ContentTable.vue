<template>
    <div style="margin-left:20px">
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            class="content-table"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection"></el-table-column>

            <el-table-column label="图片名称">
                <template slot-scope="scope">
                    <img src="../../assets/avatar.jpeg" class="cover" alt>
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="type" label="分类"></el-table-column>

            <el-table-column prop="size" label="大小" show-overflow-tooltip></el-table-column>

            <el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn" @click="handleMove(scope.$index, scope.row)">
                            <svg-icon icon-class="tab-move"></svg-icon>
                        </button>
                        <button class="handle-btn" @click="handleLook(scope.$index, scope.row)">
                            <svg-icon icon-class="tab-look"></svg-icon>
                        </button>
                        <button class="handle-btn" @click="handleDelete(scope.$index, scope.row)">
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
                :total="100"
                :page-count="5"
                :page-size="3"
                :page-sizes="[3, 4, 5, 6]"
                @current-change="1"
            ></el-pagination>
        </div>
        <el-dialog width="400px" :visible.sync="imgVisible" class="img-dialog">
            <el-card :body-style="{ padding: '0px' }">
                <img src="../../assets/avatar.jpeg" width="100%" height="100%">
            </el-card>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imgVisible: false,
            tableData: [
                {
                    date: "2016-05-03",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    type: "默认分类",
                    size: "2.4M",
                    wideHigh: "200*200"
                },
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    type: "默认分类",
                    size: "2.4M",
                    wideHigh: "200*200"
                },
                {
                    date: "2016-05-04",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    type: "默认分类",
                    size: "2.4M",
                    wideHigh: "200*200"
                },
                {
                    date: "2016-05-01",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    type: "默认分类",
                    size: "2.4M",
                    wideHigh: "200*200"
                },
                {
                    date: "2016-05-08",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    type: "默认分类",
                    size: "2.4M",
                    wideHigh: "200*200"
                },
                {
                    date: "2016-05-06",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    type: "默认分类",
                    size: "2.4M",
                    wideHigh: "200*200"
                },
                {
                    date: "2016-05-07",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    type: "默认分类",
                    size: "2.4M",
                    wideHigh: "200*200"
                }
            ],
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
/* .el-table th > .cell {
    color: #fff;
    font-weight: 400;
    font-size: 12px;
} */
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
