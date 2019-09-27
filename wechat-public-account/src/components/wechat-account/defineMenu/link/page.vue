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
          <p class="single-line__overflow--hide">{{it.title}}</p>
          <p class="date single-line__overflow--hide">
            <span>{{it.createdTime.slice(0, 10)}}</span>
            <span
              :style="{visibility: pageId == i ? 'visible' : 'hidden'}"
            ></span>
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
        '暂无页面，请先<span style="color: #00C1DE;cursor: pointer;">添加页面</span>'
    };
  },
  components: {
    noneArea
  },
  created() {
    this.getPagesList();
  },
  methods: {
    async getPagesList() {
      let { data } = await linkApi.getPagesList({ siteId: this.SiteId });
      this.pageList = data;
    },
    _handleSelectPage(i) {
      this.pageId = i;
      this.$emit("handleChangeUrl", {
        url: this.pageList[i].pageId,
        title: this.pageList[i].title,
        id: this.pageList[i].pageId,
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
    color: #00c1de;
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
      margin-bottom: 4px;
      padding: 0 8px;
      height: 26px;
      cursor: pointer;
      p {
        width: 450px;
        padding: 0;
        font-size: 14px;
        color: #262626;
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
          background: url("~img/link/selected.png") no-repeat center
            center;
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
  .popup-content__open {
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
