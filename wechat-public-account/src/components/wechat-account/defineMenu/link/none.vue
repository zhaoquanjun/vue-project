<template>
  <div class="popup-content__none">
    <div class="content-none__area">
      <div class="none-area__icon">
        <span></span>
      </div>
      <p>
        <slot></slot>  
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    target: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .popup-content__none {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: auto;
    .content-none__area {
      .none-area__icon {
        margin: 0 auto;
        width: 61px;
        height: 47px;
        border-radius: 50%;
        span {
          display: block;
          width: 100%;
          height: 100%;
          background: url('~img/link/none_tips.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
      p {
        margin-top: 24px;
        font-size: 14px;
        line-height: 17px;
        text-align: center;
      }
    }
  }
</style>
