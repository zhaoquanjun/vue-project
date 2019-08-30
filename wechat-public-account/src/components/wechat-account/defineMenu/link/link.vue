<template>
  <div>
    <ul class="link-section__show">
      <li
        @click.stop="_handleShowPopup"
      >
        <p class="single-line__overflow--hide">
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
      type: Object,
      default: () => {
        return {
          Title: '123',
          Type: 'none',
        }
      }
    }
  },
  data() {
    return {
      popupShow: false
    }
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
  width: 264px;
  height: 40px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
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
