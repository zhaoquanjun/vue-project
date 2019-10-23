<template>
  <div class="menu-order__area">
    <div class="order-content">
      <div class="order-icon"></div>
      <p>请通过拖拽左边菜单栏模块进行排序</p>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
.menu-order__area {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .order-content {
    .order-icon {
      margin: 200px auto 0;
      width: 136px;
      height: 157px;
      background: url('~img/account/define_menu_order.png') no-repeat center center;
      background-size: 100% 100%;
    }
    p {
      margin-top: 6px;
      font-size: 14px;
      font-family: 'PingFangSC';
      font-weight: 400;
      color: rgba(164, 178, 191, 1);
      line-height: 20px;
      text-align: center;
    }
  }
}
</style>