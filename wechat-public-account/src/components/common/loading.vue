<template>
  <div class="loading-section">
    <div class="loading-content__area">
      <div class="loading-icon__area"></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {}
  }
}
</script>

<style lang="scss" scoped>
.loading-section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  .loading-content__area {
    .loading-icon__area {
      width: 50px;
      height: 52px;
      background: url('~img/loading.gif') no-repeat center center;
      background-size: 100% 100%;
    }
    p {
      padding-top: 16px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>

