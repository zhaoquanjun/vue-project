<template>
    <div class="table-wrap" id="img-list">
        <ul class="img-list">
            <li class="item" v-for="(item,index) in imgPageResult.list" :key="item.id">
                <grid-list-item 
                :curItem="item" 
                @handleSelected="handleSelected"
                @viewPic="viewPic(item,index)"
                @handleMove="handleMove"
                @batchRemovePic="batchRemovePic"
                @rename="rename"
                ></grid-list-item>
            </li>
        </ul>
        <div class="pageing">
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
                            <img :src="fullOssUrl" />
                        </h3>
                    </el-carousel-item>
                </el-carousel>
                <div class="dislog-footer" slot="footer">
                    <span>{{picInfo.title}}</span>
                    <span>分类: {{picInfo.categoryName}}</span>
                    <span>大小: {{picInfo.size}}</span>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import GridListItem from "./GridListItme";
export default {
    props: ["imgPageResult", "picSearchOptions"],
    data() {
        return {
            imgVisible: false,
            seletedList: [],
            imgList:"",
            fullOssUrl:"",
             picInfo:{},
             initial:-1,
        };
    },
    components: {
        GridListItem
    },
    methods: {
        handleSelected(item, isSelected) {
            if (isSelected) {
                this.seletedList.push(item);
            } else {
                this.seletedList = this.seletedList.filter(cur => cur !== item);
            }
            this.$emit("handleSelectionChange", this.seletedList);
        
        },
        changePage(page) {
            this.picSearchOptions.pageIndex = page;
            this.$emit("getPicList");
        },
        changeSize(size) {
            this.picSearchOptions.pageSize = size;
            this.$emit("getPicList");
        },
        /**
         * 查看大图
         */
        viewPic(row,index) {
              this.fullOssUrl=""
            this.fullOssUrl = row.fullOssUrl
            this.imgList = this.imgPageResult.list
            this.imgVisible = true;
            this.initial = Number(index);
            
        },
        change(index){
            console.log(index)
            this.fullOssUrl=  this.imgList[index].fullOssUrl;
            this.picInfo = this.imgList[index];
        },
         /**
         * 移动分类
         */
        handleMove(item) {
            console.log(item)
            this.$emit("moveClassify",true,item)
        },
        batchRemovePic(item){
             this.$emit("batchRemove",[item.id])
        },
        rename(id, newName){
             this.$emit("rename", id, newName);
        },
    }
};
</script>
<style lang="scss" scoped>

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

