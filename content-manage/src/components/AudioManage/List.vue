<template>
    <div class="table-wrap" id="table-list">
        <el-table
            ref="multipleTable"
            :data="imgPageResult.list"
            tooltip-effect="dark"
            class="content-table"
            :height="tableHeight"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection"></el-table-column>

            <el-table-column label="音频名称">
                <template slot-scope="scope">
                     <img src="~img/file-icon/audio.png" class="cover" />
                    <el-input
                        v-if="(index == scope.$index)"
                        type="text"
                        size="small"
                        placeholder="请输入内容"
                        v-model="scope.row.title"
                        maxlength="30"
                        show-word-limit
                        @blur="rename(scope.row.id,scope.row.title)"
                    ></el-input>
                    <span
                        class="img-name"
                        v-else
                        @click="rename(scope.row.id,scope.row.title,scope.$index)"
                    >{{scope.row.title}}</span>
                    <!-- <input v-model="scope.row.title" />
                    <el-button @click="rename(scope.row.id,scope.row.title)">更新名称</el-button>-->
                </template>
            </el-table-column>
               <el-table-column prop="fileExtension" label="格式" show-overflow-tooltip></el-table-column>
               <el-table-column prop="sizeStr" label="大小" show-overflow-tooltip></el-table-column>
               <el-table-column prop="durationOfSecond" label="时长"></el-table-column>
            <el-table-column prop="categoryName" label="分类"></el-table-column>

         

            <!--<el-table-column prop="wideHigh" label="尺寸" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="createTimeStr" label="上传时间" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作"  v-if="$store.state.dashboard.isContentwrite">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn move-btn" @click="handleMove(scope.row)">
                            <!-- <svg-icon style="width:27px;height:27px" icon-class="tab-move"></svg-icon> -->
                        </button>
                        <button
                            class="handle-btn look-btn"
                            @click="viewPic( scope.row,scope.$index)"
                        >
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
                            <audio :src="fullOssUrl"  controls="controls"/>
                        </h3>
                    </el-carousel-item>
                </el-carousel>
                <div class="dislog-footer" slot="footer">
                    <span>{{picInfo.title}}</span>
                    <span>分类: {{picInfo.categoryName}}</span>
                    <span>大小: {{picInfo.sizeStr}}</span>
                </div>
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
        </el-dialog>-->
    </div>
</template>

<script>
import { adminDownload } from "@/api/request/contentCommonApi.js";
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
            picInfo:{},
            index: -1, //
            isRename: true, // 重命名图片名称
            initial: 0,
            imgVisible: false,
            multipleSelection: [],
            picUrl: null,
            picTitle: null,
            categoryVisable: false,
            changeCategoryPicId: null,
            imgList:"",
            fullOssUrl:"",
             loadingShow: true,
            tableHeight: 500
        };
    },
     mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", () => {
                this.tableHeight = window.innerHeight - 260;
            });
            this.tableHeight = window.innerHeight - 260;
        });
    },
    methods: {
         /**
         * 管理员下载
         */
        async _adminDownload(row) {
            console.log()
            let type = row.fileType;
            let id = row.id;
            let {data} = await adminDownload(type, id);
             this.fullOssUrl = data
            this.imgVisible = true;
           
            //  var a = document.createElement("a");
            // var binaryData = [];
            // binaryData.push(data);
            // a.href = window.URL.createObjectURL(
            //     new Blob(binaryData, { type: "application/dat" })
            // );
            // // var names = row.fileName.split("_");
            // // var filename =row.siteName + "_" + names[1] + "_" + names[2];
            // a.download = row.title; // Set the file name.
            // a.style.display = "none";
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);
        },
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
        changeCategory(data) {
            this.$emit("changeCategory", data.id, [this.changeCategoryPicId]);
            this.categoryVisable = false;
        },
        // 重命名图片名称
        rename(id, newName, index) {
            if (isNaN(index)) {
                this.index = -1;
                this.$emit("rename", id, newName);
                return;
            }
            this.index = index;
            //this.$emit("rename", id, newName);
        },
        blurRename(id, newName) {},
        /**
         * 查看大图
         */
        viewPic(row, index) {
            this._adminDownload(row)
            this.picInfo = this.imgList[index];
            
        },
        change(index){
            // this.fullOssUrl=  this.imgList[index].fullOssUrl;
             
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
    },
     watch: {
        imgPageResult() {
            this.loadingShow = false;
        }
    }
};
</script>
<style>

</style>

<style scoped>
.el-table /deep/ .el-table__row .el-input .el-input__suffix {
    display: flex;
    align-items: center;
}
.img-name {
    cursor: pointer;
}

#img-list-dialog .dislog-footer{
    text-align: center;
    position: fixed;
        width: 100%;
    left: 0;
    bottom: 15px;
   
}
#img-list-dialog .dislog-footer span{
    padding: 0 20px;
    color: #fff;
}
#img-list-dialog .el-dialog{
    background: #262626;
    opacity: 0.7;
    height: auto;
}

</style>

