<template>
  <div class="table-content" id="table-list">
    <el-table
      ref="multipleTable"
      :data="articlePageResult.list"
      tooltip-effect="dark"
      class="content-table"
      :height="tableHeight + 20"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <template slot="empty">
        <div class="empty-table" @click="addArticle">
          <img src="~img/table-empty.png" />
          <p>添加数据</p>
        </div>
      </template>
      <el-table-column type="selection"></el-table-column>

      <el-table-column
        prop="title"
        label="文章标题"
        min-width="200"
        height="50"
      >
        <template slot-scope="scope">
          <span class="isTop" v-show="scope.row.isTop">置顶</span>
          <div
            class="title"
            @click="preview(scope.row.id, scope.row.defaultSiteId)"
          >
            <!-- <el-tooltip
              class="item outline"
              effect="dark"
              :content="scope.row.title"
              placement="top"
            >
              <span class="ellipsis cursor-p">{{ scope.row.title }}</span>
            </el-tooltip> -->
            <span class="ellipsis cursor-p">{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="categoryName"
        label="分类"
        min-width="100"
        height="50"
      >
        <template slot-scope="scope">
          <!-- <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.categoryName"
            placement="top"
          >
            <span style="width:80px" class="ellipsis">{{
              scope.row.categoryName
            }}</span>
          </el-tooltip> -->
          <span style="width:80px" class="ellipsis">{{
            scope.row.categoryName
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="updateTimePrt"
        label="最后编辑时间"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.createTimePrt"
            placement="top"
          >
            <span>{{ scope.row.createTimePrt }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column min-width="100" prop="isOnSell" label="状态">
        <template slot-scope="scope">
          <span style="padding-right: 8px;">{{
            scope.row.isPublish ? "已上线" : "未上线"
          }}</span>
          <div
            class="el-switch"
            :class="{ 'is-checked': scope.row.isPublish }"
            @click="batchPublish(scope.row, scope.row.isPublish)"
          ></div>
        </template>
      </el-table-column>

      <el-table-column
        prop="isPublishPrt"
        label="多语言"
        min-width="80"
        v-show="languagesList.length > 0"
      >
        <template slot-scope="scope">
          <span class="ellipsis">{{
            scope.row.language ? scope.row.language : ""
          }}</span>
          <el-tooltip
            class="item"
            effect="dark"
            :open-delay="200"
            :disabled="scope.row.translateToolTip.length == 0"
            :content="scope.row.translateToolTip"
            placement="top"
          >
            <span
              class="translate-icon"
              :data-language="scope.row.language"
              @mouseenter.stop="
                _handleMouseenterTranslate(
                  $event,
                  scope.row,
                  scope.row.language != 'zh-CN'
                )
              "
              @mouseleave.stop="
                _handleMouseleaveTranslte(
                  scope.row,
                  scope.row.language != 'zh-CN'
                )
              "
              @click.stop="
                _handleTranslateItem(
                  $event,
                  scope.row,
                  scope.row.language != 'zh-CN'
                )
              "
            >
              <ul
                v-if="scope.row.translateToolTip === ''"
                class="more-operate"
                :ref="'translateModal' + scope.row.index"
              >
                <li class="view-title">查看已翻译的文章</li>
                <li
                  class="view-item"
                  v-for="(item, index) in hasTranslateList"
                  :key="index"
                  @click="_handleViewTranslatedNews(item)"
                >
                  {{ item.languageStr }}
                </li>
                <li
                  class="translate-tomore"
                  @click="_handleTranslateToMore(scope.row)"
                  v-show="hasTranslateList.length < languagesList.length"
                >
                  翻译为更多语言
                </li>
              </ul>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="置顶" min-width="50">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.isTop ? '置顶' : '未置顶'"
            placement="top"
          >
            <i
              class="iconfont iconzd1"
              :class="{ 'is-active': scope.row.isTop }"
              @click="batchTop(scope.row)"
            ></i>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="编辑" min-width="50">
        <template slot-scope="scope">
          <i class="iconfont iconbianji" @click="handleEdit(scope.row)"></i>
        </template>
      </el-table-column>

      <el-table-column
        label=""
        v-if="$store.state.dashboard.isContentwrite"
        min-width="50"
      >
        <template slot-scope="scope">
          <div class="handle-btn-wrap">
            <i
              class="cl-iconfont iconfont iconsangedian is-square"
              @click.stop="_handleShowMoreOperate($event, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="cl-paganation pageing"
      :class="{ noJumper: articlePageResult.totalPage <= 10 }"
    >
      <el-pagination
        v-if="articlePageResult.totalRecord > 0"
        background
        :layout="
          articlePageResult.totalPage > 10
            ? 'total, slot, sizes, prev, pager, next,jumper'
            : 'total, slot, sizes, prev, pager, next'
        "
        :total="articlePageResult.totalRecord"
        :page-size="articlePageResult.pageSize"
        :page-sizes="[10, 20, 50]"
        @current-change="changePageNum"
        @size-change="changePageSize"
      >
        <div class="sizes-title">，每页显示</div>
        <button v-if="articlePageResult.totalPage > 10" class="paging-confirm">
          跳转
        </button>
      </el-pagination>
    </div>
    <ul class="operate-section" ref="operateSection">
      <li
        class="operate-item"
        v-for="(it, index) in operateList"
        :key="index"
        @click="handleMoreOperate(it.flag)"
      >
        {{ it.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import * as articleManageApi from "@/api/request/articleManageApi";

export default {
  props: ["articlePageResult", "articleSearchOptions", "languagesList"],

  data() {
    return {
      defaultImg: require("img/content-default-pic.png"),
      multipleSelection: [],
      operateList: [
        { name: "移动", flag: "move" },
        { name: "复制", flag: "copy" },
        { name: "翻译", flag: "translate" },
        { name: "下线", flag: "isOnsell" },
        { name: "置顶", flag: "stick" },
        { name: "删除", flag: "delete" }
      ],
      row: "",
      tableHeight: 500,
      loadingShow: true,
      tableData: "",
      hasTranslateList: [],
      timer: null,
      leaveTimer: null
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
    window.onImgError = ele => {
      ele.src = ele.attributes["src"] = this.defaultImg;
    };
  },
  methods: {
    // 给行添加索引
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    _handleViewTranslatedNews(o) {
      this.$emit("handleEditArticle", o);
    },
    _handleTranslateToMore(row) {
      this.$emit("handleGetSignalTranslateSource", row, this.hasTranslateList);
    },
    _handleTranslateItem(e, row, type) {
      if (this.hasTranslateList.length > 0) {
        this.hasTranslateList.length === this.languagesList.length &&
          this._handleViewTranslatedNews(this.hasTranslateList[0]);
      } else {
        if (type) return;
        this.$emit("handleGetSignalTranslateSource", row);
      }
    },
    // 鼠标进入翻译icon
    _handleMouseenterTranslate(e, row, type) {
      this.timer && clearTimeout(this.timer);
      if (type) return false;
      this.timer = setTimeout(async () => {
        let { data } = await articleManageApi.newsTranslateStatus(row.id);

        if (data.length === 0) {
          this.articlePageResult.list[row.index].translateToolTip =
            "点击翻译文章";
        }
        if (data.length === 1) {
          if (this.languagesList.length === 1) {
            this.articlePageResult.list[row.index].translateToolTip =
              "查看已翻译的文章";
          }
          if (this.languagesList.length > 1) {
            this.articlePageResult.list[row.index].translateToolTip = "";
            this.hasTranslateList = data;
            if (this.$refs["translateModal" + row.index]) {
              const left = e.clientX + "px";
              const top = e.clientY + "px";
              this.$refs["translateModal" + row.index].style.left = left;
              this.$refs["translateModal" + row.index].style.top = top;
            }
          }
        }
        if (data.length > 1) {
          if (data.length === this.languagesList.length) {
            this.articlePageResult.list[row.index].translateToolTip = "";
            this.hasTranslateList = data;
            if (this.$refs["translateModal" + row.index]) {
              const left = e.clientX + "px";
              const top = e.clientY + "px";
              this.$refs["translateModal" + row.index].style.left = left;
              this.$refs["translateModal" + row.index].style.top = top;
            }
          }
        }
      }, 200);
    },
    _handleMouseleaveTranslte(row, type) {
      if (type) return false;
      this.hasTranslateList = [];
      if (this.$refs["translateModal" + row.index]) {
        this.$refs["translateModal" + row.index].style.left = "-300%";
        this.$refs["translateModal" + row.index].style.top = "-300%";
      }
    },
    _handleGetMoreTranslateSource() {
      this.$emit("handleGetMoreTranslateSource");
    },
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
      this.$emit("handleEditArticle", row);
    },
    _handleShowMoreOperate(ev, row) {
      (this.operateList = [
        { name: "移动", flag: "move" },
        { name: "复制", flag: "copy" },
        { name: row.isPublish ? "下线" : "上线", flag: "isOnSell" },
        { name: "删除", flag: "delete" }
      ]),
        (this.row = row);
      this.$refs.operateSection.style.right =
        document.documentElement.clientWidth - ev.pageX - ev.offsetX + "px";
      this.$refs.operateSection.style.top = ev.pageY - ev.offsetY - 160 + "px";

      if (this.$refs.operateSection.style.display == "block") {
        this.$refs.operateSection.style.display = "none";
      } else {
        this.$refs.operateSection.style.display = "block";
      }
    },
    /**
     * 显示无数据icon时的添加数据操作
     */
    addArticle() {
      this.$emit("addArticle");
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
    //创建时间排序
    sortChange(row) {
      if (row.order == "ascending") {
        this.articleSearchOptions.isDescending = false;
      } else {
        this.articleSearchOptions.isDescending = true;
      }
      this.$emit("getArticleList");
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
        case "delete":
          this.batchRemove(row);
          break;
        case "translate":
          this._handleGetMoreTranslateSource();
      }
    },
    /**
     * 预览
     */
    async preview(previewId, siteId) {
      let { data } = await articleManageApi.GetContentPrevAddress(
        "NewsDetail",
        siteId
      );
      var prevAddress = data;
      if (prevAddress) {
        let newWindow = window.open();
        newWindow.location.href = prevAddress + previewId + ".html";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/content-manage/manege-table.scss";
.title-color {
  color: #262626;
}
.title {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.translate-icon {
  margin-top: -2px;
  margin-left: 8px;
  display: inline-block;
  width: 25px;
  min-width: 25px;
  height: 20px;
  cursor: pointer;
  background: url("~img/content-icon/translate_icon.png") no-repeat center
    center;
  background-size: 100% 100%;

  .more-operate {
    position: fixed;
    left: -300%;
    top: -300%;
    transform: translateX(-50%);
    display: none;
    width: 140px;
    background: $--color-white;
    color: $--color-text-primary;
    box-shadow: $--box-shadow-base;
    z-index: 1999;

    li {
      text-align: center;
      cursor: pointer;

      &:hover {
        color: $--color-primary;
        background-color: $--background-color-hover;
      }
    }

    li:first-of-type {
      cursor: default;
      font-size: $--font-size-small;

      &:hover {
        color: $--color-text-primary;
        background-color: $--color-white;
      }
    }

    .view-title,
    .translate-tomore {
      font-size: $--font-size-small;
      padding: 8px 16px;
    }

    .view-item {
      font-size: $--font-size-small;
      padding: 6px 16px;
    }

    &::after {
      position: absolute;
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
      display: block;
      content: "";
      width: 0;
      height: 0;
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      border-bottom: 5px solid $--color-white;
    }
  }
}

.translate-icon[data-language="zh-CN"]:hover {
  .more-operate {
    display: block;
  }
}

.el-switch {
  position: relative;
  width: 27px;
  height: 16px;
  border-radius: 10px;
  background-color: #dcdfe6;
  cursor: pointer;

  &::after {
    position: absolute;
    left: 60%;
    display: block;
    content: "";
    margin-left: -15px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s linear;
  }
}

.el-switch.is-checked {
  background-color: $--color-primary;

  &::after {
    left: 100%;
  }
}

.is-active {
  color: $--color-primary;
}

.disabled {
  cursor: not-allowed;
  opacity: 0.7;
  filter: Alpha(opacity=70);
}
.el-table /deep/ .ascending .sort-caret.ascending {
  border-bottom-color: $--color-primary;
}
.el-table /deep/ .descending .sort-caret.descending {
  border-top-color: $--color-primary;
}
.table-content /deep/ .el-tooltip.ellipsis.cursor-p.item {
  outline: none;
}
.table-content /deep/ .el-table__empty-text {
  width: 0;
}
</style>
