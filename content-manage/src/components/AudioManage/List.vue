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
                <div class="empty-table" @click="switchUploadBoxShowStatus">
                    <img src="~img/table-empty.png" />
                    <p>添加数据</p>
                </div>
            </template>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="音频名称" width="200">
                <template slot-scope="scope">
                    <div class="cover">
                        <img width="100%" src="~img/file-icon/audio.png" />
                        <span class="play" @click="viewPic( scope.row,scope.$index)">
                            <img src="~img/file-icon/play.png" alt />
                        </span>
                    </div>
                    <el-input
                        v-if="(index == scope.$index)"
                        type="text"
                        size="small"
                        ref="renameInput"
                        placeholder="请输入内容"
                        v-model="scope.row.title"
                        maxlength="30"
                        @blur="rename(scope.row.id,scope.row)"
                    ></el-input>

                    <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        :content="scope.row.title"
                        placement="top"
                    >
                        <div
                            style="width:150px"
                            class="ellipsis cursor-p"
                            @click="rename(scope.row.id,scope.row,scope.$index)"
                        >{{scope.row.title}}</div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="fileExtension" label="格式" :formatter="formatterFileExt"></el-table-column>
            <el-table-column prop="sizeStr" sortable='custom' label="大小" show-overflow-tooltip></el-table-column>
            <el-table-column prop="durationStr" label="时长" min-width="150"></el-table-column>
            <el-table-column prop="categoryName" label="分类" min-width="150">
                <template slot-scope="scope">
                    <span style="width:150px" class="ellipsis">{{ scope.row.categoryName }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="createTimeStr" width="150" sortable='custom' label="上传时间" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" width="150" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button
                            class="more-operate"
                            @click="handleMove(scope.row)"
                            style="margin-right:16px"
                        >
                            <i class="iconfont iconyidong cl-iconfont is-square"></i>
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
            <div id="img-list-dialog">
                <el-dialog
                    :visible.sync="imgVisible"
                    :modal-append-to-body="false"
                    @close="closeDialog"
                >
                    <audio ref="audio" class="audio" :src="fullOssUrl" controls="controls" />
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { adminDownload } from "@/api/request/contentCommonApi.js";
import { trim } from "@/utlis/index.js";
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
            let type = row.fileType;
            let id = row.id;
            let { data } = await adminDownload(type, id);
            this.fullOssUrl = data;
            this.imgVisible = true;
            this.$nextTick(() => {
                this.$refs.audio.play();
            });
        },
        /**
         * 单选或全选操作
         */
        handleSelectionChange(list) {
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
        // 上传音频
        switchUploadBoxShowStatus(){
            this.$emit("switchUploadBoxShowStatus")
        },
        // 重命名名称
        rename(id, row, index) {
            if (row.title) this.newName = row.title;
            if (!trim(row.title)) {
                row.title = this.newName;
                this.$notify({
                    customClass: "notify-error",
                    message: `音频名称不能为空`,
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
         * 查看大图
         */
        viewPic(row, index) {
            this.imgList = this.imgPageResult.list;
            this.picInfo = this.imgList[index];
            this._adminDownload(row);
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
            this.$refs.audio.pause();
        },
        formatterFileExt(row, column) {
            if (row.fileExtension.substring(0, 1) == ".")
                return row.fileExtension.substring(1);
            return row.fileExtension;
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
@import "../../styles/content-manage/manege-table.scss";
/* 音频弹窗居中播放 */
.table-wrap /deep/ .el-dialog__body {
    display: flex;
    align-items: center;
    justify-content: center;
}
.table-wrap /deep/ .el-table--scrollable-x .el-table__body-wrapper{
    overflow-x: hidden;
}
.cover {
    position: relative;
    width: 24px !important;
    height: 24px !important;
    &:hover .play {
        cursor: pointer;
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        border-radius: $--border-radius-base;
        text-align: center;
        img {
            width: 12px;
            transform: translateY(25%);
        }
    }
}
.el-table /deep/ .ascending .sort-caret.ascending{
    border-bottom-color: $--color-primary ;
}
.el-table /deep/ .descending .sort-caret.descending{
    border-top-color: $--color-primary ;
}
.table-wrap /deep/ .el-table__empty-text{
    width: 100%;
}
</style>



