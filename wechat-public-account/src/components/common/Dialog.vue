<template>   
    <div class="popup-mask">
      <div class="popup-contant">
        <div class="auther-top">
          <span>提示</span>
          <i class="icon iconfont iconguanbi" @click="cancelDialog"></i>
        </div>
        <div class="auther-body">
          <i class="icon iconfont iconyiwen"></i>
          <span>
              {{textTitle || '确定删除'}}
           
          </span>
          <p >{{text || '确定要删除此分类下的所有内容？'}}</p>
        </div>
        <div class="auther-footer">
          <span @click="cancelDialog">取消</span>
          <span class="sure" @click="sureDialog">确定</span>
        </div>
      </div>
    </div>
</template>
<script>
export default {
    props: ["text"],
    data() {
        return {
        step: 1,
        }
    },
    methods: {
        sureDialog(){
            this.$emit('sureDialog')
        },
        cancelDialog(){
            this.$emit('cancelDialog')
        }
    }
}
</script>
<style lang="scss"  scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;
  .popup-contant {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    background: #ffffff;
    border-radius: $--border-radius-base;
    padding: 32px 24px;
    .auther-top {
      height: 20px;
      display: flex;
      justify-content: space-between;
      span {
        font-size: 16px;
        line-height: 20px;
        font-weight: 500;
        color: #303133;
      }
      i {
        font-size: 18px;
        line-height: 20px;
        font-weight: 500;
        padding-right: 16px;
        color: #909399;
      }
    }
    .auther-body {
      position: relative;
      padding: 32px;
      i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 24px;
        color: #FEB26B;
      }
      p {
        padding: 0 12px 0 32px;
        color: #a1a8b1;
        font-size: $--font-size-small;
        line-height: 20px;
        max-height: 80px;
      }
      span {
        padding: 0 12px 0 32px;
        line-height: 20px;
      }
    }
    .auther-footer {
      height: 45px;
      padding: 5px 16px 0;
      text-align: right;
      span {
        display: inline-block;
        width: 76px;
        height: 30px;
        cursor: pointer;
        background: #ffffff;
        border-radius: $--border-radius-base;
        text-align: center;
        line-height: 30px;
        border: 1px solid $--color-primary;
        margin-left: 24px;
        color: $--color-primary;
      }
      .sure {
        border: 1px solid $--color-primary;
        background: $--color-primary;
        color: #ffffff;
      }
    }
  }
}
</style>