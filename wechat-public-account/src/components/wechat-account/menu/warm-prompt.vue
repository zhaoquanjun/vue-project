<template>
  <div class="tips">{{desc}}</div>
</template>

<script>
export default {
  props: {
    desc: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  padding: 7px 11px 8px;
  font-size: 12px;
  font-family: "PingFangSC";
  font-weight: 500;
  color: rgba(254, 152, 55, 1);
  line-height: 17px;
  background: rgba(255, 248, 242, 1);
  border-radius: $--border-radius-base;
  border: 1px solid rgba(250, 223, 197, 1);
}
</style>