<template>
    <div id="table-list" class="table-list">
        <el-table
            :data="memberList"
            style="width: 100%"
            :height="tableHeight"
            
            @selection-change="handleSelectionChange"
            :cell-class-name="checkbox"
        >
            <template slot="empty">
                <div class="empty-table">
                    <img src="~img/memberManage/table-empty.png" />
                    <p>无搜索结果</p>
                </div>
            </template>
            <el-table-column type="selection" :selectable="handleDisable"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div class="ellipsis">{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
            <el-table-column prop="policies" label="权限数量(项)">
                <template slot-scope="scope">
                    <span>{{scope.row.policies}}</span>
                    <span style="padding-left:5px" v-if="scope.row.isSystem">(全部权限)</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                <template slot-scope="scope">
                     <el-tooltip   v-if="!scope.row.isSystem" class="item" effect="dark" placement="bottom">
                                <div style="width:150px;" slot="content">{{scope.row.remark}}</div>
                                <div
                                    class="remark-desc"
                                >{{scope.row.remark && scope.row.remark.trim().length > 10 ? scope.row.remark.slice(0, 10) + '...' : scope.row.remark}}</div>
                            </el-tooltip>
                    <el-popover
                        v-if="!scope.row.isSystem"
                        :ref="`popover-${scope.$index}`"
                        placement="bottom"
                        width="317"
                        trigger="click"
                        style="padding:0"
                        @show="showRemark(scope.row)"
                    >
                        <button slot="reference">
                           <i class="iconfont iconicon-dash-edit"></i>
                        </button>
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
                    <div v-else>超级管理员</div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope" v-if="!scope.row.isSystem">
                    <button
                        class="handle-btn handle-btn-item"
                        @click="handleEdit(scope.$index, scope.row)"
                    >
                        <i class="iconfont iconbianji cl-iconfont is-square"></i>
                    </button>
                    <button class="handle-btn" @click="handleDelete(scope.$index, scope.row)">
                        <i class="iconfont iconshanchu cl-iconfont is-square"></i>
                    </button>
                </template>
            </el-table-column>
        </el-table>
        <div class="cl-pagination pageing"
            :class="{'noJumper':memberInfo.totalPages <= 10}"
             v-if="memberInfo.totalCount > 0">
            <el-pagination
                v-if="memberInfo.totalCount > 0"
                background
                :layout="memberInfo.totalPages > 10 ? 'total, slot, sizes, prev, pager, next,jumper': 'total, slot, sizes, prev, pager, next'"
                :total="memberInfo.totalCount"
                :page-sizes="[10,20,50]"
                @current-change="changePageNum"
                @size-change="changePageSize"
            >
                <div class="sizes-title">，每页显示</div>
                <button v-if="memberInfo.totalPages > 10" class="paging-confirm">跳转</button>
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
    },
    data() {
        return {
            remarkValue: "",
            tableHeight: 500
        };
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", () => {
                this.tableHeight = window.innerHeight - 260;
            });
            this.tableHeight = window.innerHeight - 260;
        });
    },
    methods: {
        checkbox(row) {
            if (row.row.isSystem === true && row.columnIndex === 0) {
                return "mycell";
            }
        },
        handleDisable(row, index) {
            // 函数需要一个返回值,true为可选,false为不可选择
            if (index == 0) {
                return false;
            } else {
                return true;
            }
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
            this.$emit("tabSelection", val);
        },
        changePageNum(page) {
            this.$emit("changePageNum", page);
        },
        changePageSize(size) {
            this.$emit("changePageSize", size);
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
    display: none !important;
}


</style>
<style  scoped>
.textareaWrap /deep/ .el-textarea .el-textarea__inner{
    padding-bottom: 20px;
}
.textareaWrap /deep/ .el-textarea .el-input__count{
    right: 22px;
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
            background: $--color-primary;
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

.myCell .el-checkbox__input {
    display: none;
}
.handle-btn-item {
    margin-right: 54px;
}
.table-list {
    .iconicon-dash-edit {
        &:hover {
            color: $--color-primary;
        }
    }
}
</style>


