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
            <h5>{{initData.shareTitle}}</h5>
            <p>{{initData.description}}</p>
            <img :src="initData.coverUrl" alt="">
            <img class="img-arr" src="~img/head-icon.png" alt="">
          </div>
        </div>
      </div>
      <div class="body">
        <div class="body-title">
          <span>标题</span>
        </div>
        <input type="text" placeholder="产品资讯" v-model="initData.shareTitle">
        <div class="body-conter">
          <div class="left">
            <div><span>封面</span><i class="icon iconfont iconicon-exclamationmark"></i></div>
            <div class="mask">
              <img :src="initData.coverUrl" alt="">
              <span @click="handlerUpload">设置封面</span>
            </div>
          </div>
          <div class="right">
            <h6>描述</h6>
            <el-input
              class="textarea"
              type="textarea"
              rows="5"
              v-model="initData.description"
              placeholder="非必填，不超过120个字符，该摘要只在发送图文消息为单条时显示"
              maxlength="120"
              show-word-limit
              resize="none"
            ></el-input>
          </div>
        </div>
        <div class="code">
          <div class="page">
            <span class="title">文章详情页</span>
            <div class="select">
              <span>{{pageInfoTitle}}</span>
              <i class="icon iconfont iconguanbi" @click="changePageList"></i>
              <ul v-if="isPageList">
                <li v-for="(item,index) in pageList" :key='index' @click="changePageList(item)">
                  {{item.title}}
                </li>
              </ul>
            </div>
          </div>
          <h6>分享地址 <span v-if="!hasCode">保存后生成二维码</span></h6>
          <div v-if="hasCode">
            <img src="http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/nELZAKssX063m0lC_qj_rw.png" alt="">
            <span v-if="!hasCopy" class="tag-read" :data-clipboard-text="'tableData11'" @click="oCopy">复制链接</span>
            <span v-else class="hasCopy">复制成功</span>
            <div>http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6</div>
            <p>微信扫一扫分享</p>
          </div>
        </div>
      </div>
      <div class="btn">
        <span @click="closeShare(true)">确定</span>
        <span @click="closeShare(false)">取消</span>
      </div>
    </div>
    <image-manage
      :imageChooseAreaShowFlag="imageChooseAreaShowFlag"
      @getImage="getImage"
      @handleCloseModal="handleCloseModal"
    ></image-manage>
  </div>
</template>

<script>
import ImageManage from "_c/wechat-account/uploadChooseImage/selectUpload";
import { stringify } from 'querystring';
import { notify } from "@/utlis/index.js";
import { getPageInfoList } from "@/api/request/account.js";
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
      imageChooseAreaShowFlag: false, //图片控件
      initData: this.infoData
    }
  },
  components: {
    ImageManage
  },
  created(){
    this.getPageInfoList()
  },
  methods: {
    //初始化获取列表数据
    async getPageInfoList(){
      let {data} = await getPageInfoList(this.siteId,'Content')
      if(data.length>0) {
        this.pageList = data
        console.log(this.pageList,'000000')
      }
      console.log('list22',data)
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
    //切换图片
    async getImage(src) {
      this.initData.coverUrl = src;
      //this.$emit("handlerPic",this.picUrl)
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
      this.imageChooseAreaShowFlag=true
    },
    testData(){
      let flag = true
      if(this.infoData.entityType) {
        console.log('00000分享类型')
        flag = false
      }
      if(this.infoData.entityId) {
        console.log('00000id')
        flag = false
      }
      if(this.infoData.coverUrl) {
        console.log('00000封面图片')
        flag = false
      }
      if(this.infoData.shareTitle) {
        console.log('00分享title')
        flag = false
      }
      if(this.infoData.description) {
        console.log('00描述')
        flag = false
      }
      if(this.infoData.pageInfoId) {
        console.log('详情页id')
        flag = false
      }
      return flag 
    },
    closeShare(val){
        //1校验
        let flag = this.testData()
        if (!flag) {
          notify(this, '请完善信息', 'error')
        }
        //生成二维码和分享URL
        // http://+推广域名+product/news/page+详情页ID+推广实体ID+.html
        //let url = `http://${this.promotionUrl}page${}`

      this.$emit('closeShare',val)
    }
  }
};
</script>

<style lang="scss" scoped>
.share {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background:rgba(38,38,38,0.8);
  text-align: right;
  z-index: 200;
  .conteiner {
    position: relative;
    display: inline-block;
    width: 540px;
    height: 100%;
    min-height: 1000px;
    padding: 24px;
    background: white;
    .share-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      span {
        font-size:16px;
        font-family:'PingFangSC-Medium,PingFangSC';
        font-weight:500;
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
        padding: 24px 0 0 100px;
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
            margin-bottom: 24px;
            height:22px;
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
            font-size:14px;
            font-family:'AlibabaPuHuiTiR';
            color:rgba(136,136,136,1);
            line-height:20px;
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
      .body-title {
        padding: 14px;
        span {
          font-size:16px;
          font-family:'PingFangSC-Medium,PingFangSC';
          font-weight:500;
          color:rgba(38,38,38,1);
          line-height:22px;
        }
      }
      input {
        width:493px;
        height:40px;
        padding-left: 16px;
        border-radius:2px;
        border:1px solid rgba(229,229,229,1);
        font-size:14px;
        font-family: "PingFangSC-Regular,PingFangSC";
        font-weight:400;
        color:rgba(38,38,38,1);
        line-height:40px;
      }
      .body-conter {
        display: flex;
        justify-content: space-around;
        .left {
          span {
            display: inline-block;
            font-size:16px;
            font-family:'PingFangSC-Medium,PingFangSC';
            font-weight:500;
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
            width: 100px;
            height: 100px;
            img {
              width: 100px;
              height: 100px;
            }
            span {
              position: absolute;
              bottom: 0;
              left: 0;
              display: inline-block;
              padding: 0;
              width:100px;
              height:34px;
              background:rgba(38,38,38,1);
              opacity:0.7;
              font-size:14px;
              text-align: center;
              font-weight:400;
              color:rgba(255,255,255,1);
              line-height:34px;
            }
          }
        }
        .right {
          width: 350px;
          h6 {
            font-size:16px;
            font-family:'PingFangSC-Medium,PingFangSC';
            font-weight:500;
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
            font-weight: 500;
            color:rgba(38,38,38,1);
            line-height: 40px;
            background: none;
            margin: 0;
          }
          .select {
            position: relative;
            width:400px;
            height:40px;
            border-radius:2px;
            border:1px solid rgba(229,229,229,1);
            padding: 0;
            display: flex;
            justify-content: space-between;
            background: none;
            span {
              font-size:14px;
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
                font-size:14px;
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
          font-weight:500;
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
            border-radius:4px;
            border:1px solid rgba(229,229,229,1);
          }
          span {
            float: right;
            width:90px;
            height:40px;
            margin-left: 8px;
            background:rgba(5,149,230,1);;
            border-radius:2px;
            font-size:14px;
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
            font-size:14px;
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
}
</style>