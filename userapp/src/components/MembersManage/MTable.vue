<template>
    <div>
        <el-table
            :data="memberList"
            style="width: 100%"
            :header-cell-style="{background:'#F5F5F5'}"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" :selectable="handleDisable"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
            <el-table-column prop="policies" label="权限数量(项)"></el-table-column>
            <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                    <el-popover
                        :ref="`popover-${scope.$index}`"
                        placement="bottom"
                        width="400"
                        trigger="click"
                    >
                        <span slot="reference">{{scope.row.remark}} {{scope.$index}}</span>
                        <div class="textareaWrap">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model="textarea3"
                            ></el-input>
                            <div class="btn-wrap">
                                <button
                                    class="cancel"
                                    slot="refenrence"
                                    type="primary"
                                    @click="cancelInput(scope.$index)"
                                >取消</button>
                                <button class="save">保存</button>
                            </div>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <button 
                    class="handle-btn"
                    @click="handleEdit(scope.$index, scope.row)">
                         <svg-icon  icon-class="editor"></svg-icon>
                        </button>
                    <button
                       class="handle-btn"
                        @click="handleDelete(scope.$index, scope.row)"
                    >
                    <svg-icon  icon-class="l-recyclebin"></svg-icon>
                    </button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageing">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="memberInfo.totalCount"
                :page-count="memberInfo.totalPages"
                :page-size="3"
                 :page-sizes="[3, 4, 5, 6]"
                @current-change="changePage"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        memberInfo: {
            type: Object,
            default: () => ({})
        },
        memberList: {
            type: Array,
            default: () => ([])
        }
    },
    created() {
        console.log(this.memberList, "0097666666");
    },
    data() {
        return {
            textarea3: "123,"
            //  multipleSelection: []
        };
    },
    methods: {
        handleDisable(row, index) {
            return true;
            // 函数需要一个返回值,true为可选,false为不可选择
            // if (index == 0) {
            //   return false;
            // } else {
            //   return true;
            // }
        },
        /**
         * 编辑操作
         */
        handleEdit(index, row) {
            console.log(index, row);
            this.$emit("authEdit", row);
        },
        /**
         * 删除操作
         */
        handleDelete(index, row) {
            console.log(index, row);
            this.$emit("deleteCurMember", row);
        },
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
            console.log(val);
            this.$emit("tabSelection", val);
        },
        cancelInput(id) {
            this.$refs[`popover-${id}`].doClose();
        },
        changePage(page) {
            console.log(page,'当前页码');
            this.$emit("changePageNum",page)
        }
        // deleteMemberListItem(){
        //   this.tableData = this.tableData.filter((item)=>{
        //     return
        //   })
        // }
    }
};
</script>
<style scoped>
    .el-table /deep/ th{
        padding: 10px 0;
        background: #EEEEEE !important;
    }
    .el-table /deep/ td{
        padding: 10px 0;
    }
    .el-table /deep/ th>.cell{
        color: #333;
        font-size: 12px;
    }
    .el-table /deep/ .cell{
        color: #333;
    }
    .el-checkbox__input.is-checked /deep/ .el-checkbox__inner{
        background-color: #00C1DE !important;
        border-color: #00C1DE !important;
    }
    .el-pagination.is-background .el-pager /deep/ li:not(.disabled).active{
        background-color: #01C0DE !important;
    }
    .el-pager /deep/ .active{
          background-color: #01C0DE !important;
    }
</style>

<style lang="scss" scoped>
.textareaWrap {
    padding: 10px;
    box-shadow: 0 0 5px #ccc;
    background: #fff;
    position: relative;
    .btn-wrap {
        text-align: right;
        padding-top: 10px;
        button {
            padding: 5px 10px;
            border: none;
        }
        .cancel {
            border: 1px solid #eeeeee;
            margin-right: 10px;
        }
        .save {
            background: #00c1de;
        }
    }
}
.hide {
    display: none;
}
.remark-textarea {
    display: block;
    position: absolute;
    top: 41px;
    left: 0;
    z-index: 100000;
}
.pageing {
    display: flex;
    float: right;
    margin-top: 30px;
}
.myCell .el-checkbox__input {
    display: none;
}
.handle-btn{
    padding-right:54px; 
}
</style>


