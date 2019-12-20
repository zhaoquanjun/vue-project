<template>
    <div class="table-wrap" id="img-list">
        <ul v-show="imgPageResult && imgPageResult.list && imgPageResult.list.length>0" class="img-list">
            <li class="item" v-for="(item,index) in imgPageResult.list" :key="item.id">
                <grid-list-item
                    :isSelected="isSelected(item)"
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
                    <p>无数据</p>
                </div>
        </div>
        <div
            class="cl-paganation pageing "
            :class="{'imgJumper':imgPageResult.totalPage > 10}"
            v-if="imgPageResult&& imgPageResult.list && imgPageResult.list.length>0"
        >
            <el-pagination
                v-if="imgPageResult.totalRecord > 0"
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
        <div id="img-list-dialog">
            <el-dialog
                :visible.sync="imgVisible"
                :modal-append-to-body="false"
                @close="closeDialog"
            >
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
                    <el-carousel-item >
                        <h3>
                            <img onload="if (this.naturalWidth > this.parentNode.clientWidth && this.naturalHeight > this.parentNode.clientHeight){if (this.naturalWidth / this.naturalHeight > this.parentNode.clientWidth / this.parentNode.clientHeight){this.style.maxHeight = '100%'; this.style.maxWidth = 'none';} else {this.style.maxWidth = '100%'; this.style.maxHeight = 'none';}}console.log(this.naturalWidth, this.naturalHeight, this.parentNode.clientWidth)" :src="fullOssUrl" />
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
    props:{
        imgPageResult:{
            type:Object,
            default:()=> ({})
        },
        picSearchOptions:{
              type:Object,
            default:()=> ({})
        },
        multiple:{
            type:Boolean,
            default:true
        }
    },
    data() {
        return {
            imgVisible: false,
            seletedList: [],
            imgList: "",
            fullOssUrl: "",
            picInfo: {},
            initial: -1,
            changeIndex: -1,
        };
    },
    components: {
        GridListItem
    },
   
    methods: {
        handleSelected(item) {
            if (this.multiple) {
                let flag = true;
                for(let i = 0; i< this.seletedList.length; i++){
                    if(item.id == this.seletedList[i].id){
                        this.seletedList.splice(i, 1)
                        flag = false;
                    }
                }
                if (flag) {
                    this.seletedList.push(item);
                }
            } else {
                if (this.seletedList.length) {
                    if(item.id == this.seletedList[0].id){
                        this.seletedList.splice(0, 1)
                    }else{
                        this.$set(this.seletedList, 0, item)
                    }
                } else {
                    this.$set(this.seletedList, 0, item)
                }
            }
            this.$emit("handleSelectionChange", this.seletedList);
        },

       
        // 判断是否被选中
        isSelected(item) {
            for(let i = 0; i < this.seletedList.length; i++){
                if(item.id == this.seletedList[i].id){
                    return true
                }
            }
            return false
        },
        // 清空被选中的列表
        clearSelectedList() {
            this.seletedList = [];
            this.$emit("handleSelectionChange", this.seletedList);
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
@import "../../styles/content-manage/manege-table.scss";
// .el-pagination /deep/ .el-pagination__total {
//     float: left;
// }
// .el-pagination /deep/ .sizes-title {
//     float: left;
// }
.img-list {
    width: 100%;
    box-sizing: border-box;
    li.item {
        display: inline-block;
        width: 20%;
        padding: 10px;
        box-sizing: border-box;
    }
}
.cl-paganation {
    margin-top: 16px;
    margin-right: 11px;
}
.imgJumper {
    margin-right: 66px;
}
</style>

