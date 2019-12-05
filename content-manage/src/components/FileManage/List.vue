<template>
    <div class="table-content" id="table-list">
        <el-table
            ref="multipleTable"
            :data="imgPageResult.list"
            tooltip-effect="dark"
            class="content-table"
            :height="tableHeight"
            @selection-change="handleSelectionChange"
            @sort-change='sortChange'
        >
            <template slot="empty">
                <div class="empty-table">
                    <img src="~img/table-empty.png" />
                    <p>无数据</p>
                </div>
            </template>
            <el-table-column type="selection"></el-table-column>

            <el-table-column label="文件名称" min-width="160">
                <template slot-scope="scope">
                    <span class="isTop" v-show="scope.row.isTop">置顶</span>
                    <span class="file-cover cover">
                        <img width="100%" :src="scope.row | fileCover" />
                    </span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.title"
                        placement="top"
                    >
                        <span style="width:150px" :title="scope.row.title">{{scope.row.title }}</span>
                        <!--  @click="rename(scope.row.id,scope.row.title,scope.$index)" -->
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="fileExtension" label="文件格式" min-width="90">
                <template slot-scope="scope">
                    <span>{{ scope.row.fileExtension | formatterFileExt}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="分类" min-width="100">
                <template slot-scope="scope">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.categoryName"
                        placement="top"
                    >
                        <div class="ellipsis" style="width:100px">{{ scope.row.categoryName }}</div>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column prop="sizeStr" sortable='custom' label="大小" show-overflow-tooltip min-width="80"></el-table-column>
            <!-- <el-table-column prop="downloadCount" label="置顶" min-width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.isTop?"是":"否" }}</span>
                </template>
            </el-table-column>-->
            <el-table-column prop="downloadCount" sortable='custom' min-width="100" label="下载次数">
                <template slot-scope="scope">
                    <span>{{ scope.row.downloadCount}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTimeStr" sortable='custom' min-width="150" label="上传时间">
                <template slot-scope="scope">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.createTimeStr"
                        placement="top"
                    >
                        <div class="ellipsis">{{ scope.row.createTimeStr}}</div>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                min-width="160"
                v-if="$store.state.dashboard.isContentwrite"
            >
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button
                            class="handle-btn edit-icon"
                            @click="handleEditor(scope.row)"
                            style="margin-right:16px"
                        >
                            <i class="iconfont iconbianji cl-iconfont is-square"></i>
                        </button>
                        <button
                            class="handle-btn look-btn edit-icon"
                            @click="download(scope.row)"
                            style="margin-right:16px"
                        >
                            <i class="iconfont iconxiazai cl-iconfont is-square"></i>
                        </button>
                        <button
                            class="more-operate"
                            @click.stop="_handleShowMoreOperate($event,scope.row)"
                            style="margin-right:16px"
                        >
                            <i class="iconfont iconsangedian cl-iconfont is-square"></i>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="list-footer">
            <div class="storage-wrap">
                <span class="storage-content">{{currentUsage}} / {{maxSize}}</span>
                <div class="use-storage">
                    <div class="progress-bar" :style="{'width':prograss+'%'}"></div>
                </div>
            </div>
            <div class="cl-paganation pageing" id="pageing" :class="{'noJumper':imgPageResult.totalPage <= 10}">
                <slot name="paging"></slot>
                <el-pagination
                    v-if="imgPageResult.totalRecord > 0"
                    background
                    :layout="imgPageResult.totalPage > 10 ? 'total, slot, sizes, prev, pager, next,jumper': 'total, slot, sizes, prev, pager, next'"
                    :total="imgPageResult.totalRecord"
                    :page-size="imgPageResult.pageSize"
                    :page-sizes="[10,20,50]"
                    @current-change="changePage"
                    @size-change="changeSize"
                >
                    <div class="sizes-title">，每页显示</div>
                    <button v-if="imgPageResult.totalPage > 10" class="paging-confirm">跳转</button>
                </el-pagination>
            </div>
        </div>

        <!-- :title="picTitle" -->
        <div id="img-list-dialog">
            <el-dialog :visible.sync="imgVisible" :modal-append-to-body="false">
                <!-- //<img :src="picUrl"> -->
                <el-carousel
                    :autoplay="false"
                    :initial-index="initial"
                    arrow="always"
                    indicator-position="none"
                    :loop="true"
                    @change="change"
                >
                    <el-carousel-item v-for="item in imgList" :key="item.id">
                        <h3>
                            <video :src="fullOssUrl" controls="controls" />
                        </h3>
                    </el-carousel-item>
                </el-carousel>
                <div class="dislog-footer" slot="footer">
                    <el-tooltip
                        class="item"
                        effect="light"
                        :content="picInfo.title"
                        placement="top"
                    >
                        <span class="ellipsis" style="width:150px">{{picInfo.title}}</span>
                    </el-tooltip>
                    <span>分类: {{picInfo.categoryName}}</span>
                    <span>大小: {{picInfo.sizeStr}}</span>
                </div>
            </el-dialog>
        </div>
        <ul class="operate-section" ref="operateSection">
            <li
                class="operate-item"
                v-for="(it, index) in operateList"
                :key="index"
                @click="handleMoreOperate(it.flag)"
            >{{it.name}}</li>
        </ul>
    </div>
</template>

<script>
import { adminDownload } from "@/api/request/contentCommonApi.js";
export default {
    props: ["imgPageResult", "picSearchOptions", "useStorage"],
    data() {
        return {
            picInfo: {},
            index: -1, //
            isRename: true, // 重命名图片名称
            initial: 0,
            imgVisible: false,
            multipleSelection: [],
            picUrl: null,
            picTitle: null,
            categoryVisable: false,
            changeCategoryPicId: null,
            imgList: "",
            fullOssUrl: "",

            tableHeight: 500,
            operateList: [
                { name: "置顶", flag: "isTop" },
                { name: "删除", flag: "delete" }
            ],
            maxSize: 0,
            currentUsage: 0,
            prograss: 0
        };
    },
    filters: {
        fileCover: function(row) {
            let fileExtensionType = row.fileExtensionType;
            let fileExtension = row.fileExtension;

            let excelAry = [
                ".xlsx",
                ".xlsm",
                "xltx",
                ".xltm",
                ".xlsb",
                ".xlam"
            ];
            let wordAry = [".docx", ".docm", ".dotx", ".dotm"];
            let pptAry = [
                ".pptx",
                ".pptm",
                ".ppsx",
                ".ppsx",
                ".potx",
                ".potm",
                ".ppam",
                ".ppt"
            ];
            let pdfAry = [".pdf"];
            let txtAry = [".txt"];
            if (excelAry.includes(fileExtension)) {
                return require("img/file-icon/new/excel.png");
            } else if (wordAry.includes(fileExtension)) {
                return require("img/file-icon/new/word.png");
            } else if (pptAry.includes(fileExtension)) {
                return require("img/file-icon/new/ppt.png");
            } else if (pdfAry.includes(fileExtension)) {
                return require("img/file-icon/new/pdf.png");
            } else if (txtAry.includes(fileExtension)) {
                return require("img/file-icon/new/txt.png");
            }
            switch (fileExtensionType) {
                case 0:
                    return require("img/file-icon/new/video.png");
                case 1:
                    return require("img/file-icon/new/audio.png");
                case 2:
                    return require("img/file-icon/new/zip.png");
                case 3:
                    return require("img/file-icon/new/picture.png");
                case 4:
                    return require("img/file-icon/document.png");
                default:
                    return require("img/file-icon/new/other.png");
            }
        },
        formatterFileExt(fileExt) {
            if (fileExt) {
                if (fileExt.substring(0, 1) == ".") return fileExt.substring(1);
                return fileExt;
            }
            return "";
        }
    },
    mounted() {
        document.addEventListener("click", () => {
            this.$nextTick(() => {
                if (this.$refs.operateSection)
                    this.$refs.operateSection.style.display = "none";
            });
        });

        this.$nextTick(() => {
            window.addEventListener("resize", () => {
                this.tableHeight = window.innerHeight - 260;
            });
            this.tableHeight = window.innerHeight - 260;
        });
    },
    methods: {
        bytesToSize(bytes, flag) {
            if (bytes === 0) return "0 B";
            let k = 1024;
            let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
            let i = Math.floor(Math.log(bytes) / Math.log(k));
            let b = bytes / Math.pow(k, i);
            if (flag === 1) {
                b = b.toFixed(2);
            }
            let storage = b + sizes[i];
            return storage;
        },
        /**
         * 单选或全选操作
         */
        handleSelectionChange(list) {
            this.multipleSelection = list;
            this.$emit("handleSelectionChange", list);
        },
        /**
         * 编辑
         */
        handleEditor(row) {
            this.categoryVisable = true;
            this.changeCategoryPicId = row.id;
            this.$emit("editor", true, row);
        },

        download(row) {
            //this.userDownload(row)
            this.adminDownload(row);
            ++row.downloadCount;
        },
        /**
         * 用户下载
         */
        async userDownload(row) {
            this.$router.push({
                path: row.downloadPage
            });
        },
        /**
         * 下载
         */
        async adminDownload(row) {
            let type = row.fileType;
            let id = row.id;
            let { data } = await adminDownload(type, id);

            var link = document.createElement("a");
            link.download = row.title;
            link.style.display = "none";
            link.href = data;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
        },
        _handleShowMoreOperate(ev, row) {
            this.row = row;
            this.operateList = [
                { name: row.isTop ? "取消置顶" : "置顶", flag: "stick" },
                { name: "删除", flag: "delete" }
            ];
            let clientH =
                document.getElementsByClassName("more-operate")[0]
                    .clientHeight + 10;
            let clientW = this.$refs.operateSection.clientWidth;

            this.$refs.operateSection.style.right =
                document.documentElement.clientWidth -
                ev.pageX +
                ev.offsetX +
                "px";
            this.$refs.operateSection.style.top = ev.pageY - ev.offsetY + "px";

            if (this.$refs.operateSection.style.display == "block") {
                this.$refs.operateSection.style.display = "none";
            } else {
                this.$refs.operateSection.style.display = "block";
            }
        },
        handleMoreOperate(flag) {
            let row = this.row;
            switch (flag) {
                case "stick":
                    this.$emit("switchIsTopStatus", !row.isTop, [row.id]);
                    break;
                case "delete":
                    this.$emit("batchRemove", [row.id]);
                    break;
            }
        },
        //改变排序
        sortChange(row){
                    // value: "CreateTime",
                    // label: "创建时间"
                    // value: "FileSize",
                    // label: "文件大小"
                    // value: "DownloadCount",
                    // label: "下载次数"
            if (row.prop == 'sizeStr') {
                this.picSearchOptions.orderByType = "FileSize";
            } else if (row.prop == 'downloadCount'){
                this.picSearchOptions.orderByType = "DownloadCount";
            } else {
                this.picSearchOptions.orderByType = "CreateTime";
            }
            if (row.order == 'ascending') {
                this.picSearchOptions.isDescending  = false;
            } else {
                this.picSearchOptions.isDescending = true;
            }
           this.$emit("getPicList");
        }
    },
    watch: {
        useStorage() {
            this.maxSize = this.bytesToSize(this.useStorage.maxSize);
            this.currentUsage = this.bytesToSize(
                this.useStorage.currentUsage,
                1
            );
            this.prograss =
                (this.useStorage.currentUsage / this.useStorage.maxSize) * 100;
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/content-manage/manege-table.scss";
.file-cover {
    width: 22px;
    height: 28px;
}
.el-table /deep/ .ascending .sort-caret.ascending{
    border-bottom-color: $--color-primary ;
}
.el-table /deep/ .descending .sort-caret.descending{
    border-top-color: $--color-primary ;
}
</style>


