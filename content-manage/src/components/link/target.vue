<template>
  <div class="popup-content__open">
    <span>页面打开方式</span>
    <div class="way-list__box">
      <el-radio v-model="target"
                label="_self"
                @change="_handleChageLinkTarget('_self')">当前窗口打开</el-radio>
      <el-radio v-model="target"
                label="_blank"
                style="margin-left: 24px;"
                @change="_handleChageLinkTarget('_blank')">新窗口打开</el-radio>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    way: {
      type: String
    }
  },
  computed: {
    target: {
      get: function () {
        return this.way;
      },
      set: function () { }
    }
  },
  methods: {
    _handleChageLinkTarget (val) {
      this.$emit("handleChangeLinkTarget", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content__open {
  margin-right: 16px;
  padding: 16px 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 566px;
  border-top: $--border-base;
  span {
    margin-right: 16px;
    display: inline-block;
    min-width: 100px;
    text-align: right;
    font-size: 14px;
    line-height: 20px;
  }
  .way-list__box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>