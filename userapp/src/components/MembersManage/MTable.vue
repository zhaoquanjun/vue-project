<template>
    <div id="member-table">
        <el-table
            :data="memberList"
            style="width: 100%"
            :header-cell-style="{background:'#F5F5F5'}"
            @selection-change="handleSelectionChange"
            :cell-class-name="checkbox"
           
        >
            <el-table-column type="selection" :selectable="handleDisable"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
            <el-table-column prop="policies" label="权限数量(项)">
                      <template slot-scope="scope">
                          <span>{{scope.row.policies}} </span> 
                          <span style="padding-left:5px" v-if="scope.row.isSystem">(全部权限)</span>
                      </template>  
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-popover
                        :ref="`popover-${scope.$index}`"
                        placement="bottom"
                        width="317"
                        trigger="click"
                        style="padding:0"
                        @show="showRemark(scope.row)"
                    >
                        <span slot="reference">
                            <div
                                class="remark-desc"
                            >{{scope.row.remark && scope.row.remark.trim().length > 10 ? scope.row.remark.slice(0, 10) + '...' : scope.row.remark}}</div>
                            <svg-icon icon-class="remark"></svg-icon>
                        </span>
                        <div class="textareaWrap">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 3}"
                                placeholder="请输入内容"
                                v-model="remarkValue"
                                maxlength="100"
                                show-word-limit
                                resize="none"
                                @blur="remarkBlur"
                            ></el-input>
                            <div class="btn-wrap">
                                <button
                                    class="popover-btn cancel"
                                    slot="refenrence"
                                    type="primary"
                                    @click="cancelInput(scope.$index)"
                                >取消</button>
                                <button
                                    class="popover-btn save"
                                    @click="saveInputValue(scope.$index,scope.row)"
                                >保存</button>
                            </div>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope" v-if="!scope.row.isSystem">
                    <button
                        class="handle-btn handle-btn-item"
                        @click="handleEdit(scope.$index, scope.row)"
                    >
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
                layout="total,slot,sizes, prev, pager, next"
                :total="memberInfo.totalCount"
                :page-count="memberInfo.totalPages"
                :page-sizes="[10, 20, 50]"
                prev-text="上一页"
                next-text="下一页"
                @current-change="changePage"
            >
                <div class="sizes-title">每页显示</div>
            </el-pagination>
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
            default: () => []
        }
    },
    created() {
        console.log(this.memberList, "0097666666");
    },
    data() {
        return {
            remarkValue: "123"
            //  multipleSelection: []
        };
    },
    methods: {
        checkbox(row) {
           
            if (row.row.isSystem === true && row.columnIndex === 0) {
                 console.log(row)
                return "mycell";

            }
        },
        handleDisable(row, index) {
            return true;
            // 函数需要一个返回值,true为可选,false为不可选择
            //if (index == 0) {
            //  return false;
            //} else {
            //  return true;
            //}
        },
        /**
         * 编辑操作
         */
        handleEdit(index, row) {
            console.log(index);
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
        changePage(page) {
            console.log(page, "当前页码");
            this.$emit("changePageNum", page);
        },
        cancelInput(id) {
            this.$refs[`popover-${id}`].doClose();
            this.remarkValue = "";
        },

        saveInputValue(id, row) {
            let data = {
                targetUserId: row.userId,
                remark: this.remarkValue
            };
            this.memberList[id].remark = this.remarkValue;
            this.$emit("updateUserRemark", data);
            this.$refs[`popover-${id}`].doClose();
        },

        remarkBlur(e) {
            console.log(e.target.className);
        },
        showRemark(row) {
            this.remarkValue = row.remark ? row.remark : "";
        }
        // deleteMemberListItem(){
        //   this.tableData = this.tableData.filter((item)=>{
        //     return
        //   })
        // }
    }
};
</script>
<style>
.mycell .el-checkbox__input {
    display: none;
}
#member-table .el-table th {
    padding: 10px 0;
    background: #f5f5f5;
}
#member-table .el-table td {
    padding: 10px 0;
}
#member-table .el-table th > .cell {
    color: #333;
    font-size: 12px;
}
#member-table .el-table .cell {
    color: #333;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
}
#member-table .el-table .cell .remark-desc {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* width: 81%; */
    vertical-align: middle;
}
#member-table .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #00c1de;
    border-color: #00c1de;
}
#member-table
    .el-pagination.is-background
    .el-pager
    li:not(.disabled)#member-table
    .active {
    background-color: #01c0de;
}
#member-table .el-pagination .el-pager li {
    font-weight: 400;
    color: #252525;
}
#member-table .el-pagination .el-pager .active {
    background-color: #01c0de;
    color: #fff;
}
#member-table .el-pagination .el-pagination__total {
    color: #8c8c8c;
}
#member-table .el-pagination /deep/ .btn-prev,
#member-table .el-pagination /deep/ .btn-next {
    padding: 0 10px;
}

</style>

<style lang="scss" scoped>

.textareaWrap {
    background: #fff;
    position: relative;
    .btn-wrap {
        text-align: right;
        padding-top: 10px;
        button {
            width: 63px;
            height: 25px;
            line-height: 25px;
            font-size: 12px;
            border: none;
        }
        .cancel {
            border: 1px solid #eeeeee;
            margin-right: 10px;
        }
        .save {
            background: #00c1de;
            color: #fff;
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
    .sizes-title {
        line-height: 28px;
        color: #8c8c8c;
        font-weight: 400;
        display: inline-block;
    }
}
.myCell .el-checkbox__input {
    display: none;
}
.handle-btn-item {
    margin-right: 54px;
}
</style>


