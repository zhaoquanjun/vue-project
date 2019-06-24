<template>
     <div class="pageing" id="pageing">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagingOptions.pageTotal"
                :page-count="pagingOptions.pageCount"
                :page-size="pagingOptions.pageSize"
                :page-sizes="pagingOptions.pageSizes"
                @current-change="changePage"
                @size-change="changeSize"
            ></el-pagination>
        </div>
</template>
<script>
/**
 *   pagingOptions:{
                pageTotal:"",
                pageCount:"",
                layout:"total, sizes, prev, pager, next, jumper",
                pageSize: 10,
                pageSizes:[5,10,15,20,50,100],
                pageIndex: 1,

            }
 * 
 */
export default {
    props:["pagingOptions"],
     methods: {
        changePageNum(page) {
            console.log(page)
            // this.articleSearchOptions.pageIndex = page;
            // this.$emit("getArticleList");
        },
        changePageSize(size) {
            console.log(size)
            // this.articleSearchOptions.pageSize = size;
            // this.$emit("getArticleList");
        },
     }
}
</script>
