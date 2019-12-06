<template>
  <div class="popup-content__area">
    <div class="popup-content__add">
      <p>请选择所需链接的文件</p>
      <a :href="redirectUrl" target="_blank">
        <el-button type="primary" icon="el-icon-plus" size="small">添加文件</el-button>
      </a>
    </div>
    <div class="popup-content__main">
      <div class="content-main__slider">
        <el-tree
          :data="treeArray"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          @node-click="_handleNodeClick"
        ></el-tree>
      </div>
      <div class="content-main__list">
        <div class="content_main__inner">
          <div class="content-main__search">
            <el-input
              placeholder="搜索文件标题"
              prefix-icon="el-icon-search"
              size="small"
              v-model="fileTitle"
              @input="_handleSearch"
            ></el-input>
          </div>
          <div class="content-main__list">
            <div v-show="fileList.length > 0">
              <ul class="content-main__list--item">
                <li
                  v-for="(item, i) in fileList"
                  :key="i"
                  :class="{active: item.downloadPage == selectedUrl && curType == 'file'}"
                  @click.stop="_handleSelectPage(i)"
                >
                  <p class="single-line__overflow--hide">{{item.title}}</p>
                  <p class="date single-line__overflow--hide">
                    <span>{{item.createTimeStr && item.createTimeStr.slice(0, 10)}}</span>
                    <span
                      :style="{visibility: item.downloadPage == selectedUrl && curType == 'file' ? 'visible' : 'hidden'}"
                    ></span>
                  </p>
                </li>
              </ul>
              <el-pagination
                v-if="total > 0"
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="pageSize"
                :current-page="pageIndex"
                @current-change="_handleChangeCurrent"
                style="margin-top: 12px"
              ></el-pagination>
            </div>
            <none-area v-show="fileList.length <= 0" :target="target">
              <span v-if="!search">
                暂无文件，请先
                <span style="color: #00C1DE;cursor: pointer;">
                  <a :href="redirectUrl" target="_blank">添加文件</a>
                </span>
              </span>
              <span v-else>暂无搜索数据，请重新输入</span>
            </none-area>
            <loading v-show="loading" />
          </div>
        </div>
      </div>
    </div>
    <div class="popup-content__open">
      <p>页面打开方式</p>
      <div class="way-list__box">
        <el-radio v-model="way" label="_self" @change="_handleChageLinkTarget">当前窗口打开</el-radio>
        <el-radio
          v-model="way"
          label="_blank"
          style="margin-left: 24px;"
          @change="_handleChageLinkTarget"
        >新窗口打开</el-radio>
      </div>
    </div>
  </div>
</template>

