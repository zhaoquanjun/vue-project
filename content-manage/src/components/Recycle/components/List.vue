<template>
    <div class="table-content" id="table-list">
        <el-table
            ref="multipleTable"
            :data="recyclePageResult.list"
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

            <el-table-column :label="recycleTempData.firstColumnName">
                <template slot-scope="scope">
                    <img v-if="['file'].includes(recycleTempData.type)" :src="scope.row | fileCover" class="cover" />
                    <img v-if="['news'].includes(recycleTempData.type)" :src="scope.row.pictureUrl ? scope.row.pictureUrl : newsDefaultImg" class="cover" />
                    <img v-if="['product'].includes(recycleTempData.type)" :src="scope.row.thumbnailPicUrlList[0] ? scope.row.thumbnailPicUrlList[0]+'?x-oss-process=image/resize,m_lfit,h_40,w_40' : newsDefaultImg" class="cover" />
                    <img v-if="['audio'].includes(recycleTempData.type)" :src="audioDefaultImg ? audioDefaultImg : newsDefaultImg" class="cover" />
                    <img v-if="['pic'].includes(recycleTempData.type)" :src="scope.row.zoomOssUrl" class="cover" />
                    <!-- <img src="../../../static/images/content-icon/file-cover.png" class="cover" /> -->
                    <span
                        class="img-name"
                        @click="rename(scope.row.id,scope.row.title,scope.$index)"
                    >{{ recycleTempData.type == 'product' ? scope.row.name : scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="['file'].includes(recycleTempData.type)" prop="fileExtensionTypeStr" label="文件类型"></el-table-column>
            <el-table-column v-if="['audio'].includes(recycleTempData.type)" prop="fileExtension" label="格式"></el-table-column>
            <el-table-column v-if="['pic','file','video','audio'].includes(recycleTempData.type)" prop="sizeStr" label="大小" show-overflow-tooltip></el-table-column>
            <el-table-column prop="categoryName" :label="recycleTempData.secondColumnName" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ recycleTempData.type == 'product' ? getProductCateNames(scope.row.productCategoryList) : scope.row.categoryName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="deleteTimePrt" :label="recycleTempData.thirdColumnName" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ recycleTempData.type == 'news' ? scope.row.deleteTimePrt : scope.row.deleteTimeStr }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="deleteDeadline" :label="recycleTempData.forthColumnName"></el-table-column>
            <el-table-column label="操作" width="250" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn edit-icon" @click="handleRecoveryData(scope.row)">
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
                :total="recyclePageResult.totalRecord"
                :page-count="recyclePageResult.totalPage"
                :page-size="recycleSearchOptions.pageSize"
                :page-sizes="[10,20,50]"
                @current-change="changePage"
                @size-change="changeSize"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    props: ["recyclePageResult", "recycleSearchOptions", "recycleTempData"],
    data() {
        return {
            newsDefaultImg: require("../../../../static/images/content-default-pic.png"),
            audioDefaultImg: require("../../../../static/images/content-default-pic.png"),
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
            console.log(this.recyclePageResult)
            window.addEventListener("resize", () => {
                this.tableHeight = window.innerHeight - 310;
            });
            this.tableHeight = window.innerHeight - 310;
        });
    },
    methods: {
        /**
         * 恢复数据
         */
        handleRecoveryData(row) {
            console.log(row);
            this.$emit("batchRecovery", [row.id]);
        },
        /**
         * 单选或全选操作
         */
        handleSelectionChange(list) {
            console.log(list);
            this.multipleSelection = list;
            this.$emit("handleSelectionChange", list);
        },

        changePage(page) {
            this.recycleSearchOptions.pageIndex = page;
            this.$emit("getRecycleDataList");
        },
        changeSize(size) {
            this.recycleSearchOptions.pageSize = size;
            this.$emit("getRecycleDataList");
        },
        getProductCateNames(cateList){
            let cateNames = "";
            cateList.forEach((item) => {
                cateNames += item.displayName+";";
            });
            cateNames = cateNames.slice(0,cateNames.length -1);
            return cateNames;
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/manege-table.scss";
</style>


