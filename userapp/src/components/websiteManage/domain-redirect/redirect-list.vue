<template>
    <div class="table-list" id="table-list">
        <el-table
            ref="multipleTable"
            :data="tableData.list"
            tooltip-effect="dark"
            class="content-table"
        >
            <template slot="empty">
                <div class="empty-table">
                    <img src="~img/memberManage/table-empty.png" />
                    <p>暂无数据</p>
                </div>
            </template>
            <el-table-column prop="domain" label="源域名" class="domain-name">
                <template slot-scope="scope">
                    <span class="domain-name">{{scope.row.sourceDomain}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="httpsStatusDesc" label="目标域名">
                <template slot-scope="scope">
                    <span>{{scope.row.targetDomain}}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <!-- <button class="resolve-set" @click="expandSelect(scope.row,scope.row)">解析设置</button> -->
                        <el-tooltip content="编辑" placement="top">
                            <button class="handle-btn" @click="editor(scope.row)">
                                <i class="iconfont iconbianji"></i>
                            </button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <button
                                class="handle-btn"
                                @click="handleDelete(scope.row)"
                            >
                                <i class="iconfont iconshanchu"></i>
                            </button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: ["tableData"],
    data() {
        return {};
    },
    mounted() {},
    methods: {
        handleDelete(row){
            this.$emit("deleteCurDomain",row.id)
        },
        editor(row) {
            this.$emit("editor", row);
        }
    },
    watch: {}
};
</script>
<style scoped>
.el-table /deep/ thead :first-child > .cell {
    padding-left: 62px;
}
.el-table /deep/ thead th {
    padding: 0;
    height: 42px;
    background: #fff !important;
    color: #9f9f9f;
    font-weight: 400;
    font-size: 12px;
}

.el-table /deep/ .el-table__body .cell {
    color: #262626;
}

.el-table /deep/ .el-table__expanded-cell {
    background: #eee;
    padding: 16px 32px;
}

.el-table /deep/ th > .cell {
    text-align: left;
}
</style>
<style lang="scss" scoped>
.table-list {
    border: 1px solid #eeeeee;
}
.handle-btn-wrap {
    width: 70%;
    .handle-btn {
        margin-right: 32px;
        .iconhuishouzhan:hover,
        .iconcaozuo:hover {
            color: #09cceb;
        }
    }
}
.domain-name {
    padding-left: 50px;
}
</style>

