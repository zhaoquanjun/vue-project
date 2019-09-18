<template>
  <div class="popup-content__area">
    <div class="popup-content__add">
      <p>请选择所需链接的产品</p>
      <a :href="redirectUrl" target="_blank">
        <el-button type="primary" icon="el-icon-plus" size="small">添加产品</el-button>
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
        <div class="content-main__search">
          <el-input
            placeholder="搜索产品标题"
            prefix-icon="el-icon-search"
            size="small"
            v-model="productTitle"
            @input="_handleSearch"
          ></el-input>
        </div>
        <div class="content-main__list--outer">
          <div v-show="productList.length">
            <ul class="content-main__list--item">
              <li
                v-for="(it, i) in productList"
                :key="i"
                :class="{active: it.url == selectedUrl && curType == 'product'}"
                @click.stop="_handleSelectPage(i)"
              >
                <p class="single-line__overflow--hide">{{it.name}}</p>
                <p class="date single-line__overflow--hide">
                  <span>{{it.createTime && it.createTime.slice(0, 10)}}</span>
                  <span
                    :style="{visibility: it.url == selectedUrl && curType == 'product' ? 'visible' : 'hidden'}"
                  ></span>
                </p>
              </li>
            </ul>
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="total"
              :current-page="pageIndex"
              @current-change="_handleChangeCurrent"
              style="margin-top: 12px"
            ></el-pagination>
          </div>
          <none-area v-show="!productList.length" :target="target">
            <span v-if="!search">
              暂无产品，请先
              <span style="color: #00C1DE;cursor: pointer;">
                <a :href="redirectUrl" target="_blank">添加产品</a>
              </span>
            </span>
            <span v-else>暂无搜索数据，请重新输入</span>
          </none-area>
          <loading v-show="loading" />
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
import * as linkApi from "@api/linkApi";
import environment from "@environment/index";
import noneArea from "./none";
import Loading from "@comp/loading/loading";
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
      pageSize: 6,
      total: 6,
      productTitle: "",
      defaultExpandedKeys: [],
      treeArray: [],
      productList: [],
      nodeIdArr: [],
      loading: false,
      search: false,
      target: "createProduct",
      redirectUrl: environment.redirectUrl.createProduct
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
    this.getProductList(this.nodeIdArr);
    this.getProductTree();
  },
  methods: {
    _handleNodeClick(data) {
      this.nodeIdArr = this._handleRecursive(data.children, [data.id]);
      this.getProductList(this.nodeIdArr);
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
    async getProductList(idArray) {
      let options = {
        pageSize: this.pageSize, //11
        pageIndex: this.pageIndex, //1
        orderByType: 1, //1 创建时间 2:名字
        isDescending: true, // 倒叙 或 正序
        keyword: this.productTitle, //1
        isDelete: false, //1
        isOnSell: null, //is 上架
        categoryIdList: idArray //1,
      };
      this.loading = true;
      let { data } = await linkApi.getProductList(options);
      this.total = data.totalRecord;
      this.productList = data.list;
      this.loading = false;
    },
    async getProductTree() {
      let { data } = await linkApi.getProductCategory();
      this.defaultExpandedKeys = this._handleRecursive(data.treeArray, []);
      this.treeArray = data.treeArray;
    },
    _handleSelectPage(i) {
      this.$emit("handleChangeUrl", {
        url: this.productList[i].url,
        title: this.productList[i].name,
        cType: "product",
        pageIndex: this.pageIndex
      });
    },
    _handleSearch(val) {
      this.timer = setTimeout(() => {
        this.productList = [];
        this.productTitle = val;
        this.getProductList(this.nodeIdArr);
      }, 500);
    },
    _handleChangeCurrent(val) {
      this.model["PageIndex"] = val;
      this.pageIndex = val;
      this.getProductList(this.nodeIdArr);
    },
    _handleChageLinkTarget(val) {
      this.$emit("handleChangeTarget", val);
    }
  },
  watch: {
    productList() {
      if (!this.productList.length && this.productTitle !== "") {
        this.search = true;
      }
      if (!this.productList.length && this.productTitle == "") {
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
      color: #00c1de;
      font-size: 14px;
      line-height: 17px;
    }
  }
  .popup-content__add /deep/ .el-button--small {
    width: 120px;
    height: 32px;
    background: rgba(0, 193, 222, 1);
    border-radius: 2px;
    border-color: rgba(0, 193, 222, 1);
    span,
    i {
      color: #fff;
    }
  }
  .popup-content__main {
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    width: 563px;
    height: 297px;
    text-align: right;
    border: 1px solid rgba(238, 238, 238, 1);
    .content-main__slider {
      padding: 16px 8px;
      width: 128px;
      height: 294px;
      overflow-y: auto;
      border-right: 1px solid #eee;
    }
    .content-main__list {
      width: 434px;
      height: 297px;
      .content-main__search {
        display: flex;
        align-items: flex-end;
        margin-left: 8px;
        width: 415px;
        height: 36px;
        border-bottom: 1px solid #e5e5e5;
      }
      .content-main__search /deep/ .el-icon-search {
        color: #b5b5b5;
      }
      .content-main__search /deep/ .el-input__inner {
        border: none !important;
        height: 28px;
        line-height: 28px;
        text-align: left;
      }
      .content-main__list--outer {
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
              font-size: 14px;
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
                background: url("~@static/images/link/selected.png") no-repeat
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
  .popup-content__main /deep/ .btn-prev,
  .popup-content__main /deep/ .btn-next,
  .popup-content__main /deep/ .el-pager li {
    background: #fff;
    border: 1px solid rgba(229, 229, 229, 1);
  }
  .popup-content__main /deep/ .el-pager li:not(.disabled).active {
    background: #01c0de;
  }
  .popup-content__open {
    margin-top: 16px;
    padding: 16px 16px 0;
    width: 590px;
    height: 78px;
    border-top: 1px solid #eee;
    p {
      padding: 0 0 12px;
      font-size: 14px;
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
