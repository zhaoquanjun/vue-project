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

            <el-table-column label="文件名称" width="250">
                <template slot-scope="scope">
                    <img :src="scope.row | fileCover" class="cover" />
                    <!-- <img src="../../../static/images/content-icon/file-cover.png" class="cover" /> -->
                    <span
                        class="img-name" :title="scope.row.title"
                        @click="rename(scope.row.id,scope.row.title,scope.$index)"
                    >{{scope.row.title}}</span>
                    <!-- <input v-model="scope.row.title" />
                    <el-button @click="rename(scope.row.id,scope.row.title)">更新名称</el-button>-->
                </template>
            </el-table-column>
            <el-table-column prop="fileExtensionTypeStr" label="文件类型"></el-table-column>
            <el-table-column prop="categoryName" label="分类" show-overflow-tooltip></el-table-column>

            <el-table-column prop="sizeStr" label="大小" show-overflow-tooltip></el-table-column>
            <el-table-column prop="downloadCount" label="置顶">
                <template slot-scope="scope">
                    <span>{{ scope.row.isTop?"是":"否" }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="downloadCount" label="下载次数"></el-table-column>
            <el-table-column prop="createTimeStr"  width="150" label="上传时间" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" width="250" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn edit-icon" @click="handleEditor(scope.row)">
                            <i class="iconfont iconcaozuo"></i>
                        </button>
                        <button class="handle-btn look-btn edit-icon" @click="download(scope.row)">
                            <i class="iconfont iconCell-Download"></i>
                        </button>
                        <!-- <button class="handle-btn delete-btn" @click="batchRemove( scope.row)">
                            <svg-icon icon-class="l-recyclebin"></svg-icon>
                        </button>-->
                        <span
                            class="more-operate"
                            @click.stop="_handleShowMoreOperate($event,scope.row)"
                        >
                            <i class="iconfont iconsangedian"></i>
                        </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="storage-wrap">
            <div class="use-storage">
                <div class="progress-bar" :style="{'width':prograss+'%'}"></div>
            </div>
            <span class="storage-content">{{currentUsage}} / {{maxSize}}</span>
        </div>
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
                    <span>{{picInfo.title}}</span>
                    <span>分类: {{picInfo.categoryName}}</span>
                    <span>尺寸: {{picInfo.sizeStr}}</span>
                    <span>大小: {{picInfo.size}}</span>
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
            console.log(list);
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
            link.download = row.title;;
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

            this.$refs.operateSection.style.left =
                ev.pageX - ev.offsetX + 28 + "px";
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
@import "../../styles/manege-table.scss";
</style>


