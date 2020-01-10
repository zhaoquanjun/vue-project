<template>
  <div class="popup-content__area">
    <div class="popup-content__add">
      <p>请选择所需链接的文章</p>
      <button class="cl-button cl-button--primary" @click="toCreateNews">添加文章</button>
    </div>
    <div class="popup-content__main">
      <div class="content-main__slider">
        <el-tree
          ref="tree"
          :data="treeArray"
          node-key="id"
          :empty-text="'暂无分类'"
          :data-ids="nodeIdArr"
          :default-checked-keys="nodeIdArr"
          :default-expanded-keys="nodeIdArr"
          :current-node-key="curNodeId"
          @node-click="_handleNodeClick"
        ></el-tree>
      </div>
      <div class="content-main__list">
        <div class="content-main__search">
          <el-input
            v-model="newsTitle"
            placeholder="搜索文章标题"
            prefix-icon="el-icon-search"
            size="small"
            @input="_handleSearch"
          ></el-input>
        </div>
        <div v-show="newsList.length" class="content-main__list--outer">
          <ul class="content-main__list--item">
            <li
              v-for="(it, i) in newsList"
              :id="selectedId"
              :key="i"
              :itid="it.id"
              :curType="curType"
              :data-index="dataIndex"
              :class="{
                active:
                  dataIndex == i && slider == 'news' && selectedId == it.id
              }"
              @click.stop="_handleSelectPage(i)"
            >
              <p class="single-line__overflow--hide">{{ it.title }}</p>
              <p class="date single-line__overflow--hide">
                <span>
                  {{
                  it.createTimePrt && it.createTimePrt.slice(0, 10)
                  }}
                </span>
                <i
                  class="iconfont iconduihao"
                  :style="{
                    visibility:
                      dataIndex == i && slider == 'news' && selectedId == it.id
                        ? 'visible'
                        : 'hidden'
                  }"
                ></i>
              </p>
            </li>
          </ul>
          <div class="cl-paganation pageing noJumper" id="pageing">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="total"
              :current-page="pageIndex"
              style="margin-top: 12px"
              @current-change="_handleChangeCurrent"
            ></el-pagination>
          </div>
        </div>
        <none-area v-show="!newsList.length" :target="target">
          <span v-if="!search">
            暂无文章，请先
            <span style="color: #00C1DE;cursor: pointer;">
              <button @click="toCreateNews">添加文章</button>
            </span>
          </span>
          <span v-else>暂无搜索数据，请重新输入</span>
        </none-area>
      </div>
    </div>
    <target :way="way" @handleChangeLinkTarget="handleChangeLinkTarget"></target>
    <detail
      ref="detailPageContent"
      :page-type="'newsDetail'"
      :model="model"
      :page-size="pageSize"
      :page-index="pageIndex"
      @selectDetailPage="selectDetailPage"
    ></detail>
  </div>
</template>

