<template>
    <div class="table-wrap" id="table-list">
        <el-table
            ref="multipleTable"
            :data="imgPageResult.list"
            tooltip-effect="dark"
            class="content-table"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection"></el-table-column>

            <el-table-column label="图片名称">
                <template slot-scope="scope">
                    <img :src="scope.row.zoomOssUrl" class="cover">
                    <span>{{scope.row.title}}</span>
                    <!-- <input v-model="scope.row.title" />
                    <el-button @click="rename(scope.row.id,scope.row.title)">更新名称</el-button>-->
                </template>
            </el-table-column>

            <el-table-column prop="categoryName" label="分类"></el-table-column>

            <el-table-column prop="sizeStr" label="大小" show-overflow-tooltip></el-table-column>

            <!--<el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="createTimeStr" label="上传时间" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn move-btn" @click="handleMove(scope.row)">
                            <!-- <svg-icon style="width:27px;height:27px" icon-class="tab-move"></svg-icon> -->
                        </button>
                        <button class="handle-btn look-btn" @click="viewPic( scope.row)">
                            <svg-icon icon-class="tab-look"></svg-icon>
                        </button>
                        <button class="handle-btn delete-btn" @click="batchRemove( scope.row)">
                            <svg-icon icon-class="l-recyclebin"></svg-icon>
                        </button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageing" id="pageing">
            <slot name="paging"></slot>
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
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
       
        <!-- <el-dialog title="更换分类至" :visible.sync="categoryVisable ">
            <el-tree
                :data="treeResult"
                node-key="id"
                accordion
                :expand-on-click-node="false"
                @node-click="changeCategory"
            ></el-tree>
        </el-dialog> -->
    </div>
</template>

<script>
export default {
    // props:{
    //     imgList:{
    //         type:Object,
    //         default:()=>({})
    //     }
    // },
    props: ["imgPageResult", "picSearchOptions", "treeResult"],
    data() {
        return {
            imgVisible: false,
            multipleSelection: [],
            picUrl: null,
            picTitle: null,
            categoryVisable: false,
            changeCategoryPicId: null
        };
    },

    methods: {
        /**
         * 单选或全选操作
         */
        handleSelectionChange(list) {
            console.log(list);
            this.multipleSelection = list;
            this.$emit("handleSelectionChange",list)
        },
        /**
         * 移动分类
         */
        handleMove(row) {
         
            this.categoryVisable = true;
            this.changeCategoryPicId = row.id;
            this.$emit("moveClassify",true,row)
        },
        changeCategory(data) {
            this.$emit("changeCategory", data.id, [this.changeCategoryPicId]);
            this.categoryVisable = false;
        },
        rename(id, newName) {
            this.$emit("rename", id, newName);
        },
        /**
         * 查看大图
         */
        viewPic(row) {
            this.picUrl = row.fullOssUrl;
            this.picTitle = row.title;
            this.imgVisible = true;
        },

        changePage(page) {
            this.picSearchOptions.pageIndex = page;
            this.$emit("getPicList");
        },
        changeSize(size) {
            this.picSearchOptions.pageSize = size;
            this.$emit("getPicList");
        },
        batchRemove(row) {
            this.$emit("batchRemove", [row.id]);
        }
    }
};
</script>

<style>

/* 

#table-list .el-table .el-table__header .has-gutter th {
    padding: 0;
    height: 32px;
    background: #00c1de !important;
}

/* #table-list .el-table th > .cell {
    color: #fff;
    font-weight: 400;
    font-size: 12px;
} */
/*#table-list .el-table .el-table__row {
    height: 60px;
} */



</style>

