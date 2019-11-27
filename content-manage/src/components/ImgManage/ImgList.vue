<template>
    <div class="table-wrap" id="table-list">
        <el-table
            :height="tableHeight"
            ref="multipleTable"
            :data="imgPageResult.list"
            tooltip-effect="dark"
            class="content-table table-content"
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

            <el-table-column prop="sizeStr" min-width="100" label="大小" sortable='custom' show-overflow-tooltip></el-table-column>

            <!--<el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="createTimeStr" min-width="150" sortable='custom' label="上传时间">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.createTimeStr" placement="top">
                        <span>{{ scope.row.createTimeStr }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="250" v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="more-operate " @click="handleMove(scope.row)" style="margin-right:16px">
                            <i class="iconfont iconyidong"></i>
                        </button>
                        <button
                            class="more-operate look-btn"
                            @click="viewPic( scope.row,scope.$index)"
                            style="margin-right:16px"
                        >
                            <i class="iconfont iconchakan"></i>
                        </button>
                        <button class="more-operate delete-btn" @click="batchRemove( scope.row)">
                            <i class="iconfont iconshanchu"></i>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="cl-paganation pageing" id="pageing" :class="{'noJumper':imgPageResult.totalPage <= 10}">
            <el-pagination
                background
                :layout="imgPageResult.totalPage > 10 ? 'total, slot, sizes, prev, pager, next,jumper': 'total, slot, sizes, prev, pager, next'"
                :total="imgPageResult.totalRecord"
                :page-size="picSearchOptions.pageSize"
                :page-sizes="[10,20,50]"
                @current-change="changePage"
                @size-change="changeSize"
            >
                <div class="sizes-title">，每页显示</div>
                <button v-if="imgPageResult.totalPage > 10" class="paging-confirm">跳转</button>
            </el-pagination>
        </div>
        <!-- :title="picTitle" -->
        <div id="img-list-dialog" class="previw-dialog" >
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
                    class="myCarousel"
                >
                    <el-button
                        @click="prev"
                        class="el-carousel__arrow el-carousel__arrow--left left-prev"
                    ></el-button>
                    <el-carousel-item>
                        <h3>
                            <img style="max-width: 100%;max-height: 100%;width: auto;" :src="fullOssUrl" />
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
        },
        //改变排序
        sortChange(row){
                    // value: "CreateTime",
                    // label: "创建时间"
                    // value: "FileSize",
                    // label: "文件大小"
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
        },
    }
};
</script>

<style lang="scss" scoped>
@import "@/styles/content-manage/manege-table.scss";


.el-table /deep/ .el-table_1_column_3 .cell span{
    display: inline-block;
    width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

