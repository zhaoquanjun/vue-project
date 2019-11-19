<template>
  <div class="share">
    <div class="conteiner">
      <div class="share-title">
        <span>分享设置</span>
        <i @click="closeShare(false)" class="icon iconfont iconguanbi"></i>
      </div>
      <div class="shaper">
        <div class="shaper-content">
          <div class="left">
            <div class="arr"></div>
            <h5 class="ellipsis">{{initData.shareTitle}}</h5>
            <p class="ow-h3">{{initData.description}}</p>
            <img :src="initData.coverUrl" alt="">
            <img class="img-arr" src="~img/head-icon.png" alt="">
          </div>
        </div>
      </div>
      <div class="body">
        <div class="body-conter">
          <div class="right">
            <div class="body-title">
              <span>标题</span>
            </div>
            <input 
              class="ellipsis" 
              type="text"
              maxlength="64"
              :placeholder="placeholderText" 
              v-model="initData.shareTitle">
            <h6>描述</h6>
            <el-input
              class="textarea"
              type="textarea"
              rows="3"
              v-model="initData.description"
              placeholder="未填写则默认为分享地址"
              maxlength="120"
              show-word-limit
              resize="none"
            ></el-input>
          </div>
          <div class="left">
            <div>
              <span>封面</span>
              <el-tooltip class="item" effect="dark" placement="bottom">
                <div slot="content">为保证分享效果，建议您上传尺寸为<br/>300*300像素，或者比例为1:1的图片</div>
                <i class="icon iconfont iconicon-exclamationmark"></i>
              </el-tooltip>
            </div>
            <div class="mask">
              <img :src="initData.coverUrl" alt="">
              <span @click="handlerUpload">{{shareUrl ? '更换封面':'设置封面'}}</span>
            </div>
          </div>
        </div>
        <div v-if="shareUrl" class="share-url">
          <div class="left">
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
          </div>
          <div class="copy">
            <div class="ellipsis">{{shareUrl}}</div>
            <span v-if="!hasCopy" class="tag-read" :data-clipboard-text="shareUrl" @click="oCopy">复制链接</span>
            <span v-else class="hasCopy">复制成功</span>
          </div>
        </div>
      </div>
      <div class="btn">
        <span @click="closeShare(true)">保存</span>
        <span @click="closeShare(false)">取消</span>
      </div>
    </div>
    <image-manage
      v-if="imageChooseAreaShowFlag"
      @getImage="getImage"
      @handleCloseModal="handleCloseModal"
    ></image-manage>
  </div>
</template>

