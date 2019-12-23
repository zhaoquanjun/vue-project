<template>
  <div class="account-setting__section">
    <div class="account-setting__manage">
      <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
      />
      <h4>账号设置</h4>
      <div class="account-info__area">
        <div class="info-desc__area">
          <div class="account-icon">
            <img v-if="accountInfo.platformAvator" :src="accountInfo.platformAvator" alt />
            <img v-else :src="accountAvator"/>
          </div>
          <div class="account-name-certification">
            <h6>{{accountInfo.platformName}}</h6>
            <p>{{accountInfo.serviceTypeInfo == 2 ? '服务号' : '订阅号'}}</p>
          </div>
        </div>
        <button class="cl-button cl-button--primary" @click="unBind">解除绑定</button>
      </div>
      <div class="account-domain__area">
        <div class="domain-title__area">
          <span>推广域名</span>
          <p>{{accountInfo.promotionUrl}}</p>
        </div>
        <button class="cl-button cl-button--small cl-button--primary" @click="changeShow">修改</button>
      </div>
      <div class="account-explain__area">
        <h5>推广域名说明</h5>
        <p>1、推广域名必须是当前网站下解析成功的域名，如未设置推广域名，微信公众号功能将不可用；</p>
        <p>2、公众号发送图文消息时，将在设置的推广域名下打开页面、文章、产品链接；</p>
        <p>3、微信推广可自定义页面、文章、产品分享到微信时显示的封面、标题及描述；
          <!-- 使用该功能，请在JS接口安全域名中添加推广域名；
          <a>如何设置？</a> -->
        </p>
        <p>4、由于微信接口原因，可能存在解除绑定后，公众号实际并未取消授权，可请前往微信公众平台【公众号设置-授权管理】中取消授权。</p>
      </div>
    </div>
    <div v-if="isShow" class="add-promotion">
      <div class="content">
        <div class="title">
          <span>推广域名</span>
          <i class='icon iconfont iconguanbi' @click="closeDomain"></i>
        </div>
        <div class="tips-top">
          提示：修改推广域名，历史推广数据将被清除
        </div>
        <ul>
          <p>请选择推广域名</p>
          <li 
            v-for="(item,ind) in domainList" 
            :key='ind'
            @click="_setPromotionUrl(ind)"
            :class="{active: (ind == curInder)}"
          >
            {{item.domain}}
            <i v-if="ind == curInder" class="icon iconfont iconduihao"></i>
          </li>
          <div class="tips">
            <p>说明:</p>
            <p>1、请确保选择的推广域名已完成解析且可正常访问；</p>
            <p>2、请在微信公众平台的JS接口安全域名中添加推广域名；</p>
          </div>
        </ul>
        <div class="btn">

          <button class="cl-button cl-button--small cl-button--primary" @click="_hasPromotionUrl">确定</button>
          <button class="cl-button cl-button--small cl-button--primary_notbg" @click="closeDomain">取消</button>
        </div>
      </div>
    </div>
    <!-- <Dialog 
      v-if="isShowDialog" 
      text="6666" 
      @sureDialog="sureDialog"
      @cancelDialog="cancelDialog"
    ></Dialog> -->
  </div>
</template>

