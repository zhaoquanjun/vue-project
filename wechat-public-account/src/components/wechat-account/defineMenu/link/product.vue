<template>
  <div class="popup-content__area">
    <div class="popup-content__add">
      <p>请选择所需链接的产品</p>
      <a :href="redirectUrl" target="_blank">
        <button class="cl-button cl-button--primary">
          + 添加产品
        </button>
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
                :class="{active: productId == i }"
                @click.stop="_handleSelectPage(i)"
              >
                <p class="single-line__overflow--hide ellipsis">{{it.name}}</p>
                <p class="date single-line__overflow--hide">
                  <!-- <span>{{it.createTime && it.createTime.slice(0, 10)}}</span> -->
                  <i
                    class="icon iconfont iconduihao"
                    :style="{visibility: productId == i ? 'visible' : 'hidden'}"
                  ></i>
                </p>
              </li>
            </ul>
           <div class="cl-pagination">
              <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="total"
              :pager-count="5"
              :current-page="pageIndex"
              @current-change="_handleChangeCurrent"
              style="margin-top: 12px"
            ></el-pagination>
           </div>
          </div>
          <none-area v-show="!productList.length && !loading" :target="target">
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
      <p>选择产品详情页</p>
      <div class="way-list__box">
        <div>
          <span class="tips" @click="isChangeShow">{{productTips}}
            <i 
              class="icon iconfont iconicon-des-Arrow"
              :class="{iconactive: isShow}"
            >
            </i>
          </span>
          <a
            v-if="productHref"
            :href="productHref"
            target="_blank"
          >预览</a>
        </div>
        <ul v-if="isShow" class="product-page-list">
          <li 
            v-for="(item,index) in productPageList" 
            :key="index"
            :class="{active: pageActiveIndex == index}"
            @click="selectPage(index)"
          >
            {{item.title}}
            <i class="icon iconfont iconduihao"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as linkApi from "@/api/linkApi";
import environment from "@/environment/index";
import noneArea from "./none";
import Loading from "@/components/common/loading.vue";
import { trim, notify } from "@/utlis/index.js";
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
      siteId: this.$store.state.dashboard.siteId,
      promotionUrl: this.$store.getters.account_info.promotionUrl,
      pageSize: 10,
      total: 0,
      pageIndex: 1,
      productHref: '',
      productTitle: "",
      defaultExpandedKeys: [],
      treeArray: [],
      productList: [],
      pageId: '',
      urlId: '',
      isShow: false,
      pageUrl: '',
      pageTitle: '',
      productTips: '全部分类',
      pageActiveIndex: 0,
      productPageList: [],
      productId: -1,
      nodeIdArr: [],
      loading: false,
      search: false,
      target: "createProduct",
      redirectUrl: environment.redirectUrl.createProduct,
      pageListOption: {
        IsDescending: true,
        OrderColumns: 'createtime',
        PageType: 'ProductDetail', // 内容页Content 模板页Template 文章详情页NewsDetail 产品详情页 ProductDetail
        PageSize: 50,
        PageIndex: 1,
        Title: null,
        SiteId: this.$store.state.dashboard.siteId
      }
    };
  },
  components: {
    noneArea,
    Loading
  },
  created() {
    this.getProductList(this.nodeIdArr);
    this.getProductTree();
    this.getContentList();
  },
  methods: {
    async getContentList() {
      let { data } = await linkApi.getContentList(this.pageListOption);
      if(data && data.list.length > 0) {
        this.productPageList = data.list;
        this.productTips = data.list[0].title;
        this.pageActiveIndex = 0;
      }
    },
    selectPage(ind){
      this.pageActiveIndex = ind
      this.isShow = false
      this.productTips = this.productPageList[ind].title;
    },
     //改变下啦状态
    isChangeShow(){
      this.isShow = !this.isShow
    },
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
      this.productId = i
      //this.productTitle = this.productList[i].name
      this.urlId = this.productList[i].id
      this.productHref = `http://${this.promotionUrl}/product/${this.productPageList[this.pageActiveIndex].id}/${this.urlId}.html`
        this.$emit("handleChangeUrl", {
          url: this.productList[i].id,
          title: this.productList[i].name,
          cType: "Product",
          picUrl: this.productList[i].thumbnailPicUrlList.length>0?this.productList[i].thumbnailPicUrlList[0]:'',
          id: this.productPageList[this.pageActiveIndex].id,
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
  height: 100%;
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
    height: 72%;
    min-height: 490px;
    text-align: right;
    border: $--border-base;
    .content-main__slider {
      padding: 16px 8px;
      width: 180px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: auto;
      border-right: $--border-base;
    }
    .content-main__list {
      width: 380px;
      height: 100%;
      .content-main__search {
        display: flex;
        align-items: flex-end;
        margin-left: 8px;
        width: 360px;
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
      .content-main__list--outer {
        position: relative;
        overflow: hidden;
        height: 100%;
        .content-main__list--item {
          padding: 10px 6px 0;
          width: 380px;
          height: 320px;
          overflow-y: auto;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            padding: 0 8px;
            height: 26px;
            cursor: pointer;
            overflow:hidden;
            p {
              width: 300px;
              padding: 0;
              font-size: $--font-size-small;
              line-height: 26px;
              height: 26px;
              color: $--color-text-primary;
              text-align: left;
            }
            p.date {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              width: 164px;
              span {
                color: $--color-text-primary;
              }
            }
            &:hover {
              background: $--background-color-hover;
            }
          }
          .active {
            background: $--background-color-selected !important;
            p {
              color: $--color-primary !important;
              i {
                color: $--color-primary !important;
              }
            }
          }
        }
      }
    }
  }
  .popup-content__main {
    .btn-prev, .btn-next,.el-pager li {
      background: #fff;
      border: $--border-base;
    }
  }
  .popup-content__open {
    position: relative;
    margin-top: 16px;
    padding: 16px 16px 0;
    width: 590px;
    height: 78px;
    border-top: $--border-base;
    p {
      font-size:$--font-size-small;
      font-weight:400;
      color:rgba(38,38,38,1);
      line-height:20px;
      margin-bottom: 10px;
    }
    .tips {
      display: inline-block;
      width:250px;
      height:32px;
      border-radius:$--border-radius-base;
      border:1px solid rgba(229,229,229,1);
      font-size:$--font-size-small;
      font-weight:400;
      line-height:32px;
      padding: 0 10px;
      cursor: pointer;
      i {
        float: right;
        font-size: 12px;
        font-weight:700;
        transform:rotate(90deg);
        cursor: pointer;
      }
      .iconactive {
        transform:rotate(270deg);
      }
    }
    a {
      font-size:$--font-size-small;
      font-weight:400;
      color:$--color-primary;
      margin-left: 10px;
    }
    .product-page-list {
      position: absolute;
      top: 86px;
      left: 20px;
      width:260px;
      height: 64px;
      overflow: hidden;
      overflow-y: auto;
      li {
        display: inline-block;
        margin-right: 0;
        color:$--color-text-primary;
        height:32px;
        font-size:$--font-size-small;
        font-weight:400;
        line-height:32px;
        padding-left: 10px;
        width: 246px;
        cursor: pointer;
        i {
          display: none;
          float: right;
        }
      }
      li:hover {
        background: $--background-color-hover;
      }
      .active {
        background: $--background-color-selected !important;
        color: $--color-primary !important;
        i {
          display: inline-block !important;
          color: $--color-primary !important;
        }
      }
    }
  }
}
</style>
