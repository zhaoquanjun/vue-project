<template>
  <div class="share-code">
    <div class="code">
      <div class="share-title">
        <span>分享设置</span>
        <i @click="closeShareCode(false)" class="icon iconfont iconguanbi"></i>
      </div>
      <div class="share-body">
        <h6>设置成功</h6>
        <vue-qr 
          :margin='0' 
          :text="shareUrl" 
          colorDark="black"
          colorLight="#fff"
          :dotScale='0.8'
          :size="100"> 
        </vue-qr>
        <p>微信扫一扫分享</p>
        <div class="copy">
          <div class="ellipsis">{{shareUrl}}</div>
          <span v-if="!hasCopy" class="tag-read" :data-clipboard-text="shareUrl" @click="oCopy">复制链接</span>
          <span v-else class="hasCopy">复制成功</span>
        </div>
      </div>
      <div class="btn">
        <button class="cl-button cl-button--primary_notbg" @click="closeShareCode(false)">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr';
import { notify } from "@/utlis/index.js";
import Clipboard from 'clipboard'
export default {
  props: {
    shareId: {
      type:String
    },
    type: {
      type:String
    }
  },
  data() {
    return {
      hasCopy: false, //是否已经复制成功
      hasCode: false, //是否需要生成二维码
      shareUrl: '',
      siteId: this.$store.state.dashboard.siteId,
      promotionUrl: this.$store.state.wxaccount.account_info.promotionUrl
    }
  },
  components: {
    VueQr
  },
  created(){
    this.initCode()
  },
  watch: {
    shareId() {
      this.initCode()
    },
  },
  methods: {
    
    //生成二维码
    initCode(){
      // text：扫描二维码后展示的文字，可以添加跳转的路径
      // margin：二维码周围的边距。默认20 ，可以自行设置
      // bgSrc：加入二维码背景图片
      // logoSrc 在二维码中间插入图片
      // size：二维码尺寸 
      this.shareUrl = this.shareId
    },
    //复制
    oCopy(){
      var clipboard = new Clipboard('.tag-read')  
      clipboard.on('success', e => {  
        console.log("复制成功");//这里你如果引入了elementui的提示就可以用，没有就注释即可
          // 释放内存 
          this.hasCopy = true
          setTimeout(() =>{
            this.hasCopy = false
          }, 1500);
          clipboard.destroy()  
        })  
      clipboard.on('error', e => {  
        // 不支持复制  
        console.log('该浏览器不支持自动复制')  
        // 释放内存  
        clipboard.destroy()  
      })  
    },
    closeShareCode(){
      this.$emit('closeShareCode')
    }
  }
   
    
};
</script>

<style lang="scss" scoped>
.share-code {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background:rgba(38,38,38,0.8);
  text-align: right;
  z-index: 200;
  .code {
    position: relative;
    display: inline-block;
    width: 700px;
    height: 100%;
    box-sizing: border-box;
    min-height: 800px;
    padding: 24px;
    background: white;
     .share-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      box-sizing: border-box;
      border-bottom: $--border-base;
      span {
        font-size:16px;
        font-weight:600;
        color:rgba(38,38,38,1);
        line-height:24px;
      }
      i {
        font-size: 16px;
        line-height: 40px;
        cursor: pointer;
      }
    }
    .share-body {
      text-align: center;
      h6 {
        font-size:$--font-size-small;
        color:rgba(38,38,38,1);
        line-height:20px;
        margin-bottom: 24px;
      }
      p {
        font-size:$--font-size-small;
        font-weight:400;
        color:rgba(38,38,38,1);
        line-height:20px;
        margin: 16px 0;
      }
      .copy {
        margin: 0 auto;
        width: 400px;
        height: 40px;
        div {
          display: inline-block;
          width:276px;
          height:40px;
          padding: 0 10px;
          background:rgba(240,243,248,1);
          border-radius: $--border-radius-base;
          border:$--border-base;
          font-size:$--font-size-small;
          font-weight:400;
          color:rgba(38,38,38,1);
          line-height:40px;
          overflow: hidden;
        }
        span {
          float: right;
          width:90px;
          height:40px;
          background:$--color-primary;
          font-size:12px;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:40px;
          margin-left: 8px;
          text-align: center;
          cursor: pointer;
        }
        .hasCopy {
          background:$--color-success;
        }
      }
    }
    .btn {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 32px;
      border-top: $--border-base;
      text-align: left;
      padding: 24px;
    }
  }
}
</style>