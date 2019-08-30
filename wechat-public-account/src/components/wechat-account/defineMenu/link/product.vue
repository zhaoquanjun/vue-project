<template>
  <div class="popup-content__area">
    <div class="popup-content__add">
      <p>请选择所需链接的产品</p>
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
        <div class="content-main__list--outer" v-show="productList.length">
          <ul class="content-main__list--item">
            <li
              v-for="(it, i) in productList"
              :key="i"
              :class="{active: it.url == selectedUrl && curType == 'product'}"
              @click.stop="_handleSelectPage(i)"
            >
              <p class="single-line__overflow--hide ellipsis">{{it.name}}</p>
              <p class="date">
                <span
                  :style="{visibility: it.url == selectedUrl && curType == 'product' ? 'visible' : 'hidden'}"
                ></span>
              </p>
            </li>
          </ul>
          <none-area v-show="!productList.length" style="height: calc(100% - 72px);">
            <span v-if="!search">
              暂无文章，请先
              <span style="color: #00C1DE;cursor: pointer;" @click="_handleAddProduct">添加文章</span>
            </span>
            <span v-else>暂无搜索数据，请重新输入</span>
          </none-area>
          <!-- <loading v-show="loading" /> -->
        </div>
      </div>
    </div>
    <div class="footer-pegitation__area">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        :current-page="pageIndex"
        @current-change="_handleChangeCurrent"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import noneArea from "./none";
import Loading from "../loading/loading";
import { getProductList, getProductCategory } from "@/api/request/account.js";
export default {
  props: {
    model: {
      type: Object
    },
    selectedUrl: {
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
      pageSize: 6,
      total: 6,
      productTitle: "",
      defaultExpandedKeys: [],
      treeArray: [],
      productList: [],
      pageIndex: 1,
      loading: false,
      search: false,
      target: "createProduct"
    };
  },
  components: {
    noneArea,
    Loading
  },
  computed: {
    pageIndex: {
      get: function() {
        return parseInt(this.model["PageIndex"]);
      },
      set: function() {}
    }
  },
  created() {
    this.getProductList([]);
    this.getProductTree();
  },
  methods: {
    _handleNodeClick(data) {
      let arr = this._handleRecursive(data.children, [data.id]);
      this.getProductList(arr);
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
      let { data } = await getProductList(options);
      this.total = data.totalRecord;
      this.productList = data.list;
      this.loading = false;
    },
    async getProductTree() {
      let { data } = await getProductCategory();
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
      this.productTitle = val;
      this.getProductList();
    },
    _handleChangeCurrent(val) {
      this.model["PageIndex"] = val;
      this.pageIndex = val;
      this.getProductList([]);
    },
    _handleAddProduct() {
      location.href = environment.redirectUrl.createProduct;
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
  .popup-content__add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    p {
      font-size: 14px;
      font-family: "PingFangSC";
      font-weight: 400;
      color: rgba(5, 149, 230, 1);
      line-height: 20px;
    }
  }
  .popup-content__main {
    margin: 0 24px;
    display: flex;
    justify-content: flex-start;
    height: 300px;
    text-align: right;
    border: 1px solid #c9d9dc;
    .content-main__slider {
      width: 156px;
      height: 300px;
      overflow-y: auto;
      border-right: 1px solid #c9d9dc;
    }

    .content-main__list {
      position: relative;
      width: 264px;
      height: 300px;
      .content-main__search {
        display: flex;
        align-items: flex-end;
        margin: 16px;
        width: 224px;
        height: 40px;
      }

      .content-main__list--outer {
        overflow: hidden;
        .content-main__list--item {
          padding: 10px 6px 0;
          height: 214px;
          overflow-y: auto;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 6px;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            p {
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
                background: url("~img/account/selected.png") no-repeat center
                  center;
                background-size: 100% 100%;
              }
            }
            &:hover {
              background: #e5f8fa;
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
          }
        }
      }
    }
  }
  .footer-pegitation__area {
    margin-top: 24px;
    padding: 0 24px;
    text-align: right;
  }
}
</style>

<style scoped>
<style scoped > .popup-content__add /deep/ .el-button--small {
  width: 120px;
  height: 32px;
  background: rgba(0, 193, 222, 1);
  border-radius: 2px;
  border-color: rgba(0, 193, 222, 1);
}
.popup-content__add /deep/ .el-button--small span,
i {
  color: #fff;
}
.content-main__slider /deep/ .is-current > .el-tree-node__content {
  background: #00c1de;
}
.content-main__slider /deep/ .is-current > .el-tree-node__content span {
  color: #fff;
}
.content-main__slider /deep/ .el-tree-node__expand-icon {
  padding-left: 0;
}
.content-main__slider /deep/ .el-tree-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.content-main__search /deep/ .el-icon-search {
  color: #b5b5b5;
}
.content-main__search /deep/ .el-input__inner {
  border: 1px solid #c9d9dc !important;
  height: 40px;
  line-height: 40px;
  text-align: left;
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
</style>
</style>
