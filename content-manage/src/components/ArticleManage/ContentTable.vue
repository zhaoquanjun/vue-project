<template>
    <div class="table-content" id="table-list">
        <el-table
            ref="multipleTable"
            :data="articlePageResult.list"
            tooltip-effect="dark"
            class="content-table"
             height="500"
            @selection-change="handleSelectionChange"
        >
            <template slot="empty">
                <div class="empty-table">
                    <img src="~img/table-empty.png" />
                    <span>无数据</span>
                </div>
            </template>
            <el-table-column type="selection"></el-table-column>

            <el-table-column
                :show-overflow-tooltip="true"
                prop="title"
                label="文章标题"
                min-width="150"
            >
                <template slot-scope="scope">
                    <img v-if="scope.row.pictureUrl" :src="scope.row.pictureUrl" class="cover" alt />
                    <img v-else :src="defaultImg" class="cover" alt />
                    <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="categoryName" label="分类" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.categoryName }}</span>
                </template>
            </el-table-column>

            <el-table-column width="100" prop="isPublishPrt" label="状态" show-overflow-tooltip></el-table-column>

            <el-table-column width="100" prop="isTopPrt" label="置顶" show-overflow-tooltip></el-table-column>

            <el-table-column prop="createUser" label="作者" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.createUser }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="createTimePrt" label="创建时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.createTimePrt }}</span>
                </template>
            </el-table-column>

            <el-table-column width="200" label="操作">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <span class="edit-icon" @click="handleEdit(scope.row)"></span>
                        <span
                            class="more-operate"
                            @click.stop="_handleShowMoreOperate($event,scope.row)"
                        ></span>
                        <!-- <button class="handle-btn" @click="handleLook(scope.$index, scope.row)">
              <svg-icon icon-class="tab-look"></svg-icon>
            </button>
            <button class="handle-btn" @click="batchRemove( scope.row)">
              <svg-icon icon-class="l-recyclebin"></svg-icon>
            </button>
            <button class="handle-btn" @click="batchTop( scope.row)">
              <svg-icon icon-class="l-recyclebin"></svg-icon>
            </button>
            <button class="handle-btn" @click="batchPublish( scope.row)">
              <svg-icon icon-class="l-recyclebin"></svg-icon>
                        </button>-->
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
        <!-- <el-dialog width="400px" :visible.sync="imgVisible" class="img-dialog">
            <el-card :body-style="{ padding: '0px' }">
                <img src="../../assets/avatar.jpeg" width="100%" height="100%">
            </el-card>
        </el-dialog>-->
    </div>
</template>

<script>
export default {
    props: ["articlePageResult", "articleSearchOptions", "treeResult"],
    data() {
        return {
            defaultImg: require("../../../static/images/content-default-pic.png"),
            multipleSelection: [],
            operateList: [
                { name: "移动", flag: "move" },
                { name: "复制", flag: "copy" },
                { name: "下线", flag: "isOnsell" },
                { name: "置顶", flag: "stick" },
                { name: "删除", flag: "delete" }
            ],
            row: ""
        };
    },
    mounted() {
        document.addEventListener("click", () => {
            this.$nextTick(() => {
                if (this.$refs.operateSection)
                    this.$refs.operateSection.style.display = "none";
            });
        });
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
        // sortByTopStatus: function(column, prop, order) {
        //     // descending ascending
        //     this.articleSearchOptions.OrderByTopOrder =
        //         column.order == "ascending"
        //             ? true
        //             : column.order == "descending"
        //             ? false
        //             : null;
        //     this.$emit("getArticleList");
        // },
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
            console.log(row, "00000");
            (this.operateList = [
                { name: "移动", flag: "move" },
                { name: "复制", flag: "copy" },
                { name: row.isPublish ? "下线" : "上线", flag: "isOnSell" },
                { name: row.isTop ? "取消置顶" : "置顶", flag: "stick" },
                { name: "删除", flag: "delete" }
            ]),
                (this.row = row);
            this.$refs.operateSection.style.left =
                ev.pageX - ev.offsetX + 16 + "px";
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
        }
    }
};
</script>

<style lang="scss" scoped>
.table-content {
    padding: 0 24px;
    .handle-btn-wrap {
        justify-content: flex-start;
        .edit-icon {
            margin-right: 32px;
            cursor: pointer;
            width: 16px;
            height: 16px;
            background: url("../../../static/images/news_edit.png") no-repeat
                center center;
            background-size: 100% 100%;
        }
        .more-operate {
            position: relative;
            cursor: pointer;
            width: 20px;
            height: 15px;
            background: url("../../../static/images/more_operate.png") no-repeat
                center center;
            background-size: contain;
            &::before {
                content: "";
                position: absolute;
                top: -10px;
                right: -10px;
                bottom: -10px;
                left: -10px;
            }
        }
    }
    .operate-section {
        display: none;
        position: absolute;
        z-index: 19;
        background: #fff;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
        li {
            cursor: pointer;
            padding: 8px 16px;
            line-height: 17px;
            &:hover {
                color: #00c1de;
                background: rgba(0, 193, 222, 0.2);
            }
        }
    }
}
</style>

<

