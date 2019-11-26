<template>
  <div class="popup-content__none">
    <div class="content-none__area">
      <div class="none-area__icon">
        <span></span>
        <p>暂无数据</p>
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
        width: 80px;
        height: 76px;
        border-radius: 50%;
        span {
          display: block;
          width: 100%;
          height: 100%;
          background: url('~img/table-empty.png') no-repeat center center;
          background-size: 100% 100%;
        }
        p {
          font-size: 12px;
          margin-top: 18px;
          color: #8c8c8c;
        }
      }
      p {
        margin-top: 24px;
        font-size: $--font-size-small;
        line-height: 17px;
        text-align: center;
      }
    }
  }
</style>