<script>
import * as linkApi from "@/api/request/linkApi";
import NoneArea from "./none";
import Target from "./target";
import Detail from "./detail";
export default {
  components: {
    NoneArea,
    Target,
    Detail
  },
  props: {
    model: {
      type: Object
    },
    way: {
      type: String
    },
    curType: {
      type: String
    },
    slider: {
      type: String
    }
  },
  data() {
    return {
      timer: null,
      pageSize: 6,
      total: 6,
      newsTitle: "",
      treeArray: [],
      newsList: [],
      nodeIdArr: [],
      pageIndex: 1,
      oldPageIndex: 1,
      oldDataIndex: 0,
      dataIndexFlag: false,
      dataIndex: 0,
      oldId: "",
      target: "createArticle",
      search: false,
      slotWords: {
        prev: "暂无文章，请先",
        last: "添加文章"
      }
    };
  },
  computed: {
    selectedId: {
      get: function() {
        return this.model["Id"];
      },
      set: function() {}
    },
    // cType: {
    //   get: function() {
    //     return this.model["Ctype"];
    //   },
    //   set: function() {}
    // },
    curNodeId: {
        get: function() {
          let categoryId = 0;
        //   if (this.model["Ctype"] === "news") {
        //     categoryId = this.model["CategoryId"] ? this.model["CategoryId"] : 0;
        //   }
          return categoryId;
        },
        set: function() {}
    }
  },
  watch: {
    newsList() {
      if (!this.newsList.length && this.newsTitle !== "") {
        this.search = true;
      }
      if (!this.newsList.length && this.newsTitle === "") {
        this.search = false;
      }
    }
  },
  created() {
    this.getCategorytree();
  },
  mounted() {
    this.oldId = this.selectedId;
    this.$refs.detailPageContent.getPageDetailData();
  },
  methods: {
    toCreateNews() {
      this.$router.push({
        path: "/content/createarticle"
      });
    },
    _handleNodeClick(data) {
      this.nodeIdArr = [data.id];
      this._cycleForCategoryIds(data.children, this.nodeIdArr);
      const id = this.cType === "news" ? this.selectedId : "";
      this.getNewsList(this.nodeIdArr, id);
    },
    async getNewsList(idArray, id) {
      const options = {
        title: this.newsTitle,
        categoryIdList: idArray,
        newsOrderColumns: "publishtime",
        topStatus: null,
        publishStatus: null,
        pageSize: this.pageSize, // 11
        pageIndex: this.pageIndex, // 1
        isDescending: true,
        id: id
      };
      this.$Loading.show();
      const { data } = await linkApi.getArticleList(options);
      this.total = data.totalRecord;
      this.newsList = data.list;
      this.pageIndex = data.pageIndex;
      this.$Loading.hide();
      if (!this.dataIndexFlag) {
        this.dataIndexFlag = true;
        this.dataIndex = data.dataIndex;
        this.oldDataIndex = data.dataIndex;
        this.oldPageIndex = data.pageIndex;
      } else {
        if (this.pageIndex === this.oldPageIndex) {
          this.dataIndex = data.dataIndex;
        } else {
          this.dataIndex = -1;
        }
      }
    },
    async getCategorytree() {
      const { data } = await linkApi.getArticleCategory();
      this.treeArray = data;
      this.nodeIdArr = [0];
      this._getCurrentIds(data);
      this.getNewsList(this.nodeIdArr, this.selectedId);
    },
    _getCurrentIds(arr) {
      if (this.cType === "news") {
        if (
          this.model["CategoryId"] === 0 ||
          this.model["CategoryId"] == null
        ) {
          this.nodeIdArr = [];
          this._cycleForCategoryIds(arr, this.nodeIdArr);
        } else {
          this.nodeIdArr = [this.model["CategoryId"]];
        }
      }
    },
    _cycleForCategoryIds(data, arr) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        arr.push(item.id);
        if (item.children && item.children.length > 0) {
          this._cycleForCategoryIds(data[i].children, arr);
        }
      }
    },
    _handleSelectPage(i) {
      this.dataIndex = i;
      this.model["Id"] = this.newsList[i].id;
      this.$emit("handleChangeUrl", {
        url: this.newsList[i].url,
        title: this.newsList[i].title,
        cType: "news",
        id: this.newsList[i].id,
        categoryId: this.newsList[i].categoryId
      });
    },
    handleChangeLinkTarget(val) {
      this.$emit("handleChangeTarget", val);
    },
    _handleSearch(val) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.newsList = [];
        this.newsTitle = val;
        this.getNewsList(this.nodeIdArr, this.selectedId);
      }, 500);
    },
    _handleChangeCurrent(val) {
      var id = this.selectedId;
      if (val !== this.oldPageIndex) id = "";
      this.pageIndex = val;
      this.getNewsList(this.nodeIdArr, id);
    },
    handleCancle() {
      this.dataIndex = this.oldDataIndex;
      this.pageIndex = this.oldPageIndex;
      this.model["Id"] = this.oldId;
    },
    selectDetailPage(val) {
      this.$emit("changeDetailPaeg", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content__area {
  width: 582px;
  border-left: $--border-base;
  .popup-content__add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 24px;
    p {
      font-size: 14px;
      line-height: 20px;
      cursor: auto;
    }
  }
  // .popup-content__add /deep/ .el-button--small {
  //   font-size: 14px;
  //   font-family: "PingFangSC";
  //   font-weight: 400;
  //   width: 96px;
  //   height: 32px;
  //   padding: 6px 16px;
  //   background: rgba(0, 193, 222, 1);
  //   border-radius: 2px;
  //   border-color: rgba(0, 193, 222, 1);
  // }
  .popup-content__main {
    display: flex;
    justify-content: flex-start;
    width: 558px;
    text-align: right;
    border-top: $--border-base;
    .content-main__slider {
      padding: 16px 12px;
      width: 172px;
      max-height: 362px;
      overflow-y: auto;
    }
    .content-main__list {
      position: relative;
      width: 100%;
      border-left: $--border-base;
      .content-main__search {
        display: flex;
        align-items: flex-end;
        margin-top: 12px;
        margin-left: 12px;
        width: calc(100% - 12px);
        height: 40px;
      }
      .content-main__search /deep/ .el-icon-search {
        color: $--color-text-secondary;
      }
      .content-main__search /deep/ .el-input__inner {
        border: $--border-base;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        text-align: left;
      }
      .content-main__list--outer {
        overflow: hidden;
        padding-bottom: 16px;
        .content-main__list--item {
          padding: 10px 0 0 12px;
          width: 100%;
          height: 270px;
          overflow-y: auto;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            padding: 0 8px;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            p {
              width: 210px;
              padding: 0;
              font-size: 14px;
              color: $--color-text-regular;
              text-align: left;
              line-height: 40px;
            }
            p.date {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              width: 144px;
              span {
                color: $--color-text-regular;
                margin-right: 16px;
              }
            }
            &:hover {
              background: $--background-color-hover;
            }
          }
          .active {
            background: $--background-color-selected;
            p,
            p.date {
              color: $--color-text-orange;
              span,
              i {
                color: $--color-text-orange;
              }
            }
            &:hover {
              background: $--background-color-hover;
              p {
                color: $--color-text-orange;
                span,
                i {
                  color: $--color-text-orange;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