<script>
import ImageManage from "_c/wechat-account/uploadChooseImage/selectUpload";
import { stringify } from 'querystring';
import VueQr from 'vue-qr';
import { notify } from "@/utlis/index.js";
import { getPageInfoList, addShare, updataShare } from "@/api/request/account.js";
import Clipboard from 'clipboard'
export default {
  props: {
    type: {
      type:String,
      default: '0'
    },
    infoData: {
      type: [String,Object],//0新增，1修改
      default:function(){
        return {
          entityType: "Page", //分享类型 文章 产品 页面
          entityId: "id", //id
          coverUrl: require('img/cover.jpg'), //封面图片
          shareTitle: "分享title", //分享id
          pageTitle: "页面", //页面，文章，产品标题
          description: "描述", //描述
          pageInfoId: "详情页id" // 详情页id，页面推广时不选
        }
      }
    }
  },
  data() {
    return {
      hasCopy: false, //是否已经复制成功
      hasCode: false, //是否需要生成二维码
      siteId: this.$store.state.dashboard.siteId,
      promotionUrl: this.$store.state.wxaccount.account_info.promotionUrl,
      pageList: [], //page列表
      isPageList: false,
      pageInfoTitle: '', //详情页title
      placeholderText: '未填写则默认为文章标题',
      imageChooseAreaShowFlag: false, //图片控件
      shareUrl: this.infoData.shareUrl,
      initData: this.infoData
    }
  },
  components: {
    ImageManage,
    VueQr
  },
  created(){
    this.getPageInfoList()
  },
  methods: {
    //初始化获取列表数据
    async getPageInfoList(){
      switch (this.infoData.entityType) {
        case 'Page':
          this.placeholderText = '未填写则默认为页面标题'
          break;
        case 'News':
          this.placeholderText = '未填写则默认为文章标题'
          break;
        case 'Product':
          this.placeholderText = '未填写则默认为产品标题'
          break;
      }
      let {data} = await getPageInfoList(this.siteId,'Content')
      if(data.length>0) {
        this.pageList = data
      }
    },
    //切换图片
    async getImage(src) {
      this.initData.coverUrl = src;
      this.imageChooseAreaShowFlag = false;
    },
    //选则文章详情页
    changePageList(val){
      this.isPageList = !this.isPageList
      if(val) {
        this.pageInfoTitle = val.title;
        this.initData.pageInfoId = val.id;
      }
    },
    handleCloseModal() {
      this.imageChooseAreaShowFlag = false;
    },
    handlerUpload(){
      this.imageChooseAreaShowFlag= true
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
    testData(){
      let flag = true
      if(!this.infoData.entityType) {
        notify(this, '请完善信息', 'error')
        flag = false
        return
      }
      if(!this.infoData.entityId) {
        notify(this, '请完善信息', 'error')
        flag = false
        return
      }
      if(!this.infoData.coverUrl) {
        notify(this, '请设置分享封面', 'error')
        flag = false
        return
      }
      if(!this.infoData.shareTitle) {
        notify(this, '请设置分享标题', 'error')
        flag = false
        return
      }
      // if(!this.infoData.description) {
      //   console.log('00描述')
      //   flag = false
      // }
      return flag 
    },
    async closeShare(val){
      console.log(this.infoData,'.entityType')
        //1校验
        if (!val) {
          this.$emit('closeShare',false)
          return
        }
        let flag = this.testData()
        if (!flag) {
          return
        }
        if (this.infoData.id) {
          //修改 
          let options = {
            entityType: this.infoData.entityType, //分享类型 文章 产品 页面
            entityId: this.infoData.entityId, //id
            coverUrl: this.infoData.coverUrl, //封面图片
            shareTitle: this.infoData.shareTitle, //分享id
            pageTitle: this.infoData.pageTitle, //页面，文章，产品标题
            description: this.infoData.description, //描述
            pageInfoId: this.infoData.pageInfoId // 详情页id，页面推广时不选
          }
          let data = await updataShare(this.siteId,this.initData.id,options)
          if (data && data.status == 200) {
            this.$emit('closeShare',false)
          } else {
             notify(this, '新增失败', 'error')
          }
        } else {
          //新增
          let data = await addShare(this.siteId,this.initData)
          if (data && data.status == 200) {
            this.$emit('closeShare',false,data.data,this.infoData.entityType)
          } else {
             notify(this, '新增失败', 'error')
          }
        }
    }
  }
};
</script>
<style scoped>
.el-textarea /deep/ .el-input__count {
  right: 20px;
}
</style>
<style lang="scss" scoped>
.share {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 800px;
  overflow-y: auto;
  background:rgba(38,38,38,0.8);
  text-align: right;
  z-index: 200;
  .conteiner {
    position: relative;
    display: inline-block;
    width: 700px;
    height: 100%;
    padding: 24px;
    background: white;
    .share-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      span {
        font-size:16px;
        font-family:'PingFangSC-Medium,PingFangSC';
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
    .shaper {
      .shaper-content {
        width:100%;
        height: 180px;
        padding: 24px 0 0 160px;
        background:rgba(248,250,252,1);
        .left {
          position: relative;
          width:284px;
          height:130px;
          background:rgba(255,255,255,1);
          box-shadow:0px 2px 4px 0px rgba(236,236,236,1);
          border-radius:6px 6px 6px 2px;
          text-align: left;
          padding: 16px;
          h5 {
            margin-bottom: 20px;
            height:22px;
            width: 100%;
            font-size:16px;
            text-align: left;
            font-family:"AlibabaPuHuiTiR";
            color:rgba(38,38,38,1);
            line-height:22px;
          }
          p {
            float: left;
            width:196px;
            height:60px;
            margin: 0;
            padding-right: 8px;
            font-size:$--font-size-small;
            overflow: hidden;
            font-family:'AlibabaPuHuiTiR';
            color:rgba(136,136,136,1);
            line-height: 20px;
          }
          img {
            float: right;
            width: 54px;
            height: 54px;
          }
          .arr {
            position: absolute;
            top: 15px;
            left: 284px;
            width: 0; 
            height: 0;
            border-width: 10px;
            border-style: solid;
            border-color: transparent transparent transparent #ffffff;
          }
          .img-arr {
            position: absolute;
            top: 0;
            left: 300px;
            width: 50px;
            height: 50px;
          }
        }
      }
    }
    .body {
      text-align: left;
      .body-conter {
        display: flex;
        justify-content: space-between;
        .left {
          width: 160px;
          span {
            display: inline-block;
            font-size:16px;
            font-family:'PingFangSC-Medium,PingFangSC';
            font-weight:600;
            color:rgba(38,38,38,1);
            line-height:22px;
            padding: 12px 0;
          }
          i {
            display: inline-block;
            width: 18px;
            height: 18px;
            color: #e5e5e5;
            border-radius: 50%;
            font-size: 18px;
            line-height: 18px;
            text-align: center;
            margin-left: 10px;
            cursor: pointer;
          }
          .mask {
            position: relative;
            width: 160px;
            height: 160px;
            background: url("~img/cover.jpg") no-repeat center;
            background-size: contain;
            img {
              width: 160px;
              height: 160px;
            }
            span {
              position: absolute;
              bottom: 0;
              left: 0;
              display: inline-block;
              padding: 0;
              width:160px;
              height:34px;
              background:rgba(38,38,38,1);
              opacity:0.7;
              font-size:$--font-size-small;
              text-align: center;
              font-weight:400;
              color:rgba(255,255,255,1);
              line-height:34px;
              cursor: pointer;
            }
          }
        }
        .right {
          width: 450px;
          height: 220px;
          .body-title {
            padding: 14px 0;
            span {
              font-size:16px;
              font-family:'PingFangSC-Medium,PingFangSC';
              font-weight:600;
              color:rgba(38,38,38,1);
              line-height:22px;
            }
          }
          input {
            width:450px;
            height:40px;
            padding-left: 10px;
            border-radius:$--border-radius-base;;
            border:1px solid rgba(229,229,229,1);
            font-size:$--font-size-small;
            font-family: "PingFangSC-Regular,PingFangSC";
            font-weight:400;
            color:rgba(38,38,38,1);
            line-height:40px;
          }
          h6 {
            font-size:16px;
            font-family:'PingFangSC-Medium,PingFangSC';
            font-weight:600;
            color:rgba(38,38,38,1);
            line-height:16px;
            padding: 15px 0;
          }
        }
      }
      .code {
        .page {
          position: relative;
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          .title{
            font-size: 16px;
            font-family:'PingFangSC-Medium,PingFangSC';
            font-weight: 600;
            color:rgba(38,38,38,1);
            line-height: 40px;
            background: none;
            margin: 0;
          }
          .select {
            position: relative;
            width:400px;
            height:40px;
            border-radius:$--border-radius-base;
            border:1px solid rgba(229,229,229,1);
            padding: 0;
            display: flex;
            justify-content: space-between;
            background: none;
            span {
              font-size:$--font-size-small;
              font-family:'PingFangSC-Regular,PingFangSC';
              font-weight:400;
              color:rgba(38,38,38,1);
              line-height:40px;
              width: 350px;
              text-align: left;
              background: none;
            }
            i {
              width: 40px;
              height: 40px;
              font-size: 16px;
              line-height: 40px;
              text-align: center;
              color: red;
            }
            ul {
              position: absolute;
              top:44px;
              right: -1px;
              padding: 6px 0;
              width: 400px;
              background: #ffffff;
              box-shadow:0px 2px 16px 0px rgba(0,0,0,0.2);
              li {
                width: 100%;
                text-align: left;
                height: 32px;
                font-size:$--font-size-small;
                padding-left: 14px;
                font-weight:400;
                color:rgba(38,38,38,1);
                line-height:32px;
                cursor: pointer;
              }
              li:hover {
                background:rgba(240,243,247,1);
              }
            }
          }
        }
        h6 {
          margin: 16px 0;
          font-size:16px;
          font-weight:600;
          color:rgba(38,38,38,1);
          line-height:22px;
          span {
            padding-left: 10px;
            color: rgba(128, 128, 128, 1);
            font-size: 14px;
            font-weight:400;
            text-align: left;
          }
        }
        div {
          img {
            width: 80px;
            height: 80px;
          }
          div {
            float: right;
            padding: 12px 16px;
            width:286px;
            line-height: 22px;
            margin: 0;
            background:rgba(240,243,248,1);
            border-radius: $--border-radius-base;
            border:1px solid rgba(229,229,229,1);
          }
          span {
            float: right;
            width:90px;
            height:40px;
            margin-left: 8px;
            background:rgba(5,149,230,1);;
            border-radius: $--border-radius-base;
            font-size:$--font-size-small;
            font-family:'PingFangSC-Regular,PingFangSC';
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:40px;
            text-align: center;
          }
          .hasCopy {
            background:rgba(99,220,140,1)
          }
          p {
            height:20px;
            font-size:$--font-size-small;
            font-family:'PingFangSC-Regular,PingFangSC';
            font-weight:400;
            color:rgba(38,38,38,1);
            line-height:20px;
            margin-top: 14px;
          }
        }
      }
    }
    .btn {
      position: absolute;
      left: 0;
      bottom: 0;
      border-top: 1px solid #EFEFEF;
      width: 100%;
      height: 80px;
      text-align: left;
      span {
        display: inline-block;
        width:90px;
        height:32px;
        background:rgba(9,204,235,1);
        font-size:12px;
        font-family:'PingFangSC-Regular,PingFangSC';
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:32px;
        margin: 24px;
        text-align: center;
        cursor: pointer;
      }
      span:nth-child(2) {
        background:rgba(255,255,255,1);
        color:rgba(9,204,235,1);
        border: 1px solid rgba(9,204,235,1);
        margin-left: 0px;
      }
    }
  }
  .share-url {
    margin-top: 30px;
    .left {
      float: left;
      width: 100px;
      text-align: center;
      h6 {
        font-size:$--font-size-small;
        font-family:'PingFangSC-Regular,PingFangSC';
        color:rgba(38,38,38,1);
        line-height:20px;
        margin-bottom: 24px;
      }
      p {
        font-size:$--font-size-small;
        font-family:'PingFangSC-Regular,PingFangSC';
        font-weight:400;
        color:rgba(38,38,38,1);
        line-height:20px;
        margin: 16px 0;
      }
    }
    .copy {
      width: 535px;
      padding-top: 70px;
      float: right;
      div {
          display: inline-block;
          width:433px;
          height:40px;
          padding: 0 10px;
          background:rgba(240,243,248,1);
          border-radius:$--border-radius-base;
          border:1px solid rgba(229,229,229,1);
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
          background:rgba(9,204,235,1);
          font-size:12px;
          font-family:'PingFangSC-Regular,PingFangSC';
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:40px;
          margin-left: 8px;
          text-align: center;
          cursor: pointer;
        }
        .hasCopy {
          background:rgba(255,255,255,1);
          color:rgba(9,204,235,1);
          border: 1px solid rgba(9,204,235,1);
        }
    }
  }
}
</style>