<script>
import * as linkApi from "@/api/linkApi";
import environment from "@/environment/index";
import noneArea from "./none";
import Loading from "@/components/common/loading.vue";
export default {
  props: {
    model: {
      type: Object
    },
    selectedUrl: {
      type: String
    },
    way: {
      type: String
    },
    type: {
      type: String
    },
    curType: {
      type: String
    },
    index: {
      type: String
    }
  },
  data() {
    return {
      timer: null,
      fileTitle: "",
      pageSize: 6,
      total: 6,
      loading: false,
      defaultExpandedKeys: [],
      treeArray: [],
      fileList: [],
      nodeIdArr: [],
      target: "createFile",
      redirectUrl: environment.redirectUrl.createFile
    };
  },
  components: {
    noneArea,
    Loading
  },
  computed: {
    pageIndex: {
      get: function() {
        return parseInt(this.model["PageIndex"]) || 1;
      },
      set: function() {}
    }
  },
  created() {
    this.getFileList(this.nodeIdArr);
    this.getFileTree();
  },
  methods: {
    _handleNodeClick(data) {
      this.nodeIdArr = this._handleRecursive(data.children, [data.id]);
      this.getFileList(this.nodeIdArr);
    },
    _handleRecursive(data, arr) {
      if (
        Object.prototype.toString.call(data) == "[object Array]" &&
        data.length > 0
      ) {
        data.forEach(p => {
          arr.push(p.id);
          this._handleRecursive(p.children, arr);
        });
      }
      return arr;
    },
    async getFileList(idArray) {
      let options = {
        pageSize: this.pageSize, //11
        pageIndex: this.pageIndex, //1
        orderByType: 1, //1 创建时间 2:名字
        isDescending: true, // 倒叙 或 正序
        keyword: this.fileTitle, //1
        isDelete: false, //1
        isOnSell: true, //is 上架
        categoryIdList: idArray //1,
      };
      this.loading = true;
      let { data } = await linkApi.getFileList(options);
      this.total = data.totalRecord;
      this.fileList = data.list;
      this.loading = false;
    },
    async getFileTree() {
      let { data } = await linkApi.getFileCategory();
      this.defaultExpandedKeys = this._handleRecursive(data.treeArray, []);
      this.treeArray = data.treeArray;
    },
    _handleSelectPage(i) {
      this.$emit("handleChangeUrl", {
        url: this.fileList[i].downloadPage,
        title: this.fileList[i].title,
        cType: "file",
        pageIndex: this.pageIndex
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
      this.model["PageIndex"] = val;
      this.getFileList(this.nodeIdArr);
    }
  },
  watch: {
    fileList() {
      if (!this.fileList.length && this.fileTitle !== "") {
        this.search = true;
      }
      if (!this.fileList.length && this.fileTitle == "") {
        this.search = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content__area {
  width: 590px;
  height: 454px;
  .popup-content__add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 12px;
    p {
      color: $--color-primary;
      font-size: $--font-size-small;
      line-height: 17px;
      cursor: auto;
    }
  }
  .popup-content__add {
    .el-button--small {
      width: 120px;
      height: 32px;
      background: rgba(0, 193, 222, 1);
      border-radius: $--border-radius-base;
      border-color: rgba(0, 193, 222, 1);
      span,
      i {
        color: #fff;
      }
    }
  }
  .popup-content__main {
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    width: 563px;
    height: 297px;
    text-align: right;
    border: $--border-base;
    .content-main__slider {
      padding: 16px 8px;
      width: 128px;
      height: 294px;
      overflow-y: auto;
      border-right: $--border-base;
    }
    .content-main__list {
      width: 434px;
      height: 297px;
      .content_main__inner {
        height: 100%;
      }
      .content-main__search {
        display: flex;
        align-items: flex-end;
        margin-left: 8px;
        width: 415px;
        height: 36px;
        border-bottom: $--border-base;
      }
      .content-main__search {
        .el-icon-search {
          color: #b5b5b5;
        }
      } 
      .content-main__search {
        .el-input__inner {
          border: none !important;
          height: 28px;
          line-height: 28px;
          text-align: left;
        }
      } 
      .content-main__list {
        position: relative;
        overflow: hidden;
        height: calc(100% - 36px);
        .content-main__list--item {
          padding: 10px 6px 0;
          width: 434px;
          height: 200px;
          overflow-y: auto;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            padding: 0 8px;
            height: 26px;
            cursor: pointer;
            p {
              width: 300px;
              padding: 0;
              font-size: $--font-size-small;
              color: #262626;
              text-align: left;
            }
            p.date {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              width: 128px;
              span {
                color: #b5b5b5;
              }
              span:last-of-type {
                display: block;
                margin-left: 14px;
                width: 18px;
                height: 18px;
                background: url("~img/link/selected.png") no-repeat
                  center center;
                background-size: 100% 100%;
              }
            }
            &:hover {
              background: #f8fafc;
              p {
                color: #00c1de;
              }
            }
          }
          .active {
            background: #00c1de;
            p {
              color: #fff;
              span:first-of-type {
                color: #fff;
              }
            }
            &:hover {
              background: #00c1de;
              p {
                color: #fff;
                span:first-of-type {
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
  .popup-content__main {
    .btn-prev, .btn-next, .el-pager li {
      background: #fff;
      border: $--border-base;
    }
  }
  .popup-content__open {
    margin-top: 16px;
    padding: 16px 16px 0;
    width: 590px;
    height: 78px;
    border-top: $--border-base;
    p {
      padding: 0 0 12px;
      font-size: $--font-size-small;
      line-height: 17px;
      color: #00c1de;
    }
    .way-list__box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
}
</style>