<script>
import PageSubNav from "_c/common/WechatTitle";
import ChangeSite from "@/components/common/changeSite";
import Dialog from "@/components/common/Dialog";
import { unBind, getCdnDomainList,setPromotionUrl } from "@/api/request/account.js";
import { mapGetters } from "vuex";
import {getLocal} from '@/libs/local'
import { notify } from "@/utlis/index.js";
export default {
  data() {
    return {
      siteName: "",
      siteId: this.$store.state.dashboard.siteId,
      language: "",
      domainList: [],
      isShow: false,
      curInder: -1,
      isShowDialog: false,
      scrollHeight: 500,
      accountAvator: require("img/account/account_type_icon.png"),
      accountInfo: this.$store.state.wxaccount.account_info
    };
  },
  components: {
    ChangeSite,
    Dialog,
    PageSubNav
  },
  created() {
    let wx_status = this.$store.state.wxaccount.wx_status || getLocal("wx_status")
    if (!wx_status.isCertification) {
        this._getWxIsAuth()
    }
    this._getCdnDomainList();
  },
  methods: {
    test(){
      this.isShowDialog = true
    },
    sureDialog(){
      this.isShowDialog = false
    },
    cancelDialog(){
      this.isShowDialog = false
    },
    //页面初始化获取ID
    getSiteId(siteId) {
      console.log('siteId',siteId)
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      this._getWxIsAuth()
    },
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      // await this.$store.dispatch('_setSiteId')
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.state.wxaccount.wx_status
      this.siteId= this.$store.state.dashboard.siteId
      this.accountInfo = this.$store.state.wxaccount.account_info
      if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
        this.$router.replace({path:'/wechat/wxauther' });
      }
    },
    // 获取当前可选域名列表
    async _getCdnDomainList() {
      this.domainList = [];
      let {data} = await getCdnDomainList(this.siteId)
      if (data && data.length>0) {
        for(let i = 0;i<data.length; i++) {
          if(data[i].cdnDomainResolveStatus == 2) {
            console.log(i,data[i].cdnDomainResolveStatus)
            this.domainList.push(data[i])
          }
        }
      }
      if (this.domainList.length>0) {
        for(let i = 0;i<this.domainList.length; i++) {
          if(this.domainList[i].domain == this.accountInfo.promotionUrl) {
            this.curInder = i
          }
        }
      }
    },
    //修改域名
    changeShow() {
      this.isShow = true
    },
    //关闭弹窗
    closeDomain(){
      this.isShow = false 
    },
    //选中推广域名
    async _setPromotionUrl(ind){
      this.curInder = ind
    },
    //设置推广域名
    async _hasPromotionUrl(){
      if(this.curInder == -1) {
        notify(this,'请先选则要设置的域名', 'error')
      }
      let domain = this.domainList[this.curInder].domain
      if(domain == this.accountInfo.promotionUrl) {
        this.isShow = false
        return
      }
      let data = await setPromotionUrl({siteId: this.siteId,domain:domain})
      if(data && data.status == 200) {
        this.accountInfo.promotionUrl = domain
        this.isShow = false
        notify(this,'修改推广域名成功', 'success')
      } else {
        notify(this,'修改推广域名失败', 'error')
      }
    },
    //解除绑定
    unBind(){
      this.$confirm("提示", {
          title: "提示",
          iconClass: "icon-warning",
          message: '解除绑定后，将不可再使用微信推广，自定义菜单与自动回复功能，同时历史数据将被清除，确定要解绑吗？',
          callback: async action => {
              if (action === "confirm") {
                  this._unBind()
              }
          }
      });
    },
    async _unBind(){
      let {status,data} = await unBind()
      if(status==200 && data.isSuccess) {
        notify(this, "解绑成功", "success");
        setTimeout(() => {
          this.$router.replace({path:'/wechat/wxauther' });
        }, 1000);
      } else {
        notify(this, "解绑失败", "error");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.account-setting__section {
  box-sizing: border-box;
  padding: 0 32px;
  height: 100%;
  .account-setting__manage {
    h4 {
      padding-top: 24px;
      font-size: $--font-size-small;
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 22px;
    }
    .account-info__area {
      margin-top: 16px;
      height: 116px;
      background: #fff;
      padding: 14px 24px;
      border: $--border-base;
      border-radius: $--border-radius-base;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-desc__area {
        display: flex;
        width: 80%;
        justify-content: flex-start;
        align-items: center;
        .account-icon {
          display: inline-block;
          width: 80px;
          height: 80px;
          box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
          border-radius: $--border-radius-base;
          img {
            width: 80px;
            height: 80px;
            border-radius: $--border-radius-base;
          }
        }
        .account-name-certification {
          margin-left: 32px;
          width: 100%;
          h6 {
            display: inline-block;
            width: 300px;
            margin-bottom: 16px;
            font-size: $--font-size-base;
            font-weight: 500;
            line-height: 22px;
            color:rgba(38,38,38,1);
          }
          p {
            position: relative;
            border-left: 36px solid #63DC8C;
            width: 82px;
            height: 32px;
            line-height: 32px;
            color:#63DC8C;
            background: rgba(99,220,140,0.2);;
            text-align: center;
            font-weight: 600;
            border-radius: $--border-radius-base;
            &::after {
              position: absolute;
              top: 0px;
              left: -32px;
              display: block;
              content: "";
              width: 32px;
              height: 32px;
              background: url("~img/account/v.png") no-repeat
                center center;
              background-size: 50% 50%;
            }
          }
        }
      }
    }
    .account-domain__area {
      height:32px;
      background:rgba(255,255,255,1);
      border-radius:$--border-radius-base;
      border:$--border-base;
      border-top:none;
      display: flex;
      justify-content: space-between;
      padding: 24px;
      line-height: 14px;
      .cl-button--primary {
        height: 32px;
      }
      .domain-title__area {
        position: relative;
        width: 80%;
        line-height: 32px;
        display: flex;
        justify-content: flex-start;
        font-size:$--font-size-small;
        font-weight:400;
        color: $--color-text-primary;
        p {
          display: inline-block;
          min-width: 240px;
          color: $--color-text-regular;
          line-height: 32px;
          padding: 0 16px;
        }
        ul {
          position: absolute;
          top: 40px;
          left: 76px;
          width: 240px;
          font-size:$--font-size-small;
          line-height: 40px;
          background: #FFFFFF;
          border: $--border-base;
          border-bottom: none;
          color: #a1a8b1;
          li {
            border-bottom: $--border-base;
            padding-left: 10px;
            cursor: pointer;
            &:hover {
              color: rgba(38,38,38,1); 
            }
          }
        }
      }
    }
    .account-explain__area {
      margin-top: 20px;
      padding: 24px;
      background: #fff;
      border: $--border-base;
      border-radius: $--border-radius-base;
      h5 {
        height:20px;
        font-size:$--font-size-small;
        font-weight:400;
        color:rgba(38,38,38,1);
        line-height:20px;
        margin-bottom: 8px;
      }
      p {
        font-size:$--font-size-small;
        font-weight:400;
        color:rgba(161,168,177,1);
        line-height:26px;
        a {
          cursor: pointer;
          color: rgba(0, 193, 222, 1);
        }
      }
    }
  }
  .add-promotion {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 800px;
    background: rgba(0, 0, 0, 0.75);
    z-index: 100;
    .content {
      position: relative;
      float: right;
      width: 500px;
      height: 100%;
      padding: 24px;
      box-sizing: border-box;
      background: #FFFFFF;
      .title {
        font-size:$--font-size-small;
        font-weight:400;
        color:rgba(38,38,38,1);
        line-height:20px;
        padding: 20px 0 12px;
        display: flex;
        justify-content: space-between;
        border-bottom: $--border-base;
        i {
          color: #A1A8B1;
          font-size: 18px;
          cursor: pointer;
        }
      }
      .tips-top {
        height:32px;
        background:rgba(252,242,244,1);
        border-radius:$--border-radius-base;
        border:1px solid rgba(255,143,160,1);
        font-size:$--font-size-small;
        font-weight:400;
        color:rgba(251,77,104,1);
        line-height:32px;
        text-align: center;
        margin-top: 16px;
      }
      ul {
        p {
          font-size:$--font-size-small;
          font-weight:400;
          color:rgba(38,38,38,1);
          line-height:20px;
          margin: 20px 0 14px;
        }
        li {
          height: 32px;
          padding: 0 16px;
          font-size: $--font-size-small;
          font-weight: 400;
          color:$--color-text-primary;
          line-height: 32px;
          border-bottom: $--border-base;
          cursor: pointer;
          i {
            float: right;
          }
        }
        li:nth-child(1) {
          border-top: $--border-base;
        }
        li:hover {
          background: $--background-color-hover;
        }
        .active {
          background: $--background-color-selected !important;
          color: $--color-primary;
          i {
            color: $--color-primary;
          }
        }
        .tips {
          margin-top: 30px;
          p {
            margin: 0;
            font-size:$--font-size-small;
            font-weight:400;
            color:rgba(161,168,177,1);
            line-height:20px;
          }
        }
      }
      .btn {
        position:absolute;
        left: 0px;
        bottom: 0;
        button {
          margin: 0 0 24px 24px; 
        }
      }
    }
    
  }
  .domain-button__area {
      width:90px;
      height:40px;
      background:rgba(9,204,235,1);
      border-radius:$--border-radius-base;
      line-height: 40px;
      font-size:$--font-size-small;
      font-weight:400;
      text-align: center;
      color:rgba(255,255,255,1);
      cursor: pointer;
    }
}
</style>