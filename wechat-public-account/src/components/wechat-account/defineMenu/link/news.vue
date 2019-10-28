<template>
  <div class="popup-content__area">
    <div class="popup-content__add">
      <p>请选择所需链接的文章</p>
      <a :href="redirectUrl" target="_blank">
        <el-button type="primary" icon="el-icon-plus" size="small">添加文章</el-button>
      </a>
    </div>
    <div class="popup-content__main">
      <div class="content-main__slider">
        <el-tree
          :data="treeArray"
          ref="tree"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          @node-click="_handleNodeClick"
        ></el-tree>
      </div>
      <div class="content-main__list">
        <div class="content-main__search">
          <el-input
            placeholder="搜索文章标题"
            prefix-icon="el-icon-search"
            size="small"
            v-model="newsTitle"
            @input="_handleSearch"
          ></el-input>
        </div>
        <div class="content-main__list--outer" v-show="newsList.length">
          <ul class="content-main__list--item">
            <li
              v-for="(it, i) in newsList"
              :key="i"
              :class="{active: newId==i}"
              @click.stop="_handleSelectPage(i)"
            >
              <p class="single-line__overflow--hide ellipsis">{{it.title}}</p>
              <p class="date single-line__overflow--hide">
                <!-- <span>{{it.createTimePrt && it.createTimePrt.slice(0, 10)}}</span> -->
                <span
                  :style="{visibility: newId==i ? 'visible' : 'hidden'}"
                ></span>
              </p>
            </li>
          </ul>
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
        <none-area v-show="!newsList.length" :target="target">
          <span v-if="!search">
            暂无文章，请先
            <span style="color: #00C1DE;cursor: pointer;">
              <a :href="redirectUrl" target="_blank" style="color: #00C1DE;">添加文章</a>
            </span>
          </span>
          <span v-else>暂无搜索数据，请重新输入</span>
        </none-area>
        <loading v-show="loading" />
      </div>
    </div>
    <div class="popup-content__open">
      <p>选择文章详情页</p>
      <div class="way-list__box">
        <div>
          <span class="tips" @click="isChangeShow">{{productTips}}
            <i 
              class="icon iconfont iconicon-des-Arrow"
              :class="{iconactive: isShow}"
            ></i>
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
import NoneArea from "./none";
import Loading from "@/components/common/loading.vue";
import { notify } from "@/utlis/index.js";
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
    }
  },
  data() {
    return {
      timer: null,
      pageSize: 10,
      total: 0,
      pageActiveIndex: null,
      siteId: this.$store.state.dashboard.siteId,
      promotionUrl: this.$store.getters.account_info.promotionUrl,
      newsTitle: "",
      isShow: false,
      defaultExpandedKeys: [],
      treeArray: [],
      newsList: [],
      productPageList:[],
      productTips: '全部分类',
      newId: -1,
      urlId: '',
      productHref: '',
      pageIndex: 1,
      nodeId: 0,
      loading: false,
      target: "createArticle",
      search: false,
      slotWords: {
        prev: "暂无文章，请先",
        last: "添加文章"
      },
      redirectUrl: environment.redirectUrl.createArticle,
      pageListOption: {
        IsDescending: true,
        OrderColumns: 'createtime',
        PageType: 'NewsDetail', // 内容页Content 模板页Template 文章详情页NewsDetail 产品详情页 ProductDetail
        PageSize: 50,
        PageIndex: 1,
        Title: null,
        SiteId: this.$store.state.dashboard.siteId
      }
    };
  },
  components: {
    NoneArea,
    Loading
  },
  created() {
    this.getNewsList(this.nodeId);
    this.getCategorytree();
    this.getContentList();
  },
  methods: {
    async getContentList() {
      let { data } = await linkApi.getContentList(this.pageListOption);
      if(data && data.list.length > 0) {
        this.productPageList = data.list;
        this.productTips = data.list[0].title;
        this.pageActiveIndex = 0
      }
    },
    selectPage(ind){
      this.pageActiveIndex = ind;
      this.isShow = false
      this.productTips = this.productPageList[ind].title;
    },
    //改变下啦状态
    isChangeShow(){
      this.isShow = !this.isShow
    },
    _handleNodeClick(data) {
      this.nodeId = data.id;
      this.getNewsList(this.nodeId);
    },
    async getNewsList(id) {
      let options = {
        title: this.newsTitle,
        categoryIdList: id,
        newsOrderColumns: "createtime",
        topStatus: null,
        publishStatus: null,
        pageSize: this.pageSize, //11
        pageIndex: this.pageIndex, //1
        isDescending: true
      };
      this.loading = true;
      let { data } = await linkApi.getArticleList(options);
      this.total = data.totalRecord;
      this.newsList = data.list;
      this.loading = false;
    },
    async getCategorytree() {
      let { data } = await linkApi.getArticleCategory();
      this.defaultExpandedKeys = this._handleRecursive(data, []);
      this.treeArray = data;
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
    _handleSelectPage(i) {
      this.newId = i
      //this.newsTitle = this.newsList[i].title
      this.urlId = this.newsList[i].id
      this.productHref = `http://${this.promotionUrl}/news/${this.productPageList[this.pageActiveIndex].id}/${this.urlId}.html`
      this.$emit("handleChangeUrl", {
        url: this.newsList[i].id,
        title: this.newsList[i].title,
        cType: "News",
        picUrl:this.newsList[i].pictureUrl,
        id: this.productPageList[this.pageActiveIndex].id,
        pageIndex: this.pageIndex
      });
    },
    _handleChageLinkTarget(val) {
      this.$emit("handleChangeTarget", val);
    },
    _handleSearch(val) {
      this.timer = setTimeout(() => {
        this.newsList = [];
        this.newsTitle = val;
        this.getNewsList(this.nodeId);
      }, 500);
    },
    _handleChangeCurrent(val) {
      this.model["PageIndex"] = val;
      this.pageIndex = val
      this.getNewsList(this.nodeId);
    }
  },
  watch: {
    newsList() {
      if (!this.newsList.length && this.newsTitle !== "") {
        this.search = true;
      }
      if (!this.newsList.length && this.newsTitle == "") {
        this.search = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content__area {
  width: 590px;
  height: 92%;
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
      cursor: auto;
    }
  }
  .popup-content__add {
    .el-button--small {
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
  } 
  .popup-content__main {
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    width: 563px;
    min-height: 490px;
    height: 72%;
    text-align: right;
    border: 1px solid rgba(238, 238, 238, 1);
    .content-main__slider {
      padding: 16px 8px;
      width: 180px;
      height: 100%;
      overflow-y: auto;
      border-right: 1px solid #eee;
    }
    .content-main__list {
      position: relative;
      width: 380px;
      height: 100%;
      .content-main__search {
        display: flex;
        align-items: flex-end;
        margin-left: 8px;
        width: 360px;
        height: 36px;
        border-bottom: 1px solid #e5e5e5;
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
        overflow: hidden;
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
              font-size: 14px;
              line-height: 26px;
              height: 26px;
              overflow: hidden;
              color: #262626;
              text-align: left;
            }
            p.date {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              width: 164px;
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
    .btn-prev,.btn-next,.el-pager li {
      background: #fff;
      border: 1px solid rgba(229, 229, 229, 1);
    }
  } 
  .popup-content__main {
    .el-pager li:not(.disabled).active {
      background: #01c0de;
    }
  } 
   .popup-content__open {
    position: relative;
    margin-top: 16px;
    padding: 16px 16px 0;
    width: 590px;
    height: 78px;
    border-top: 1px solid #eee;
    p {
      font-size:14px;
      font-family:"PingFangSC";
      font-weight:400;
      color:rgba(38,38,38,1);
      line-height:20px;
      margin-bottom: 10px;
    }
    .tips {
      display: inline-block;
      width:250px;
      height:32px;
      border-radius:2px;
      border:1px solid rgba(229,229,229,1);
      font-size:14px;
      font-family:"PingFangSC";
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
      font-size:14px;
      font-family:"PingFangSC";
      font-weight:400;
      color:rgba(9,204,235,1);
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
        color:rgba(38,38,38,1);
        height:32px;
        font-size:14px;
        font-family:"PingFangSC";
        font-weight:400;
        line-height:32px;
        padding-left: 10px;
        width: 246px;
        cursor: pointer;
        i {
          display: none;
          float: right;
          color: #09CCEB;
        }
      }
      li:hover {
        background:#F0F3F7;
        i {
          display: inline-block;
        }
      }
    }
  }
}
</style>
