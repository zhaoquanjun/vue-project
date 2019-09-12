<template>
    <div class="table-wrap" id="table-list">
        <el-table
            :height="tableHeight"
            ref="multipleTable"
            :data="imgPageResult.list"
            tooltip-effect="dark"
            class="content-table"
            @selection-change="handleSelectionChange"
        >
            <template slot="empty">
                <div class="empty-table">
                    <img src="~img/table-empty.png" />
                    <span>无数据</span>
                </div>
            </template>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="图片名称" min-width="300">
                <template slot-scope="scope">
                    <img
                        :src="scope.row.zoomOssUrl"
                        :fullsrc="scope.row.fullOssUrl"
                        onerror="onImgError(this)"
                        class="cover"
                        style="cursor: pointer;"
                         @click="viewPic( scope.row,scope.$index)"
                    />

                    <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                    <el-input
                        v-if="(index == scope.$index)"
                        type="text"
                        size="small"
                        ref="renameInput"
                        placeholder="请输入内容"
                        v-model="scope.row.title"
                        maxlength="30"
                        show-word-limit
                        @blur="rename(scope.row.id,scope.row)"
                    ></el-input>
                    <span
                        class="cursor-p ellipsis"
                        style="width:200px"
                        v-else
                        @click="rename(scope.row.id,scope.row,scope.$index)"
                    >{{scope.row.title}}</span>
                    </el-tooltip>
                    <!-- <input v-model="scope.row.title" />
                    <el-button @click="rename(scope.row.id,scope.row.title)">更新名称</el-button>-->
                </template>
            </el-table-column>

            <el-table-column prop="categoryName" label="分类" min-width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.categoryName }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="sizeStr" min-width="100" label="大小" show-overflow-tooltip></el-table-column>

            <!--<el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="createTimeStr" min-width="150" label="上传时间">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.createTimeStr" placement="top">
                        <span>{{ scope.row.createTimeStr }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="250" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn move-btn" @click="handleMove(scope.row)">
                        </button>
                        <button
                            class="handle-btn look-btn"
                            @click="viewPic( scope.row,scope.$index)"
                        >
                            <svg-icon icon-class="tab-look"></svg-icon>
                        </button>
                        <button class="handle-btn delete-btn" @click="batchRemove( scope.row)">
                            <i class="iconfont iconhuishouzhan"></i>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageing" id="pageing">
            <el-pagination
                background
                :layout="layout"
                :total="imgPageResult.totalRecord"
                :page-count="imgPageResult.totalPage"
                :page-size="picSearchOptions.pageSize"
                :page-sizes="[10,20,50]"
                @current-change="changePage"
                @size-change="changeSize"
            >
                <div class="sizes-title">，每页显示</div>
                <button class="paging-confirm">跳转</button>
            </el-pagination>
        </div>
        <!-- :title="picTitle" -->
        <div id="img-list-dialog">
            <el-dialog
                :visible.sync="imgVisible"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close="closeDialog"
            >
                <el-carousel
                    :autoplay="false"
                    arrow="always"
                    indicator-position="none"
                    :loop="true"
                    ref="carousel"
                >
                    <el-button
                        @click="prev"
                        class="el-carousel__arrow el-carousel__arrow--left left-prev"
                    ></el-button>
                    <el-carousel-item v-for="item in picSearchOptions.pageSize" :key="item">
                        <h3>
                            <img width="100%" :src="fullOssUrl" />
                        </h3>
                    </el-carousel-item>
                    <el-button
                        @click="next"
                        class="el-carousel__arrow el-carousel__arrow--right right-next"
                    ></el-button>
                </el-carousel>

                <div class="dislog-footer" slot="footer">
                      <el-tooltip
                            class="item"
                            effect="light"
                            :content="picInfo.title"
                            placement="top"
                        >
                             <span class="ellipsis"  style="width:150px">{{picInfo.title}}</span>
                        </el-tooltip>
                    <span>分类: {{picInfo.categoryName}}</span>
                    <span>大小: {{picInfo.sizeStr}}</span>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { trim } from "@/utlis/index.js";
export default {
    props: ["imgPageResult", "picSearchOptions", "treeResult"],

    data() {
        return {
            layout: "total, slot, sizes, prev, pager, next,jumper",
            picInfo: {},// 当前图片的信息
            index: -1, //
            imgVisible: false,// 查看图片弹窗 是否显示
            multipleSelection: [],// 选择的list
            categoryVisable: false,
            changeCategoryPicId: null,
            imgList: "",
            fullOssUrl: "",
            changeIndex: -1,
            firstIndex: "",
            tableHeight: 500,
           
        };
    },
    mounted() {
        window.onImgError = function(ele) {
            if (ele.src === ele.attributes["fullsrc"].value) {
                return;
            } else {
                ele.src = ele.attributes["fullsrc"].value;
            }
        };

        this.$nextTick(() => {
            window.addEventListener("resize", () => {
                this.tableHeight = window.innerHeight - 260;
            });
            this.tableHeight = window.innerHeight - 260;
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
        /**
         * 移动分类
         */
        handleMove(row) {
            this.categoryVisable = true;
            this.changeCategoryPicId = row.id;
            this.$emit("moveClassify", true, row);
        },
        // changeCategory(data) {
        //     this.$emit("changeCategory", data.id, [this.changeCategoryPicId]);
        //     this.categoryVisable = false;
        // },
        // 重命名图片名称
        rename(id, row, index) {
           if(row.title)this.newName = row.title;
            if (!trim(row.title)) {
                 row.title=this.newName
                this.$notify({
                    customClass: "notify-error",
                    message: `图片名称不能为空`,
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
            this.$nextTick(() => this.$refs.renameInput.focus());
        },
        blurRename(id, newName) {},
        /**
         * 查看大图
         */
        viewPic(row, index) {
            this.fullOssUrl = "";
            this.fullOssUrl = row.fullOssUrl;
            this.imgList = this.imgPageResult.list;
            this.imgVisible = true;
            this.changeIndex = index;
            this.picInfo = this.imgList[this.changeIndex];
        },
        prev() {
            this.$refs.carousel.prev();
            if (this.changeIndex > 0) {
                this.changeIndex = this.changeIndex - 1;
            } else {
                this.changeIndex = this.imgPageResult.list.length - 1;
            }
            this.fullOssUrl = this.imgList[this.changeIndex].fullOssUrl;
            this.picInfo = this.imgList[this.changeIndex];
        },
        next() {
            this.$refs.carousel.next();
            this.changeIndex = this.changeIndex + 1;
            if (this.changeIndex >= this.imgPageResult.list.length) {
                this.changeIndex = 0;
            }
            this.fullOssUrl = this.imgList[this.changeIndex].fullOssUrl;
            this.picInfo = this.imgList[this.changeIndex];
        },
        closeDialog() {
            this.fullOssUrl = "";
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
        }
    }
};
</script>



<style scoped>
.left-prev,
.right-next {
    opacity: 0;
}
.el-table /deep/ .el-table__row .el-input .el-input__suffix {
    display: flex;
    align-items: center;
}

.img-name {
    cursor: pointer;
}

#img-list-dialog .dislog-footer {
    text-align: center;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 15px;
}

#img-list-dialog .dislog-footer span {
    padding: 0 20px;
    color: #fff;
}

#img-list-dialog .el-dialog {
    background: #262626;
    opacity: 0.7;
    height: auto;
}
</style>

