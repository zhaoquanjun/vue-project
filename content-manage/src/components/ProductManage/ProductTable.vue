<template>
    <div class="table-content" id="table-list">
        <!-- <el-button type="danger" @click="batchRemove(null)">批量删除</el-button>
        <el-button type="danger" @click="batchTop(null, false)">批量置顶</el-button>
        <el-button type="danger" @click="batchTop(null, true)">批量取消置顶</el-button>
        <el-button type="danger" @click="batchPublish(null,false)">批量上线</el-button>
        <el-button type="danger" @click="batchPublish(null,true)">批量下线</el-button>
        <el-button type="danger" @click="batchMove(null)">批量移动</el-button>-->
        <el-table
            ref="multipleTable"
            :data="articlePageResult.list"
            tooltip-effect="dark"
            class="content-table"
            @selection-change="handleSelectionChange"
            @sort-change="sortByTopStatus"
        >
            <el-table-column type="selection"></el-table-column>

            <el-table-column prop="name" label="文章标题">
                <template slot-scope="scope">
                    <img
                        v-if="scope.row.thumbnailPicUrlList.length"
                        :src="scope.row.thumbnailPicUrlList[0]+'?x-oss-process=image/resize,m_lfit,h_40,w_40'"
                        class="cover"
                        alt
                    >
                    <!-- 未传图片 取不到 -->
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="productCategoryList" label="分类">
                <template slot-scope="scope">
                    <span>{{ scope.row.productCategoryList.length && scope.row.productCategoryList[0].displayName }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="isOnSell" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.isOnSell?"上架":"下架" }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="isTop" sortable="custom" label="置顶" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.isTop?"是":"否" }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="creatorName" label="作者" show-overflow-tooltip></el-table-column>

            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作">
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
                layout="total, sizes, prev, pager, next, jumper"
                :total="articlePageResult.totalRecord"
                :page-count="articlePageResult.totalPage"
                :page-size="articlePageResult.pageSize"
                :page-sizes="[1,5,10,15,20,50,100]"
                @current-change="changePageNum"
                @size-change="changePageSize"
            ></el-pagination>
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
            multipleSelection: [],
            operateList: [
                { name: "移动", flag: "move" },
                { name: "复制", flag: "copy" },
                { name: "下线", flag: "isOnSell" },
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
        sortByTopStatus: function(column, prop, order) {
            // descending ascending
            this.articleSearchOptions.OrderByTopOrder =
                column.order == "ascending"
                    ? true
                    : column.order == "descending"
                    ? false
                    : null;
            this.$emit("getArticleList");
        },
        /**
         * 单选或全选操作
         */
        handleSelectionChange(val) {
            this.multipleSelection = val;
              this.$emit("handleSelectionChange",val)
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
                { name: row.isOnSell ?"下架": "上架", flag: "isOnSell" },
                { name:row.isTop ?"取消置顶": "置顶", flag: "stick" },
                { name: "删除", flag: "delete" }
            ];
            this.$refs.operateSection.style.left =
                ev.pageX - ev.offsetX + 11 + "px";
            this.$refs.operateSection.style.top = ev.pageY - ev.offsetY + "px";
            this.$refs.operateSection.style.display = "block";
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
         * 移动分类操作
         */
        batchMove(row) {
            if (row == null || row == undefined) {
                var idList = this.getCheckArr();
                this.$emit("batchMove", idList);
            } else {
                this.$emit("batchMove", [row.id]);
            }
        },

        handleMoreOperate(flag) {
            let row = this.row;
            switch (flag) {
                case "move":
                    this.$emit("moveClassify", true, row);
                    this.batchMove(row);
                    break;
                case "copy":
                    break;
                case "isOnSell":
                    this.batchSwitchStatus(row, 3, row.isOnSell);
                    break;
                case "stick":
                    this.batchSwitchStatus(row, 2, row.isTop);
                    break;
                case "delete":
                    this.batchSwitchStatus(row, 1, row.isDelete);
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
            width: 3px;
            height: 15px;
            background: url("../../../static/images/more_operate.png") no-repeat
                center center;
            background-size: 100% 100%;
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

<style >
/* .table-content /deep/ .el-table__header-wrapper thead tr th {
  text-align: center;
  color: #fff;
  background: #00c1de;
}
.table-content
  /deep/
  .el-table__header-wrapper
  thead
  tr
  th.el-table_3_column_18 {
  text-align: left;
}
.table-content
  /deep/
  .el-table__header-wrapper
  thead
  tr
  th.el-table_3_column_24 {
  text-align: left;
}
.table-content /deep/ .el-table__body-wrapper tbody tr td {
  text-align: center;
}
.table-content /deep/ .el-table__body-wrapper tbody tr td.el-table_3_column_18 {
  text-align: left;
}
.table-content /deep/ .el-table__body-wrapper tbody tr td.el-table_3_column_24 {
  text-align: left;
} */

#table-list .el-table .has-gutter th {
    padding: 0;
    height: 32px;
    background: #00c1de !important;
}

#table-list .el-table th > .cell {
    color: #fff;
    font-weight: 400;
    font-size: 12px;
}
#table-list .el-table .el-table__row {
    height: 60px;
}
#table-list
    .el-pagination.is-background
    .el-pager
    li:not(.disabled).active {
    background-color: #01c0de;
}
#table-list .el-pagination .el-pagination__total {
    color: #8c8c8c;
}
#table-list .el-pager li {
    font-weight: 400;
    color: #252525;
    background-color: #fff;
    border: 1px solid rgba(229, 229, 229, 1);
}
#table-list .el-pager .active {
    background-color: #01c0de;
    color: #fff;
}

#table-list .el-carousel__item.is-animating {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>


