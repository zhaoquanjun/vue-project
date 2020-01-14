<template>
  <div class="popup-content__area">
    <div class="popup-content__add">
      <p>请选择所需链接的文件</p>
      <button class="cl-button cl-button--primary" @click="toCreateFile">添加文件</button>
    </div>
    <div class="popup-content__main">
      <div class="content-main__slider">
        <el-tree
          :data="treeArray"
          node-key="id"
          :default-checked-keys="nodeIdArr"
          :default-expanded-keys="nodeIdArr"
          :current-node-key="curNodeId"
          @node-click="_handleNodeClick"
        ></el-tree>
      </div>
      <div class="content-main__list">
        <div class="content_main__inner">
          <div class="content-main__search">
            <el-input
              v-model="fileTitle"
              placeholder="搜索文件标题"
              prefix-icon="el-icon-search"
              size="small"
              @input="_handleSearch"
            ></el-input>
          </div>
          <div class="content-main__list">
            <div v-show="fileList.length > 0" class="content-main__list--outer">
              <ul class="content-main__list--item">
                <li
                  v-for="(item, i) in fileList"
                  :id="oldId"
                  :key="i"
                  :itid="item.id"
                  :curType="curType"
                  :data-index="dataIndex"
                  :class="{
                    active:
                      dataIndex == i &&
                      slider == 'file' &&
                      selectedId === item.id
                  }"
                  @click.stop="_handleSelectPage(i)"
                >
                  <p class="single-line__overflow--hide">{{ item.title }}{{ item.fileExtension }}</p>
                  <p class="date single-line__overflow--hide">
                    <span>
                      {{
                      item.createTimeStr && item.createTimeStr.slice(0, 10)
                      }}
                    </span>
                    <i
                      class="iconfont iconduihao"
                      :style="{
                        visibility:
                          dataIndex == i &&
                          slider == 'file' &&
                          selectedId == item.id
                            ? 'visible'
                            : 'hidden'
                      }"
                    ></i>
                  </p>
                </li>
              </ul>

              <div class="cl-paganation pageing noJumper" id="pageing" style="margin:0;padding:0">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="total"
                  :page-size="pageSize"
                  :current-page="pageIndex"
                  @current-change="_handleChangeCurrent"
                ></el-pagination>
              </div>
            </div>
            <none-area v-show="fileList.length <= 0" :target="target">
              <span v-if="!search">
                暂无文件，请先
                <span style="color: #00C1DE;cursor: pointer;">
                  <button @click="toCreateFile">添加文件</button>
                </span>
              </span>
              <span v-else>暂无搜索数据，请重新输入</span>
            </none-area>
          </div>
        </div>
      </div>
    </div>
    <div class="popup-content__open">
      <p>页面打开方式</p>
      <div class="way-list__box">
        <el-radio v-model="targetWay" label="_self" @change="_handleChageLinkTarget('_self')">当前窗口打开</el-radio>
        <el-radio
          v-model="targetWay"
          label="_blank"
          style="margin-left: 24px;"
          @change="_handleChageLinkTarget('_blank')"
        >新窗口打开</el-radio>
      </div>
    </div>
  </div>
</template>

<script>
import * as linkApi from "@/api/request/linkApi";
import noneArea from "./none";
export default {
  components: {
    noneArea
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
      fileTitle: "",
      pageSize: 6,
      total: 6,
      treeArray: [],
      fileList: [],
      nodeIdArr: [],
      pageIndex: 1,
      oldPageIndex: 1,
      oldDataIndex: 0,
      dataIndex: 0,
      oldId: "",
      dataIndexFlag: false,
      target: "createFile",
      search: false
    };
  },
  computed: {
    selectedId: {
      get: function() {
        return this.model["Id"];
      },
      set: function() {}
    },
    cType: {
      get: function() {
        return this.model["Ctype"];
      },
      set: function() {}
    },
    curNodeId: {
      get: function() {
        let categoryId = 0;
        if (this.model["Ctype"] == "file") {
          categoryId = this.model["CategoryId"] ? this.model["CategoryId"] : 0;
        }
        return categoryId;
      },
      set: function() {}
    },
    targetWay: {
      get: function () {
        return this.way;
      },
      set: function () { }
    }
  },
  watch: {
    fileList() {
      if (!this.fileList.length && this.fileTitle !== "") {
        this.search = true;
      }
      if (!this.fileList.length && this.fileTitle === "") {
        this.search = false;
      }
    }
  },
  created() {
    this.getFileTree();
  },
  mounted() {
    this.oldId = this.selectedId;
  },
  methods: {
    toCreateFile() {
      this.$router.push({
        path: "/content/file"
      });
    },
    _handleNodeClick(data) {
      this.nodeIdArr = [data.id];
      this._cycleForCategoryIds(data.children, this.nodeIdArr);
      const id = this.cType === "file" ? this.selectedId : "";
      this.getFileList(this.nodeIdArr, id);
    },
    async getFileList(idArray, id) {
      const options = {
        pageSize: this.pageSize, // 11
        pageIndex: this.pageIndex, // 1
        orderByType: 1,
        isDescending: true, // 倒叙 或 正序
        keyword: this.fileTitle, // 1
        isDelete: false, // 1
        isOnSell: null, // is 上架
        categoryIdList: idArray, // 1,
        id: id
      };
      this.$Loading.show();
      const { data } = await linkApi.getFileList(options);
      this.total = data.totalRecord;
      this.fileList = data.list;
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
    async getFileTree() {
      const { data } = await linkApi.getFileCategory();
      this.treeArray = data.treeArray;
      this.nodeIdArr = [0];
      this._getCurrentIds(data.treeArray);
      this.getFileList(this.nodeIdArr, this.selectedId);
    },
    _getCurrentIds(arr) {
      if (this.cType === "file") {
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
      this.$set(this.model, "Id", this.fileList[i].id);
      this.$emit("handleChangeUrl", {
        url: this.fileList[i].contentQueryDownloadApiUrl,
        title: this.fileList[i].title,
        cType: "file",
        id: this.fileList[i].id,
        categoryId: this.fileList[i].categoryId
      });
    },
    _handleChageLinkTarget(val) {
      this.$emit("handleChangeTarget", val);
    },
    _handleSearch(val) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.fileList = [];
        this.fileTitle = val;
        this.getFileList(this.nodeIdArr);
      }, 500);
    },
    _handleChangeCurrent(val) {
      var id = this.selectedId;
      if (val !== this.oldPageIndex) id = "";
      this.pageIndex = val;
      this.getFileList(this.nodeIdArr, id);
    },
    handleCancle() {
      this.dataIndex = this.oldDataIndex;
      this.pageIndex = this.oldPageIndex;
      this.selectedId = this.oldId;
    }
  }
};
</script>

<style lang="scss" scoped>
.single-line__overflow--hide {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
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
      box-sizing: border-box;
    }
    .content-main__list {
      position: relative;
      width: 100%;
      border-left: $--border-base;
      box-sizing: border-box;
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
        // padding-bottom: 16px;
        box-sizing: border-box;
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

  .popup-content__open {
    margin-right: 16px;
    padding: 16px 0 0 24px;
    width: 566px;
    height: 78px;
    border-top: 1px solid #eee;
    p {
      padding: 0 0 12px;
      font-size: 14px;
      line-height: 20px;
    }
    .way-list__box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
}
</style>
