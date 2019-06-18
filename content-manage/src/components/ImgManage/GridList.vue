<template>
    <div class="grid-img-list">
        <ul class="img-list">
            <li class="item" v-for="(item) in imgPageResult.list" :key="item.id">
                <grid-list-item :curItem="item" @handleSelected="handleSelected"></grid-list-item>
            </li>
        </ul>
        <div class="pageing">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="imgPageResult.totalRecord"
                :page-count="imgPageResult.totalPage"
                :page-size="picSearchOptions.pageSize"
                :page-sizes="[5,10,15,20,50,100]"
                @current-change="changePage"
                @size-change="changeSize"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
import GridListItem from "./GridListItme";
export default {
    props: ["imgPageResult", "picSearchOptions"],
    data() {
        return {
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
        }
    }
};
</script>
<style lang="scss" scoped>
.grid-img-list {
    margin: 0 auto;
    box-sizing: border-box;
}
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

