<template>
    <div class="table-content" id="table-list">
        <el-table
            ref="multipleTable"
            :data="imgPageResult.list"
            tooltip-effect="dark"
            class="content-table"
            :height="tableHeight"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection"></el-table-column>

            <el-table-column label="文件名称">
                <template slot-scope="scope">
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

            <el-table-column prop="categoryName" label="分类"></el-table-column>

            <el-table-column prop="sizeStr" label="大小" show-overflow-tooltip></el-table-column>
            <el-table-column prop="downloadCount" label="置顶">
                <template slot-scope="scope">
                    <span>{{ scope.row.isTop?"是":"否" }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="downloadCount" label="下载次数"></el-table-column>
            <el-table-column prop="createTimeStr" label="上传时间" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="handle-btn edit-icon"  @click="handleMove(scope.row)">
                            <i class="iconfont iconcaozuo"></i>
                        </button>
                        <button
                            class="handle-btn look-btn edit-icon"
                            @click="viewPic( scope.row,scope.$index)"
                        >
                            <svg-icon icon-class="tab-look"></svg-icon>
                        </button>
                        <!-- <button class="handle-btn delete-btn" @click="batchRemove( scope.row)">
                            <svg-icon icon-class="l-recyclebin"></svg-icon>
                        </button> -->
                          <span
                            class="more-operate"
                            @click.stop="_handleShowMoreOperate($event,scope.row)"
                        ><i class="iconfont iconsangedian"></i></span>
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
                            <video :src="fullOssUrl" controls="controls" />
                        </h3>
                    </el-carousel-item>
                </el-carousel>
                <div class="dislog-footer" slot="footer">
                    <span>{{picInfo.title}}</span>
                    <span>分类: {{picInfo.categoryName}}</span>
                    <span>尺寸: {{picInfo.sizeStr}}</span>
                    <span>大小: {{picInfo.size}}</span>
                </div>
            </el-dialog>
        </div>
        <ul class="operate-section" ref="operateSection">
            <li
                class="operate-item"
                v-for="(it, index) in operateList"
                :key="index"
                @click="handleMoreOperate(it.flag)"
            >{{it.name}}</li>
        </ul>

        <Loading v-if="loadingShow" />
    </div>
</template>

<script>
import Loading from "@/base/loading.vue";
export default {
    // props:{
    //     imgList:{
    //         type:Object,
    //         default:()=>({})
    //     }
    // },
    props: ["imgPageResult", "picSearchOptions", "treeResult"],
    components: {
        Loading
    },
    data() {
        return {
            picInfo: {},
            index: -1, //
            isRename: true, // 重命名图片名称
            initial: 0,
            imgVisible: false,
            multipleSelection: [],
            picUrl: null,
            picTitle: null,
            categoryVisable: false,
            changeCategoryPicId: null,
            imgList: "",
            fullOssUrl: "",
            loadingShow: true,
            tableHeight: 500,
            operateList: [
                { name: "置顶", flag: "isTop" },
                { name: "删除", flag: "delete" }
            ],
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
       
        /**
         * 查看大图
         */
        viewPic(row, index) {
            this.fullOssUrl = row.fullOssUrl;
            this.imgList = this.imgPageResult.list;
            this.imgVisible = true;
            this.initial = Number(index);
        },
        change(index) {
            this.fullOssUrl = this.imgList[index].fullOssUrl;
            this.picInfo = this.imgList[index];
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
        },
         _handleShowMoreOperate(ev, row) {
            this.row = row;
            this.operateList = [
                { name: row.isTop ? "取消置顶" : "置顶", flag: "stick" },
                { name: "删除", flag: "delete" }
            ];
            let clientH =
                document.getElementsByClassName("more-operate")[0]
                    .clientHeight + 10;
            let clientW = this.$refs.operateSection.clientWidth;

            this.$refs.operateSection.style.left =
                ev.pageX - ev.offsetX + 20 + "px";
            this.$refs.operateSection.style.top = ev.pageY - ev.offsetY + "px";

            if (this.$refs.operateSection.style.display == "block") {
                this.$refs.operateSection.style.display = "none";
            } else {
                this.$refs.operateSection.style.display = "block";
            }
        },
         handleMoreOperate(flag) {
           
            let row = this.row;
            switch (flag) {
               
                case "stick":
                   
                    break;
                case "delete":
                      this.$emit("batchRemove", [row.id]);
                    break;
            }
        },
    },
    watch: {
        imgPageResult() {
            this.loadingShow = false;
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../../styles/manege-table.scss";
</style>

<style scoped>
.table-wrap {
    position: relative;
}
.el-table /deep/ .el-table__row .el-input .el-input__suffix {
    display: flex;
    align-items: center;
}
.img-name {
    cursor: pointer;
}

#img-list-dialog .dislog-footer {
    text-align: center;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 15px;
}
#img-list-dialog .dislog-footer span {
    padding: 0 20px;
    color: #fff;
}
#img-list-dialog .el-dialog {
    background: #262626;
    opacity: 0.7;
    height: auto;
}
</style>

