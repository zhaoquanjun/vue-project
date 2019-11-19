<template>
    <div class="table-content" id="table-list">
        <el-table
            ref="multipleTable"
            :data="articlePageResult.list"
            tooltip-effect="dark"
            class="content-table"
            :height="tableHeight"
            @selection-change="handleSelectionChange"
        >
            <template slot="empty">
                <div class="empty-table">
                    <img src="~img/table-empty.png" />
                    <p>无数据</p>
                </div>
            </template>
            <el-table-column type="selection"></el-table-column>

            <el-table-column
                prop="title"
                label="文章标题"
                min-width="250"
            >
                <template slot-scope="scope">
                    <span class="isTop" v-show="scope.row.isTop">置顶</span>
                    <div style="display: flex; align-items: center;" @click="preview(scope.row.id, scope.row.defaultSiteId)">
                        <img v-if="scope.row.pictureUrl" :src="scope.row.pictureUrl" onerror="onImgError(this)" class="cover" />
                        <img v-else :src="defaultImg" class="cover" alt />
                        <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                            <span style="width:200px" class="ellipsis cursor-p">{{ scope.row.title }}</span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="categoryName" label="分类" min-width="80">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.categoryName" placement="top">
                        <span style="width:80px" class="ellipsis">{{ scope.row.categoryName }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column  prop="isPublishPrt" label="状态" min-width="100"></el-table-column>

            <el-table-column prop="createUser" label="作者" min-width="100">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.createUser" placement="top">
                        <span style="width:100px" class="ellipsis">{{ scope.row.createUser }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column prop="createTimePrt" label="创建时间" min-width="80">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.createTimePrt" placement="top">
                        <span>{{ scope.row.createTimePrt }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column  label="操作"  v-if="$store.state.dashboard.isContentwrite" min-width="150">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                            <i class="cl-iconfont iconfont iconbianji is-square" @click="handleEdit(scope.row)"></i>
                            <i class="cl-iconfont iconfont iconsangedian is-square"  @click.stop="_handleShowMoreOperate($event,scope.row)"></i>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageing">
            <el-pagination
                background
                layout="total, slot, sizes, prev, pager, next,jumper"
                :total="articlePageResult.totalRecord"
                :page-count="articlePageResult.totalPage"
                :page-size="articlePageResult.pageSize"
                :page-sizes="[10,20,50]"
                @current-change="changePageNum"
                @size-change="changePageSize"
            >
                <div class="sizes-title">，每页显示</div>
                <button class="paging-confirm">跳转</button>
            </el-pagination>
        </div>
        <ul class="operate-section" ref="operateSection">
            <li
                class="operate-item"
                v-for="(it, index) in operateList"
                :key="index"
                @click="handleMoreOperate(it.flag)"
            >{{it.name}}</li>
        </ul>
       
    </div>
</template>

<script>

import * as articleManageApi from "@/api/request/articleManageApi";
export default {
    props: ["articlePageResult", "articleSearchOptions", "treeResult"],

    data() {
        return {
            defaultImg: require("img/content-default-pic.png"),
            multipleSelection: [],
            operateList: [
                { name: "移动", flag: "move" },
                { name: "复制", flag: "copy" },
                { name: "下线", flag: "isOnsell" },
                { name: "置顶", flag: "stick" },
                { name: "删除", flag: "delete" }
            ],
            row: "",
            tableHeight: 500,
            loadingShow: true,
            tableData: "",
        };
    },
    mounted() {
        this.tableData = this.articlePageResult;
        document.addEventListener("click", () => {
            this.$nextTick(() => {
                if (this.$refs.operateSection)
                    this.$refs.operateSection.style.display = "none";
            });
        });

        this.$nextTick(() => {
            window.addEventListener("resize", () => {
                this.tableHeight = window.innerHeight - 260;
            });
            this.tableHeight = window.innerHeight - 260;
        });
         window.onImgError = (ele)=> {
            ele.src = ele.attributes["src"]=this.defaultImg
        };

    },
    methods: {
        changePageNum(page) {
            this.articleSearchOptions.pageIndex = page;
            this.$emit("getArticleList");
        },
        changePageSize(size) {
            this.articleSearchOptions.pageSize = size;
            this.$emit("getArticleList");
        },
        /**
         * 单选或全选操作
         */
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit("handleSelectionChange", val);
        },
        /**
         * 编辑文章
         */
        handleEdit(row) {
            console.log(row);
            this.$emit("handleEditArticle", row);
        },
        _handleShowMoreOperate(ev, row) {

            (this.operateList = [
                { name: "移动", flag: "move" },
                { name: "复制", flag: "copy" },
                { name: row.isPublish ? "下线" : "上线", flag: "isOnSell" },
                { name: row.isTop ? "取消置顶" : "置顶", flag: "stick" },
                { name: "删除", flag: "delete" }
            ]),
                (this.row = row);
            this.$refs.operateSection.style.right = document.documentElement.clientWidth - ev.pageX + ev.offsetX + "px";
            this.$refs.operateSection.style.top = ev.pageY - ev.offsetY + "px";

            if (this.$refs.operateSection.style.display == "block") {
                this.$refs.operateSection.style.display = "none";
            } else {
                this.$refs.operateSection.style.display = "block";
            }
        },

        /**
         * 删除操作
         */
        batchRemove(row) {
            this.$emit("batchRemove", [row.id]);
        },
        /**
         * 置顶操作
         */
        batchTop(row, isTop) {
            this.$emit("batchTop", [row.id], row.isTop);
        },
        /**
         * 上下线操作
         */
        batchPublish(row, isPublish) {
            this.$emit("batchPublish", [row.id], row.isPublish);
        },
        /**
         * 移动分类操作
         */
        batchMove(row) {
            this.$emit("changeOperateName", "移动");
            this.$emit("batchMove", [row.id]);
        },
        /**
         * 复制操作
         */
        batchCopy(row) {
            this.$emit("changeOperateName", "复制");
            this.$emit("batchCopy", [row.id]);
        },

        handleMoreOperate(flag) {
            let row = this.row;
            switch (flag) {
                case "move":
                    this.$emit("moveClassify", true, row);
                    this.batchMove(row);
                    break;
                case "copy":
                    this.$emit("moveClassify", true, row);
                    this.batchCopy(row);
                    break;
                case "isOnSell":
                    this.batchPublish(row, row.isPublish);
                    break;
                case "stick":
                    this.batchTop(row);
                    break;
                case "delete":
                    this.batchRemove(row);
                    break;
            }
        },
        /**
         * 预览
         */
        async preview(previewId, siteId) {
            let { data } = await articleManageApi.GetContentPrevAddress('NewsDetail', siteId);
            var prevAddress = data;
            if(prevAddress){
                let newWindow = window.open();
                newWindow.location.href = prevAddress + previewId + '.html';
            }
        }
    },

};
</script>

<style lang="scss" scoped>
@import "@/styles/content-manage/manege-table.scss";
.title-color{
    color: #262626;
}
</style>



