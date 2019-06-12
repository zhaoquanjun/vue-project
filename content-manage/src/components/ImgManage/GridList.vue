<template>
    <div class="grid-img-list">
        <ul class="img-list">         
            <li class="item">
                <GridListItem/>
            </li>
             <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>

            <li class="item">
                <GridListItem/>
            </li>
            <li class="item">
                <GridListItem/>
            </li>
        </ul>
        <div class="pageing">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="100"
                :page-count="5"
                :page-size="3"
                :page-sizes="[3, 4, 5, 6]"
               
            ></el-pagination>
        </div>
    </div>
</template>
<script>
import GridListItem from "./GridListItme"
export default {
    components:{
        GridListItem
    },
   
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

