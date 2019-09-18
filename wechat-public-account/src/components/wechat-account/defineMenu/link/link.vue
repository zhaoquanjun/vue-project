<template>
  <div>
    <ul class="link-section__show">
      <li
        v-for="(it, i) in linkList"
        v-if="it.type == type"
        :key="i"
        @click.stop="_handleShowPopup"
      >
        <p class="single-line__overflow--hide">
          <i class="iconfont" :class="it.icon"></i>
          <span class="title single-line__overflow--hide">{{title}}</span>
        </p>
        <i class="iconfont iconlianjietiao"></i>
      </li>
    </ul>
    <popup
      :model="model"
      @handleClosePopup="handleClosePopup"
      v-if="popupShow"
    />
  </div>
</template>

<script>
import Popup from "./popup";
export default {
  props: {
    model: {
      type: Object
    }
  },
  data() {
    return {
      linkList: [
        {
          icon: 'iconshezhilianjie',
          name: "设置链接",
          type: "none"
        },
        {
          icon: 'iconyemian',
          name: "页面名称",
          type: "page"
        },
        {
          icon: 'iconwenzhang',
          name: "文章名称",
          type: "news"
        },
        {
          icon: 'iconchanpin',
          name: "产品名称",
          type: "product"
        },
        {
          icon: 'iconlianjiedizhi',
          name: "链接地址",
          type: "link"
        },
        {
          icon: 'iconyouxiang',
          name: "邮箱地址",
          type: "email"
        },
        {
          icon: 'iconwenjian',
          name: "文件名称",
          type: "file"
        },
        {
          icon: 'icondianhua',
          name: "电话",
          type: "tel"
        },
        {
          icon: 'icondanchuang',
          name: "弹窗名称",
          type: "popup"
        }
      ],
      popupShow: false
    };
  },
  components: {
    Popup
  },
  computed: {
    title: {
      get: function() {
        return this.model['Title'];
      },
      set: function() {}
    },
    type: {
      get: function() {
        return this.model['Type'];
      },
      set: function() {}
    }
  },
  methods: {
    _handleShowPopup() {
      this.popupShow = true;
    },
    handleClosePopup(val) {
      this.popupShow = val;
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.link-section__show {
  padding: 0 8px;
  width: 219px;
  height: 40px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(201, 217, 220, 1);
  cursor: pointer;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    p {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      max-width: 160px;
      i {
        margin-right: 8px;
        font-size: 14px;
        color: #262626;
      }
      .title {
        display: inline-block;
        margin-right: 0;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        width: 150px;
        background: none;
      }
    }
    i {
      font-size: 12px;
      color: #09CCEB;
    }
  }
}
</style>
