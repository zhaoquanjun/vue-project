<template>
    <div class="table-wrap" id="img-list">
        <ul class="img-list">
            <li class="item" v-for="(item) in imgPageResult.list" :key="item.id">
                <grid-list-item 
                :curItem="item" 
                @handleSelected="handleSelected"
                @viewPic="viewPic"
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
        <div id="img-list-dialog">
           <el-dialog  :visible.sync="imgVisible"  :modal-append-to-body="false">
            <!-- //<img :src="picUrl"> -->
            <el-carousel :autoplay="false" arrow="always" indicator-position="none" :loop="false">
                <el-carousel-item v-for="item in imgPageResult.list" :key="item.id">
                    <h3>
                        <img :src="item.fullOssUrl">
                    </h3>
                </el-carousel-item>
            </el-carousel>
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
            seletedList: []
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
        viewPic() {
            this.imgVisible = true;
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
        width: 141px;
        margin: 10px 20px;
    }
}
</style>

