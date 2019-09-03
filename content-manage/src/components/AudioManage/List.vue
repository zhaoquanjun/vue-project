<template>
    <div class="table-wrap" id="table-list">
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
            <el-table-column label="音频名称" min-width="150">
                <template slot-scope="scope">
                      <div class="cover">
                        <img width="100%" src="~img/file-icon/audio.png" />
                        <span class="play"  @click="viewPic( scope.row,scope.$index)">
                            <img src="~img/file-icon/play.png" alt />
                        </span>
                    </div>
                    <el-input
                        v-if="(index == scope.$index)"
                        type="text"
                        size="small"
                        placeholder="请输入内容"
                        v-model="scope.row.title"
                        maxlength="30"
                        show-word-limit
                        @blur="rename(scope.row.id,scope.row.title)"
                    ></el-input>
                    <span
                        class="img-name"
                        v-else
                        @click="rename(scope.row.id,scope.row.title,scope.$index)"
                    >{{scope.row.title}}</span>
                    <!-- <input v-model="scope.row.title" />
                    <el-button @click="rename(scope.row.id,scope.row.title)">更新名称</el-button>-->
                </template>
            </el-table-column>
            <el-table-column prop="fileExtension" label="格式" :formatter="formatterFileExt"></el-table-column>
            <el-table-column prop="sizeStr" label="大小" show-overflow-tooltip></el-table-column>
            <el-table-column prop="durationStr" label="时长"></el-table-column>
            <el-table-column prop="categoryName" label="分类"></el-table-column>

            <!--<el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="createTimeStr" width="150" label="上传时间" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn move-btn" @click="handleMove(scope.row)">
                            <!-- <svg-icon style="width:27px;height:27px" icon-class="tab-move"></svg-icon> -->
                        </button>
                        <button class="handle-btn delete-btn" @click="batchRemove( scope.row)">
                             <i class="iconfont iconhuishouzhan "></i>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding-left:16px;overflow: hidden;">
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
                <el-dialog
                    :visible.sync="imgVisible"
                    :modal-append-to-body="false"
                    @close="closeDialog"
                >
                    <audio ref="audio" class="audio" :src="fullOssUrl" controls="controls" />
                    <div class="dislog-footer" slot="footer">
                        <span>{{picInfo.title}}</span>
                        <span>分类: {{picInfo.categoryName}}</span>
                        <span>大小: {{picInfo.sizeStr}}</span>
                    </div>
                </el-dialog>
            </div>
        </div>
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
            loadingShow: true,
            tableHeight: 500,
            maxSize: 0,
            currentUsage: 0,
            prograss: 0
        };
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", () => {
                this.tableHeight = window.innerHeight - 290;
            });
            this.tableHeight = window.innerHeight - 290;
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
         * 管理员下载
         */
        async _adminDownload(row) {
            console.log();
            let type = row.fileType;
            let id = row.id;
            let { data } = await adminDownload(type, id);
            this.fullOssUrl = data;
            this.imgVisible = true;
            //  this.$nextTick(()=>{
            //      this.$refs.audio.play()
            // })
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
         * 移动分类
         */
        handleMove(row) {
            this.categoryVisable = true;
            this.changeCategoryPicId = row.id;
            this.$emit("moveClassify", true, row);
        },
        changeCategory(data) {
            this.$emit("changeCategory", data.id, [this.changeCategoryPicId]);
            this.categoryVisable = false;
        },
        // 重命名图片名称
        rename(id, newName, index) {
            if (isNaN(index)) {
                this.index = -1;
                this.$emit("rename", id, newName);
                return;
            }
            this.index = index;
            //this.$emit("rename", id, newName);
        },
        blurRename(id, newName) {},
        /**
         * 查看大图
         */
        viewPic(row, index) {
            this.imgList = this.imgPageResult.list;
            this.picInfo = this.imgList[index];
            this._adminDownload(row);
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
        closeDialog() {
            this.$refs.audio.pause();
        },
        formatterFileExt(row, column) {
            if (row.fileExtension.substring(0, 1) == ".")
                return row.fileExtension.substring(1);
            return row.fileExtension;
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
<style scoped>
.el-table /deep/ .el-table__row .el-input .el-input__inner {
    padding-right: 50px;
}
.el-table /deep/ .el-table__row .el-input .el-input__suffix {
    display: flex;
    align-items: center;
}
</style>
<style lang="scss" scoped>
@import "../../styles/manege-table.scss";
.cover {
    position: relative;
    &:hover .play {
        cursor: pointer;
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        border-radius: 2px;
        text-align: center;
        img {
            width: 12px;
            transform: translateY(50%);
        }
    }
}
</style>



