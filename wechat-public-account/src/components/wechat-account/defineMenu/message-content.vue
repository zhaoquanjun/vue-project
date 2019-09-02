<template>
  <div class="message-content__section">
    <section class="menu-content__area">
      <div class="radio-tabs">
        <el-radio label="picture" v-model="menu_reply_behavior.BehaviorType" @change="_handleChangeBehaviorType">图片</el-radio>
        <el-radio label="words" v-model="menu_reply_behavior.BehaviorType" @change="_handleChangeBehaviorType">文字</el-radio>
        <el-radio label="pricure_words" v-model="menu_reply_behavior.BehaviorType" @change="_handleChangeBehaviorType">图文</el-radio>
      </div>
      <div class="slot-content">
        <div class="slot-item">
          <slot></slot>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    menuData: {
      type: Object
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["menu_reply_behavior"])
  },
  methods: {
    _handleChangeBehaviorType(val) {
      this.$store.commit("SET_MENU_BEHAVIOR_TYPE", val);
    }
  }
};
</script>
<style scoped>
.menu-content__area /deep/ .el-radio-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
</style>
<style lang="scss" scoped>
.message-content__section {
  .menu-content__area {
    margin-left: -24px;
    width: calc(100% + 48px);
    min-height: 364px;
    border-top: 1px solid #c9d9dc;
    .radio-tabs {
      padding: 18px 16px;
      border-bottom: 1px solid #c9d9dc;
    }
    .slot-content {
      height: 364px;
      .slot-item {
        width: 100%;
        height: 364px;
      }
    }
  }
}
</style>