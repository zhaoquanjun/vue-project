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

            <el-table-column label="视频名称" width="500">
                <template slot-scope="scope">
                    <div class="cover">
                        <img width="100%" :src="scope.row.coverUrl" />
                        <span class="play" @click="viewPic(scope.row,scope.$index)">
                            <img src="~img/file-icon/play.png" alt />
                        </span>
                    </div>
                    <!-- <img  @click="viewPic( scope.row,scope.$index)" :src="scope.row.coverUrl" class="cover" /> -->
                    <div v-if="(index == scope.$index)">
                        <el-input
                            type="text"
                            size="small"
                            placeholder="请输入内容"
                            v-model="scope.row.title"
                            maxlength="50"
                            show-word-limit
                            @blur="rename(scope.row.id,scope.row.title)"
                        ></el-input>
                        <div class="format">格式： {{scope.row.fileExtension}}</div>
                    </div>
                    <div v-else>
                        <div
                            class="img-name"
                            @click="rename(scope.row.id,scope.row.title,scope.$index)"
                        >{{scope.row.title}}</div>
                        <div class="format">格式： {{scope.row.fileExtension}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="sizeStr" label="大小" show-overflow-tooltip></el-table-column>
            <el-table-column prop="durationStr" label="时长"></el-table-column>
            <el-table-column prop="categoryName" label="分类"></el-table-column>

            <!--<el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="createTimeStr" label="上传时间"  width="150"  show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn move-btn" @click="handleMove(scope.row)">
                            <!-- <svg-icon style="width:27px;height:27px" icon-class="tab-move"></svg-icon> -->
                        </button>
                        <!-- <button
                            class="handle-btn look-btn"
                            @click="viewPic( scope.row,scope.$index)"
                        >
                            <svg-icon icon-class="tab-look"></svg-icon>
                        </button>-->
                        <button class="handle-btn delete-btn" @click="batchRemove( scope.row)">
                             <i class="iconfont iconhuishouzhan "></i>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding-left:16px;overflow: hidden;">
            <div class="storage-wrap">
                <span class="title">已用空间</span>
                <div class="use-storage">
                    <div class="progress-bar" :style="{'width':storageUsage.prograss+'%'}"></div>
                </div>
                <span
                    class="storage-content"
                >{{storageUsage.currentUsage}} / {{storageUsage.maxSize}}</span>
            </div>
            <div class="storage-wrap">
                <span class="title">已用流量</span>
                <div class="use-storage">
                    <div class="progress-bar" :style="{'width':usageTraffic.prograss+'%'}"></div>
                </div>
                <span
                    class="storage-content"
                >{{usageTraffic.currentUsage}} / {{usageTraffic.maxSize}}</span>
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
            <div id="img-list-dialog">
                <el-dialog
                    :visible.sync="imgVisible"
                    :modal-append-to-body="false"
                    @close="closeDialog"
                >
                    <video ref="video" class="video" :src="fullOssUrl" controls="controls" />
                    <div class="dislog-footer" slot="footer">
                        <span>{{picInfo.title}}</span>
                      
                        <span>大小: {{picInfo.sizeStr}}</span>
                          <span>格式: {{picInfo.fileExtension}}</span>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import {
    adminDownload,
    getStorageUsage,
    getCurrentUsageTraffic
} from "@/api/request/contentCommonApi.js";
export default {
    props: ["imgPageResult", "picSearchOptions", "treeResult"],
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
            storageUsage: {},
            usageTraffic: {}
        };
    },

    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", () => {
                this.tableHeight = window.innerHeight - 290;
            });
            this.tableHeight = window.innerHeight - 290;
        });
        this._getStorageUsage();
        this._getCurrentUsageTraffic();
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
        // 获取使用的内存
        async _getStorageUsage() {
            let { data, status } = await getStorageUsage("Video");
            this.storageUsage = {
                maxSize: this.bytesToSize(data.maxSize),
                currentUsage: this.bytesToSize(data.currentUsage, 1),
                prograss: (data.currentUsage / data.maxSize) * 100
            };
        },
        // 获取使用的流量
        async _getCurrentUsageTraffic() {
            let { data, status } = await getCurrentUsageTraffic("Video");

            this.usageTraffic = {
                maxSize: this.bytesToSize(data.maxSize),
                currentUsage: this.bytesToSize(data.currentUsage, 1),
                prograss: (data.currentUsage / data.maxSize) * 100
            };
            if (data.currentUsage >= data.maxSize) {
                this.$notify({
                    customClass: "notify-error",
                    message: `您的视频流量剩余量为0，为不影响您的网站效果，请及时联系管理员！!`,
                    duration: 1500
                });
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
            if (newName) {
                if (isNaN(index)) {
                    this.index = -1;
                    this.$emit("rename", id, newName);
                    return;
                }
                this.index = index;
            }
            else {
                this.$notify({
                    customClass: "notify-error",
                    message: `视频名称不能为空`,
                    showClose: false,
                    duration: 2000
                });
            }
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
        async _adminDownload(row) {
            let type = row.fileType;
            let id = row.id;
            let { data } = await adminDownload(type, id);
            this.fullOssUrl = data;
            this.imgVisible = true;
            // this.$nextTick(() => {
            //     this.$refs.video.play();
            // });
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
            this.$refs.video.pause();
        }
    }
};
</script>
<style scoped>
.el-input /deep/ .el-input__inner {
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
    width: 190px;
    height: 130px;
}
.img-name {
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
.cover {
    position: relative;
    .play {
        cursor: pointer;
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        border-radius: 2px;
        text-align: center;
        img {
            width: 30px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
.video {
    outline: none;
        width: 800px;
    height: 700px;
}
</style>


