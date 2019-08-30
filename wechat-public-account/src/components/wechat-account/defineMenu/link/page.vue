<template>
  <div class="popup-content__area">
    <template v-if="siteIdList.length">
      <p>请选择所需链接的页面</p>
      <div class="page-menu__content clearfix">
        <ul class="page-menu__slider">
          <li
            v-for="(item, index) in siteIdList"
            :key="index"
            class="ellipsis"
            :class="{selected: curSiteIdIndex == index}"
            @click="_handleSelectSiteIdInfo(index)"
          >{{item.siteName}}</li>
        </ul>
        <div class="page-menu__section">
          <div class="page-menu__box" v-if="pageList.length > 0">
            <div class="page-menu__search">
              <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="pageSearchTitle"></el-input>
            </div>
            <ul class="page-menu__area">
              <li
                v-for="(it, i) in pageList"
                :key="i"
                :class="{active: it.url == selectedUrl && curType == 'page'}"
                @click.stop="_handleSelectPage(i)"
              >
                <p class="single-line__overflow--hide ellipsis">{{it.title}}</p>
                <p class="date">
                  <span
                    :style="{visibility: it.url == selectedUrl && curType == 'page' ? 'visible' : 'hidden'}"
                  ></span>
                </p>
              </li>
            </ul>
          </div>
          <none-area :tips="tips" v-else />
        </div>
      </div>
      <div class="footer-pegitation__area">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          @current-change="_handleChangeCurrent"
        ></el-pagination>
        <!-- :current-page="pageIndex" -->
        <!-- :total="total" -->
      </div>
    </template>
    <none-area :tips="tips" v-else />
  </div>
</template>

<script>
import noneArea from "./none";
import { getPageSiteList, getPageData } from "@/api/request/account.js";
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
    }
  },
  data() {
    return {
      pageList: [],
      siteIdList: ["1", "2", "3"],
      curSiteIdIndex: 0,
      pageSearchTitle: "",
      pageSize: 5,
      pageIndex: 1,
      tips:
        '暂无页面，请先<span style="color: #00C1DE;cursor: pointer;">添加页面</span>'
    };
  },
  components: {
    noneArea
  },
  created() {
    this.getSiteList();
  },
  methods: {
    async getSiteList() {
      let { data } = await getPageSiteList();
      this.siteIdList = data;
      this.getPagesList();
    },
    async getPagesList() {
      let params = {
        isDescending: true,
        orderColumns: "createtime",
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        title: this.pageSearchTitle,
        siteId: this.siteIdList[0].id
      };
      let { data } = await getPageData(params);
      this.pageList = data;
    },
    _handleSelectPage(i) {
      this.$emit("handleChangeUrl", {
        url: this.pageList[i].url,
        title: this.pageList[i].title,
        cType: "page"
      });
    },
    _handleSelectSiteIdInfo(i) {
      this.curSiteIdIndex = i;
    },
    // 切换分页
    _handleChangeCurrent() {}
  }
};
</script>

<style lang="scss" scoped>
.popup-content__area {
  width: 100%;
  height: 100%;
  p {
    padding: 24px;
    font-size: 14px;
    line-height: 17px;
    color: #0595e6;
    cursor: auto;
  }
  .page-menu__content {
    margin: 0 24px;
    border: 1px solid #c9d9dc;
    .page-menu__slider {
      float: left;
      width: 88px;
      height: 300px;
      border-right: 1px solid #c9d9dc;
      li {
        padding: 0 8px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
      }
      .selected {
        background: #09cceb;
        color: #fff;
      }
    }
    .page-menu__section {
      float: left;
      width: calc(100% - 88px);
      height: 300px;
      .page-menu__box {
        width: 100%;
        height: 100%;
        .page-menu__search {
          margin: 24px 16px 16px;
          width: 290px;
          height: 40px;
        }
        .page-menu__area {
          float: left;
          width: 100%;
          height: 220px;
          overflow-y: auto;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            p {
              padding: 0;
              font-size: 14px;
              color: #262626;
            }
            p.single-line__overflow--hide {
              width: 260px;
            }
            p.date {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              width: 40px;
              span {
                display: block;
                color: #b5b5b5;
                margin-left: 14px;
                width: 18px;
                height: 18px;
                background: url("~img/account/selected.png") no-repeat center
                  center;
                background-size: 100% 100%;
              }
            }
            &:hover {
              background: #c5f0f8;
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
.page-menu__search /deep/ .el-input__inner {
  border: 1px solid #c9d9dc;
}
</style>
