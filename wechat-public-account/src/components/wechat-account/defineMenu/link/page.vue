<template>
  <div class="popup-content__area">
    <template v-if="pageList.length">
      <p>请选择所需链接的页面</p>
      <ul class="content-list__area">
        <li
          v-for="(it, i) in pageList"
          :key="i"
          :class="{active: pageId == i }"
          @click.stop="_handleSelectPage(i)"
        >
          <p class="single-line__overflow--hide ellipsis">{{it.title}}</p>
          <p class="date single-line__overflow--hide">
            <!-- <span>{{it.createTime.slice(0, 10)}}</span> -->
            <i
              class="icon iconfont iconduihao"
              :style="{visibility: pageId == i ? 'visible' : 'hidden'}"
            ></i>
          </p>
        </li>
      </ul>
    </template>
    <none-area :tips="tips" v-else />
  </div>
</template>

<script>
import * as linkApi from "@/api/linkApi";
import noneArea from "./none";
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
      pageList: [],
      pageId: null,
      SiteId: this.$store.state.dashboard.siteId,
      tips:
        '暂无页面，请先<span style="color: #00C1DE;cursor: pointer;">添加页面</span>',
      pageListOption: {
        IsDescending: true,
        OrderColumns: 'createtime',
        PageType: 'Content', // 内容页Content 模板页Template 文章详情页NewsDetail 产品详情页 ProductDetail
        PageSize: 50,
        PageIndex: 1,
        Title: null,
        SiteId: this.$store.state.dashboard.siteId
      }
    };
  },
  components: {
    noneArea
  },
  created() {
    this.getContentList();
  },
  methods: {
    async getContentList() {
      let { data } = await linkApi.getContentList(this.pageListOption);
      if(data && data.list.length > 0) {
        this.pageList = data.list;
      }
    },
    _handleSelectPage(i) {
      this.pageId = i;
      this.$emit("handleChangeUrl", {
        url: this.pageList[i].id,
        title: this.pageList[i].title,
        id: this.pageList[i].id,
        cType: "Page"
      });
    },
    _handleChageLinkTarget(val) {
      this.$emit("handleChangeTarget", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content__area {
  width: 590px;
  height: 90%;
  p {
    padding: 20px 12px 13px;
    font-size: 14px;
    line-height: 17px;
    color: $--color-primary;
  }
  .content-list__area {
    padding: 0 6px;
    width: 590px;
    height: 100%;
    overflow-y: auto;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
      height: 26px;
      cursor: pointer;
      p {
        width: 450px;
        padding: 0;
        font-size: 14px;
        line-height: 26px;
        height: 26px;
        color: $--color-text-primary;
      }
      p.date {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 128px;
        span {
          color: $--color-text-primary;
        }
      }
      &:hover {
        background: $--background-color-hover;
      }
    }
    .active {
      background: $--background-color-selected;
      p {
        color: $--color-primary;
        span:first-of-type {
          color: $--color-primary;
        }
      }
      &:hover {
        background: $--background-color-selected;
        p {
          color: $--color-primary;
          span:first-of-type {
            color: $--color-primary;
          }
        }
      }
    }
  }
  .popup-content__open {
    padding: 16px 16px 0;
    width: 590px;
    height: 78px;
    border-top: $--border-base;
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
