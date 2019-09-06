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
                    <span>无数据</span>
                </div>
            </template>
            <el-table-column type="selection"></el-table-column>

            <el-table-column width="300" prop="name" label="产品标题">
                <template slot-scope="scope">
                    <img
                        v-if="scope.row.thumbnailPicUrlList.length"
                        :src="scope.row.thumbnailPicUrlList[0]+'?x-oss-process=image/resize,m_lfit,h_40,w_40'"
                        class="cover"
                        alt
                    />
                    <img v-else :src="defaultImg" class="cover" alt />
                    <!-- 未传图片 取不到 -->
                    <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
                    <span style="width:200px" class="ellipsis img-name">{{ scope.row.name }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column prop="productCategoryList"  min-width="100" label="分类" show-overflow-tooltip>
                <template slot="header" slot-scope="scope">
                       <span style="margin-right: 5px;">分类</span> <el-tooltip content="一个产品最多可属于5个分类" effect="dark" placement="right">
                               <i class="iconfont iconyiwen"></i>
                            </el-tooltip>
                   
                </template>
                <template slot-scope="scope">
                    <span>
                        <i v-for="(item,index) in scope.row.productCategoryList" :key="item.id">
                            {{ item.displayName }}
                            <i
                                v-if="scope.row.productCategoryList.length>1 && scope.row.productCategoryList.length-1!=index"
                            >,</i>
                        </i>
                    </span>
                </template>
            </el-table-column>

            <el-table-column min-width="100" prop="isOnSell" label="状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.isOnSell?"上架":"下架" }}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="100" prop="isTop" label="置顶">
                <template slot-scope="scope">
                    <span>{{ scope.row.isTop?"是":"否" }}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="100" prop="createTimeStr" label="创建时间"></el-table-column>

            <el-table-column
                width="150"
                min-width="100"
                label="操作"
                v-if="$store.state.dashboard.isContentwrite"
            >
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <span class="edit-icon" @click="handleEdit(scope.row)">
                            <i class="iconfont iconcaozuo"></i>
                        </span>
                        <span
                            class="more-operate"
                            @click.stop="_handleShowMoreOperate($event,scope.row)"
                        >
                            <i class="iconfont iconsangedian"></i>
                        </span>
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
export default {
    props: ["articlePageResult", "articleSearchOptions"],

    data() {
        return {
            defaultImg: require("../../../static/images/content-default-pic.png"),
            multipleSelection: [],
            operateList: [
                { name: "移动", flag: "move" },
                { name: "复制", flag: "copy" },
                { name: "下线", flag: "isOnSell" },
                { name: "置顶", flag: "stick" },
                { name: "删除", flag: "delete" }
            ],
            row: "",
            tableHeight: 500,
            loadingShow: true,
            tableData: ""
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
    },
    methods: {
        changePageNum(page) {
            this.articleSearchOptions.pageIndex = page;
            this.$emit("contentTableList");
        },
        changePageSize(size) {
            this.articleSearchOptions.pageSize = size;
            this.$emit("contentTableList");
        },
        sortByTopStatus: function(column, prop, order) {
            // descending ascending
            this.articleSearchOptions.OrderByTopOrder =
                column.order == "ascending"
                    ? true
                    : column.order == "descending"
                    ? false
                    : null;
            this.$emit("contentTableList");
        },
        /**
         * 单选或全选操作
         */
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit("handleSelectionChange", val);
        },
        getCheckArr() {
            let checkArr = this.multipleSelection; // multipleSelection存储了勾选到的数据
            let params = [];
            let self = this;
            checkArr.forEach(function(item) {
                params.push(item.id); // 添加所有需要删除数据的id到一个数组，post提交过去
            });
            return params;
        },
        /**
         * 编辑文章
         */
        handleEdit(row) {
            console.log(row);
            this.$emit("handleEditArticle", row);
        },
        _handleShowMoreOperate(ev, row) {
            this.row = row;
            this.operateList = [
                { name: "移动", flag: "move" },
                { name: "复制", flag: "copy" },
                { name: row.isOnSell ? "下架" : "上架", flag: "isOnSell" },
                { name: row.isTop ? "取消置顶" : "置顶", flag: "stick" },
                { name: "删除", flag: "delete" }
            ];
            let clientH =
                document.getElementsByClassName("more-operate")[0]
                    .clientHeight + 10;
            let clientW = this.$refs.operateSection.clientWidth;

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
         * 删除操作 | 上线架
         */
        batchSwitchStatus(row, type, flag) {
            console.log(row);
            let options = {
                switchType: type,
                flag: flag,
                idList: []
            };

            if (row == null || row == undefined) {
                options.idList = this.getCheckArr();
                this.$emit("batchSwitchStatus", options);
            } else {
                options.idList.push(row.id);
                this.$emit("batchSwitchStatus", options);
            }
        },

        /**
         * 复制 操作
         */
        batchCopy(row, type) {
            this.$emit("batchMove", type);
        },
        handleMoreOperate(flag) {
            this.clearSelection();
            let row = this.row;
            switch (flag) {
                case "move":
                    this.$emit("moveClassify", row, flag);
                    break;
                case "copy":
                    this.$emit("moveClassify", row, flag);
                    break;
                case "isOnSell":
                    this.batchSwitchStatus(row, 3, row.isOnSell);
                    break;
                case "stick":
                    this.batchSwitchStatus(row, 2, row.isTop);
                    break;
                case "delete":
                    this.batchSwitchStatus(row, 1, !row.isDelete);
                    break;
            }
        },
        clearSelection() {
            this.$refs.multipleTable.clearSelection();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../styles/manege-table.scss";
</style>



