<template>
    <div class="table-wrap" id="table-list">
        <el-table
            ref="multipleTable"
            :data="imgPageResult.list"
            tooltip-effect="dark"
            class="content-table table-content"
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

            <el-table-column label="视频名称" width="350">
                <template slot-scope="scope">
                    <div class="cover">
                        <img width="100%" height="100%" :src="scope.row.coverUrl" />
                        <span class="play" @click="viewPic(scope.row,scope.$index)">
                            <div class="play-btn">
                                <span></span>
                            </div>
                        </span>
                    </div>
                    <div v-if="(index == scope.$index)">
                        <el-input
                            type="text"
                            size="small"
                            ref="renameInput"
                            placeholder="请输入内容"
                            v-model="scope.row.title"
                            maxlength="50"
                            show-word-limit
                            @blur="rename(scope.row.id,scope.row)"
                        ></el-input>
                        <div class="format">格式： {{formatterFileExt(scope.row.fileExtension)}}</div>
                    </div>
                    <div v-else>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            :content="scope.row.title"
                            placement="top"
                        >
                            <div
                                class="file-title cursor-p"
                                @click="rename(scope.row.id,scope.row,scope.$index)"
                            >{{scope.row.title}}</div>
                        </el-tooltip>

                        <div class="format">格式： {{formatterFileExt(scope.row.fileExtension)}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="sizeStr" sortable='custom' label="大小" show-overflow-tooltip></el-table-column>
            <el-table-column prop="durationStr" label="时长"></el-table-column>
            <el-table-column prop="categoryName" label="分类" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.categoryName }}</span>
                </template>
            </el-table-column>

            <!--<el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="createTimeStr" sortable='custom' label="上传时间" width="150" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" width="150" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="more-operate" @click="handleMove(scope.row)" style="margin-right:16px">
                            <i class="iconfont  iconyidong cl-iconfont is-square"></i>
                        </button>
                        <button class="more-operate delete-btn" @click="batchRemove( scope.row)">
                            <i class="iconfont iconshanchu cl-iconfont is-square"></i>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="list-footer">
            <div class="storage-wrap">
                <div class="use-title">
                    <span class="title">已用空间</span>
                    <span class="storage-content">
                        {{storageUsage.currentUsage}} /3 {{storageUsage.maxSize}}
                    </span>
                </div>
                <div class="use-storage">
                    <div class="progress-bar" :style="{'width':storageUsage.prograss+'%'}"></div>
                </div>
            </div>
            <div class="storage-wrap">
                <div class="use-title">
                    <span class="title">已用流量</span>
                    <span class="storage-content">
                        {{usageTraffic.currentUsage}} / {{usageTraffic.maxSize}}
                    </span>
                </div>
                <div class="use-storage">
                    <div class="progress-bar" :style="{'width':usageTraffic.prograss+'%'}"></div>
                </div>
            </div>
            <div 
                class="cl-paganation pageing" 
                id="pageing" 
                :class="{'noJumper':imgPageResult.totalPage <= 10}"
            >
                <slot name="paging"></slot>
                <el-pagination
                    background
                    :layout="imgPageResult.totalPage > 10 ? 'total, slot, sizes, prev, pager, next,jumper': 'total, slot, sizes, prev, pager, next'"
                    :total="imgPageResult.totalRecord"
                    :page-size="picSearchOptions.pageSize"
                    :page-sizes="[10,20,50,5]"
                    @current-change="changePage"
                    @size-change="changeSize"
                >
                    <div class="sizes-title">，每页显示</div>
                    <button v-if="imgPageResult.totalPage > 10" class="paging-confirm">跳转</button>
                </el-pagination>
            </div>
        </div>
        <div id="img-list-dialog">
            <el-dialog
                :visible.sync="imgVisible"
                :modal-append-to-body="false"
                @close="closeDialog"
            >
                <video ref="video" class="video" :src="fullOssUrl" controls="controls" />
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    adminDownload,
    getStorageUsage,
    getCurrentUsageTraffic
} from "@/api/request/contentCommonApi.js";
import { trim } from "@/utlis/index.js";
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
        rename(id, row, index) {
            console.log(row);
            if (row.title) this.newName = row.title;
            if (!trim(row.title)) {
                row.title = this.newName;
                this.$notify({
                    customClass: "notify-error",
                    message: `视频名称不能为空`,
                    showClose: false,
                    duration: 2000
                });
                return false;
            }
            if (isNaN(index)) {
                this.index = -1;
                this.$emit("rename", id, row.title);
                return;
            }
            this.index = index;
            this.$nextTick(() => {
                this.$refs.renameInput.focus();
            });
        },
        blurRename(id, newName) {},
        /**
         *   
         */
        viewPic(row, index) {
            if (!row.isLoadFinish) {
                this.$notify({
                    customClass: "notify-error",
                    message: `视频正在加载中,请稍后点击播放`,
                    showClose: false,
                    duration: 2000
                });
                return;
            }
            this.imgList = this.imgPageResult.list;
            this.picInfo = this.imgList[index];
            this._adminDownload(row)
          
        },
        async _adminDownload(row) {
            let type = row.fileType;
            let id = row.id;
            let { data } = await adminDownload(type, id);
            this.fullOssUrl = data;
            this.imgVisible = true;
            this.$nextTick(() => {
                this.$refs.video.play();
            });
        },
        changePage(page) {
            this.picSearchOptions.pageIndex = page;
            this.$emit("getList");
        },
        changeSize(size) {
            this.picSearchOptions.pageSize = size;
            this.$emit("getList");
        },
        batchRemove(row) {
            this.$emit("batchRemove", [row.id]);
        },
        closeDialog() {
            this.$refs.video.pause();
        },
        formatterFileExt(fileExt) {
            if (fileExt) {
                if (fileExt.substring(0, 1) == ".") return fileExt.substring(1);
                return fileExt;
            }
            return "";
        },
        //改变排序
        sortChange(row){
                    // value: "CreateTime",
                    // label: "创建时间"
                    // value: "FileSize",
                    // label: "文件大小"
            console.log(row,'row')   
            if (row.prop == 'sizeStr') {
                this.picSearchOptions.orderByType = "FileSize";
            } else {
                this.picSearchOptions.orderByType = "CreateTime";
            }
            if (row.order == 'ascending') {
                this.picSearchOptions.isDescending  = false;
            } else {
                this.picSearchOptions.isDescending = true;
            }
            this.$emit("getList");
        }
    },
    watch: {
        "imgPageResult.list"() {
            this._getStorageUsage();
        },
        deep: true,
    }
};
</script>
<style lang='scss' scoped>
.el-input /deep/ .el-input__inner {
    padding-right: 50px;
}
.el-table /deep/ .el-table__row .el-input .el-input__suffix {
    display: flex;
    align-items: center;
}
.el-table /deep/ .ascending .sort-caret.ascending{
    border-bottom-color: $--color-primary ;
}
.el-table /deep/ .descending .sort-caret.descending{
    border-top-color: $--color-primary ;
}


</style>
<style lang="scss" scoped>
@import "@/styles/content-manage/manege-table.scss";
.file-title {
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
    width: 150px !important;
    height: 100px !important;
    .play {
        cursor: pointer;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        border-radius: 2px;
        background: rgba(0, 0, 0, 0.5);
        text-align: center;
        .play-btn {
            width: 34px;
            height: 34px;
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            background: url("~img/cover.png") no-repeat center;
          
        }
    }
}
.video {
    cursor: pointer;
    outline: none;
    width: 800px;
    margin-top: 150px;
}
.list-footer .use-title {
    display: flex;
    justify-content: space-between;
}
</style>


