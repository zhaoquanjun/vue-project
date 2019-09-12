<template>
    <div class="table-wrap" id="img-list" style="overflow: auto;
    height: calc(100vh - 200px);">
        <ul class="img-list">
            <li class="item" v-for="(item,index) in imgPageResult.list" :key="item.id">
                <grid-list-item
                    :itemIndex="index"
                    :selectedIndex="selectedIndex"
                    :curItem="item"
                    :multiple="multiple"
                    @handleSelected="handleSelected"
                    @viewPic="viewPic(item,index)"
                    @handleMove="handleMove"
                    @batchRemovePic="batchRemovePic"
                    @rename="rename"
                ></grid-list-item>
            </li>
        </ul>
        <div v-if="imgPageResult && imgPageResult.list && imgPageResult.list.length<1">
            <div class="empty-table">
                <img src="~img/table-empty.png" />
                <span>无数据</span>
            </div>
        </div>
        <div
            class="pageing"
            v-if="imgPageResult&& imgPageResult.list && imgPageResult.list.length>0"
        >
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
                <!-- //<img :src="picUrl"> -->
                <el-carousel
                    :autoplay="false"
                    :initial-index="initial"
                    arrow="always"
                    indicator-position="none"
                    :loop="true"
                    ref="carousel"
                >
                    <el-button
                        @click="prev"
                        class="el-carousel__arrow el-carousel__arrow--left left-prev"
                    >左</el-button>
                    <el-carousel-item v-for="item in imgList" :key="item.id">
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
                        <span class="ellipsis" style="width:150px">{{picInfo.title}}</span>
                    </el-tooltip>
                    <span>分类: {{picInfo.categoryName}}</span>
                    <span>大小: {{picInfo.sizeStr}}</span>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import GridListItem from "./GridListItme";
export default {
    props: ["imgPageResult", "picSearchOptions", "multiple"],
    data() {
        return {
            imgVisible: false,
            seletedList: [],
            imgList: "",
            fullOssUrl: "",
            picInfo: {},
            initial: -1,
            changeIndex: -1,
            selectedIndex: -1
        };
    },
    components: {
        GridListItem
    },
    methods: {
        handleSelected(item, isSelected) {
            if (!this.multiple) {
                this.seletedList[0] = item;
            } else {
                if (isSelected) {
                    this.seletedList.push(item);
                } else {
                    this.seletedList = this.seletedList.filter(
                        cur => cur !== item
                    );
                }
            }

            this.$emit("handleSelectionChange", this.seletedList);
            if (this.selectedIndex === isSelected) {
                this.selectedIndex = -1;
                return;
            }
            this.selectedIndex = isSelected;
        },
        changePage(page) {
            this.picSearchOptions.pageIndex = page;
            this.$emit("getList");
        },
        changeSize(size) {
            this.picSearchOptions.pageSize = size;
            this.$emit("getList");
        },
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
                this.changeIndex = this.picSearchOptions.pageSize - 1;
            }
            this.fullOssUrl = this.imgList[this.changeIndex].fullOssUrl;
            this.picInfo = this.imgList[this.changeIndex];
        },
        next() {
            this.$refs.carousel.next();
            this.changeIndex = this.changeIndex + 1;
            if (this.changeIndex >= this.picSearchOptions.pageSize) {
                this.changeIndex = 0;
            }
            this.fullOssUrl = this.imgList[this.changeIndex].fullOssUrl;
            this.picInfo = this.imgList[this.changeIndex];
        },
        closeDialog() {
            this.fullOssUrl = "";
        },
        /**
         * 移动分类
         */
        handleMove(item) {
            console.log(item);
            this.$emit("moveClassify", true, item);
        },
        batchRemovePic(item) {
            this.$emit("batchRemove", [item.id]);
        },
        rename(id, newName) {
            this.$emit("rename", id, newName);
        }
    }
};
</script>
<style lang="scss" scoped>
.left-prev,
.right-next {
    opacity: 0;
}
.img-list {
    width: 100%;
    box-sizing: border-box;
    li.item {
        display: inline-block;
        // width: 141px;
        width: 20%;
        padding: 10px;
        box-sizing: border-box;
    }
}
</style>

