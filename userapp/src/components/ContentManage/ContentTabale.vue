<template>
    <div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection"></el-table-column>

            <el-table-column label="图片名称">
                <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>

            <el-table-column prop="type" label="分类"></el-table-column>

            <el-table-column prop="size" label="大小" show-overflow-tooltip></el-table-column>

            <el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <button class="handle-btn" @click="handleEdit(scope.$index, scope.row)">
                        <svg-icon icon-class="editor"></svg-icon>
                    </button>
                    <button class="handle-btn" @click="handleEdit(scope.$index, scope.row)">
                        <svg-icon icon-class="editor"></svg-icon>
                    </button>
                    <button class="handle-btn" @click="handleDelete(scope.$index, scope.row)">
                        <svg-icon icon-class="l-recyclebin"></svg-icon>
                    </button>
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
    </div>
</template>

<script>
export default {
    data() {
        return {
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
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        /**
         * 编辑操作
         */
        handleEdit(index, row) {
            console.log(index, row);
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
<style lang="scss" scoped>
.handle-btn {
    padding-right: 54px;
}
</style>
