<template>
  <div class="popup-content__area">
    <template v-if="pageList.length">
      <p>请选择所需链接的页面</p>
      <ul class="content-list__area">
        <li
          v-for="(it, i) in pageList"
          :key="i"
          :class="{active: it.pageId == selectedId && slider == 'page'}"
          @click.stop="_handleSelectPage(i)"
        >
          <p class="single-line__overflow--hide">{{ it.title }}</p>
          <p class="date single-line__overflow--hide">
            <span>{{ it.createdTime.slice(0, 10) }}</span>
            <i
              class="iconfont iconduihao"
              :style="{visibility: it.url == selectedId && slider == 'page' ? 'visible' : 'hidden'}"
            ></i>
          </p>
        </li>
      </ul>
      <div class="popup-content__open">
        <p>页面打开方式</p>
        <div class="way-list__box">
          <el-radio
            v-model="way"
            label="_self"
            @change="_handleChageLinkTarget"
          >当前窗口打开</el-radio>
          <el-radio
            v-model="way"
            label="_blank"
            style="margin-left: 24px;"
            @change="_handleChageLinkTarget"
          >新窗口打开</el-radio>
        </div>
      </div>
    </template>
    <none-area
      v-else
      :tips="tips"
    />
  </div>
</template>

<script>
import * as linkApi from '@/api/request/linkApi'
import noneArea from './none'
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
    slider: {
      type: String
    },
    siteId: {
        type: Number
    }
  },
  data() {
    return {
      pageList: [],
      tips:
        '暂无页面，请先<span style="color: #00C1DE;cursor: pointer;">添加页面</span>'
    }
  },
  computed: {
    selectedId: {
      get: function() {
        return this.model['Id']
      },
      set: function() {}
    }
  },
  created() {
    this.getPagesList()
  },
  methods: {
    async getPagesList() {
      const { data } = await linkApi.getPagesList({ siteId: this.siteId })
      this.pageList = data
    },
    _getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg) // search,查询？后面的参数，并匹配正则
      if (r != null) {
        return unescape(r[2])
      } else {
        return null
      }
    },
    _handleSelectPage(i) {
    this.$set(this.model, "Id", this.pageList[i].pageId);
      this.$emit('handleChangeUrl', {
        url: this.pageList[i].url,
        title: this.pageList[i].title,
        cType: 'page',
        id: this.pageList[i].pageId,
        categoryId: null
      })
    },
    _handleChageLinkTarget(val) {
      this.$emit('handleChangeTarget', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.single-line__overflow--hide {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.popup-content__area {
  width: 582px;
  height: 454px;
  border-left: $--border-base;
  p {
    padding: 20px 24px 13px;
    font-size: 14px;
    line-height: 17px;
    cursor: auto;
  }
  .content-list__area {
    padding: 0 24px;
    width: 582px;
    height: 408px;
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
  .popup-content__open {
    margin-right: 16px;
    padding: 16px 0 24px 24px;
    width: 566px;
    border-top: $--border-base;
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
