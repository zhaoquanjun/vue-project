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
          <span class="title single-line__overflow--hide">{{ title }}</span>
        </p>
        <i class="iconfont iconicon-des-lj icon-link"></i>
      </li>
    </ul>
    <popup
      v-if="popupShow"
      :model="model"
      :action-key="actionKey"
      @onDataChange="onDataChange"
      @handleClosePopup="handleClosePopup"
    />
  </div>
</template>

<script>
import Popup from './popup'
export default {
  components: {
    Popup
  },
  props: {
    model: {
      type: Object
    },
    actionKey: {
      type: String
    }
  },
  data() {
    return {
      linkList: [
        {
          icon: 'iconicon-Prohibit',
          name: '设置链接',
          type: 'none'
        },
        {
          icon: 'iconicon-Page',
          name: '页面名称',
          type: 'page'
        },
        {
          icon: 'iconicon-des-wenzhang',
          name: '文章名称',
          type: 'news'
        },
        {
          icon: 'iconicon-product',
          name: '产品名称',
          type: 'product'
        },
        {
          icon: 'iconicon-des-lj',
          name: '链接地址',
          type: 'link'
        },
        {
          icon: 'iconicon-email',
          name: '邮箱地址',
          type: 'email'
        },
        {
          icon: 'iconicon-file',
          name: '文件名称',
          type: 'file'
        },
        {
          icon: 'iconicon-des-Telephone',
          name: '电话',
          type: 'tel'
        },
        {
          icon: 'iconicon-Popup',
          name: '弹窗名称',
          type: 'popup'
        }
      ],
      popupShow: false
    }
  },
  computed: {
    title: {
      get: function() {
        return this.model['Title']
      },
      set: function() {}
    },
    type: {
      get: function() {
        return this.model['Ctype']
      },
      set: function() {}
    }
  },
  methods: {
    _changeTitle(value) {
      this.model['Title'] = value
    },
    _handleShowPopup() {
      this.popupShow = true
    },
    handleClosePopup(val) {
      this.popupShow = val
      return false
    },
    onDataChange(data) {
      this.$emit('onChangeModelData', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.link-section__show {
  padding: 0 8px;
  width: 219px;
  height: 40px;
  background: $--color-white;
  border-radius: 4px;
  border: $--border-base;
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
        color: $--color-text-primary;
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
    i.icon-link {
      font-size: 16px;
      color: $--color-text-orange;
      transform: rotate(45deg);
    }
  }
}
</style>
