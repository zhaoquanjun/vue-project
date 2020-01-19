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
                <div class="empty-table" style="cursor:default">
                    <img src="~img/table-empty-default.png" />
                    <p>无数据</p>
                </div>
            </template>
            <el-table-column v-if="!['page'].includes(recycleTempData.type)" type="selection"></el-table-column>

            <el-table-column :label="recycleTempData.firstColumnName" :width="videoWidth">
                <template slot-scope="scope">
                    <img
                        v-if="['file'].includes(recycleTempData.type)"
                        :src="scope.row | fileCover"
                        class="cover"
                    />
                    <img
                        onerror="onImgError(this)"
                        v-if="['news'].includes(recycleTempData.type)"
                        :src="scope.row.pictureUrl ? scope.row.pictureUrl : newsDefaultImg"
                        class="cover"
                    />
                    <img
                        onerror="onImgError(this)"
                        v-if="['product'].includes(recycleTempData.type)"
                        :src="scope.row.thumbnailPicUrlList[0] ? scope.row.thumbnailPicUrlList[0]+'?x-oss-process=image/resize,m_lfit,h_40,w_40' : newsDefaultImg"
                        class="cover"
                    />

                    <!-- <img v-if="['audio'].includes(recycleTempData.type)" :src="audioDefaultImg ? audioDefaultImg : newsDefaultImg" class="cover" /> -->
                    <div class="cover" v-if="['audio'].includes(recycleTempData.type)">
                        <img width="100%" src="~img/file-icon/audio.png" />
                        <!-- <span class="play" @click="viewPic( scope.row,scope.$index)">
                            <img src="~img/file-icon/play.png" alt />
                        </span>-->
                    </div>
                    <div class="video-cover" v-if="['video'].includes(recycleTempData.type)">
                        <img :src="scope.row.coverUrl" />
                        <!-- <span class="play" @click="viewPic( scope.row,scope.$index)">
                            <img src="~img/file-icon/play.png" alt />
                        </span>-->
                    </div>
                    <img
                        v-if="['pic'].includes(recycleTempData.type)"
                        :src="scope.row.zoomOssUrl"
                        class="cover"
                    />
                    <!-- <img src="../../../static/images/content-icon/file-cover.png" class="cover" /> -->
                    <div v-if="contentType==='video'">
                        <div
                            class="video-img-name"
                        >{{scope.row.title}}</div>
                        <div class="format">格式： {{scope.row.fileExtension}}</div>
                    </div>
                    <span
                        v-else
                        class="img-name"
                        style="cursor:auto"
                    >{{ recycleTempData.type == 'product' ? scope.row.name : scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="['file'].includes(recycleTempData.type)"
                prop="fileExtensionTypeStr"
                label="文件类型"
            ></el-table-column>
            <el-table-column
                v-if="['audio'].includes(recycleTempData.type)"
                prop="fileExtension"
                label="格式"
            ></el-table-column>
            <el-table-column
                v-if="['pic','file','video','audio'].includes(recycleTempData.type)"
                prop="sizeStr"
                label="大小"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                v-if="['page'].includes(recycleTempData.type)"
                prop="url"
                label="页面地址"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                v-if="!['page'].includes(recycleTempData.type)"
                prop="categoryName"
                :label="recycleTempData.secondColumnName"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span>{{ recycleTempData.type == 'product' ? getProductCateNames(scope.row.productCategoryList) : scope.row.categoryName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="['page'].includes(recycleTempData.type)"
                prop="siteName"
                :label="recycleTempData.secondColumnName"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                v-if="['page'].includes(recycleTempData.type)"
                prop="pageTypeStr"
                label="页面类型"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                min-width="150"
                prop="deleteTimePrt"
                :label="recycleTempData.thirdColumnName"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span>{{ recycleTempData.type == 'news' ? scope.row.deleteTimePrt : scope.row.deleteTimeStr }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="deleteDeadline" :label="recycleTempData.forthColumnName"></el-table-column>
            <el-table-column label="操作" width="150" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <el-tooltip class="item" effect="dark" content="恢复" placement="top">
                            <i  @click="handleRecoveryData(scope.row)" class="cl-iconfont iconfont iconhuifu is-square"></i>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="cl-paganation pageing" id="pageing" :class="{'noJumper':recyclePageResult.totalPage <= 10}">
            <slot name="paging"></slot>
            <el-pagination
                v-if="recyclePageResult.totalRecord > 0"
                background
                :layout="recyclePageResult.totalPage > 10 ? 'total, slot, sizes, prev, pager, next,jumper': 'total, slot, sizes, prev, pager, next'"
                :total="recyclePageResult.totalRecord"
                :page-size="recycleSearchOptions.pageSize"
                :page-sizes="[10,20,50]"
                @current-change="changePage"
                @size-change="changeSize"
            >
                <div class="sizes-title">，每页显示</div>
                <button v-if="recyclePageResult.totalPage > 10" class="paging-confirm">跳转</button>
            </el-pagination>
        </div>
        <div id="img-list-dialog">
            <el-dialog :visible.sync="imgVisible" :modal-append-to-body="false">
                <video
                    v-if="contentType==='video'"
                    class="video"
                    :src="fullOssUrl"
                    controls="controls"
                />
                <audio v-else class="audio" :src="fullOssUrl" controls="controls" />
                <div class="dislog-footer" slot="footer">
                    <span>{{picInfo.title}}</span>
                    <span>分类: {{picInfo.categoryName}}</span>
                    <span>大小: {{picInfo.sizeStr}}</span>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { adminDownload } from "@/api/request/contentCommonApi.js";
export default {
    props: [
        "recyclePageResult",
        "recycleSearchOptions",
        "recycleTempData",
        "contentType"
    ],
    data() {
        return {
            videoWidth: "",
            newsDefaultImg: require("img/content-default-pic.png"),
            audioDefaultImg: require("img/content-default-pic.png"),
            defaultImg: require("img/content-default-pic.png"),
            multipleSelection: [],
            changeCategoryPicId: null,
            tableHeight: 500,
            fullOssUrl: "",
            imgVisible: false,
            picInfo: {},
            imgList: ""
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
                this.tableHeight = window.innerHeight - 350;
            });
            this.tableHeight = window.innerHeight - 350;
        });
        if (this.contentType === "video") {
            this.videoWidth = 500;
        }
         window.onImgError = (ele)=> {
            ele.src = ele.attributes["src"]=this.defaultImg
        };
    },
    methods: {
         onImgError(ele){
            ele.src = ele.attributes["src"]=this.defaultImg
        },
        
        /**
         * 恢复数据
         */
        handleRecoveryData(row) {
            console.log(row);
            if(['page'].includes(this.recycleTempData.type)){
                this.$emit("batchRecovery", row);
            }else{
                this.$emit("batchRecovery", [row.id]);
            }
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
        getProductCateNames(cateList) {
            let cateNames = "";
            cateList.forEach(item => {
                cateNames += item.displayName + ";";
            });
            cateNames = cateNames.slice(0, cateNames.length - 1);
            return cateNames;
        },
        viewPic(row, index) {
            this.imgList = this.recyclePageResult.list;
            this.picInfo = this.imgList[index];

            if (this.contentType === "video") {
                this.fullOssUrl = row.ossFullUrl;
                this.imgVisible = true;
            } else {
                this._adminDownload(row);
            }
        },
        async _adminDownload(row) {
            console.log();
            let type = row.fileType;
            let id = row.id;
            let { data } = await adminDownload(type, id);
            this.fullOssUrl = data;
            this.imgVisible = true;
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/content-manage/manege-table.scss";
.table-content /deep/ .el-table__empty-text{
    width: 0;
}
.video-img-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-wrap: break-word;
    margin-bottom: 30px;
}
.format {
    white-space: unset !important;
}
.video-cover {
    display: inline-block;
    width: 190px;
    height: 130px;
    margin-right: 10px;
    position: relative;
    img {
        height: 130px;
        width: 190px;
    }
}
</style>


