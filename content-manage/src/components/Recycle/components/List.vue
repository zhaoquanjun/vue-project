<template>
    <div class="table-content" id="table-list">
        <el-table
            ref="multipleTable"
            :data="imgPageResult.list"
            tooltip-effect="dark"
            class="content-table"
            :height="tableHeight"
            @selection-change="handleSelectionChange"
        >
            <template slot="empty">
                <div class="empty-table">
                    <img src="~img/table-empty.png" />
                    <span>无数据</span>
                </div>
            </template>
            <el-table-column type="selection"></el-table-column>

            <el-table-column label="文件名称">
                <template slot-scope="scope">
                    <img :src="scope.row | fileCover" class="cover" />
                    <!-- <img src="../../../static/images/content-icon/file-cover.png" class="cover" /> -->
                    <span
                        class="img-name"
                        @click="rename(scope.row.id,scope.row.title,scope.$index)"
                    >{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="分类"></el-table-column>
            <el-table-column prop="createTimeStr" label="上传时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="downloadCount" label="删除时间"></el-table-column>
            <el-table-column label="操作" width="250" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn edit-icon" @click="handleEditor(scope.row)">
                            <i class="iconfont iconqiehuan"></i>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageing" id="pageing">
            <slot name="paging"></slot>
            <el-pagination
                background
                layout="total, sizes, prev, pager, next"
                :total="imgPageResult.totalRecord"
                :page-count="imgPageResult.totalPage"
                :page-size="picSearchOptions.pageSize"
                :page-sizes="[10,20,50]"
                @current-change="changePage"
                @size-change="changeSize"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    props: ["imgPageResult", "picSearchOptions"],
    data() {
        return {
            multipleSelection: [],
            changeCategoryPicId: null,
            tableHeight: 500
        };
    },
    filters: {
        fileCover: function(row) {
            let fileExtensionType = row.fileExtensionType;
            switch (fileExtensionType) {
                case 0:
                    return require("img/file-icon/video.png");
                case 1:
                    return require("img/file-icon/audio.png");
                case 2:
                    return require("img/file-icon/zip.png");
                case 3:
                    return require("img/file-icon/img.png");
                case 4:
                    return require("img/file-icon/document.png");
                default:
                    return require("img/file-icon/other.png");
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", () => {
                this.tableHeight = window.innerHeight - 310;
            });
            this.tableHeight = window.innerHeight - 310;
        });
    },
    methods: {
        /**
         * 单选或全选操作
         */
        handleSelectionChange(list) {
            console.log(list);
            this.multipleSelection = list;
            this.$emit("handleSelectionChange", list);
        },

        change(index) {
            this.fullOssUrl = this.imgList[index].fullOssUrl;
            this.picInfo = this.imgList[index];
        },

        changePage(page) {
            this.picSearchOptions.pageIndex = page;
            this.$emit("getPicList");
        },
        changeSize(size) {
            this.picSearchOptions.pageSize = size;
            this.$emit("getPicList");
        },
        batchRemove(row) {
            this.$emit("batchRemove", [row.id]);
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/manege-table.scss";
</style>


