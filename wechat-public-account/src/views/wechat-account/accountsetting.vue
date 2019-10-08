<template>
  <div class="account-setting__section">
    <div class="account-setting__manage">
      <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
      />
      <h4>公众号管理</h4>
      <div class="account-info__area">
        <div class="info-desc__area">
          <div class="account-icon">
            <img :src="accountInfo.platformAvator" alt />
          </div>
          <div class="account-name-certification">
            <h6>{{accountInfo.platformName}}</h6>
            <p>{{accountInfo.serviceTypeInfo == 2 ? '服务号' : '订阅号'}}</p>
          </div>
        </div>
        <div class="primary-button__nomal" @click="unBind">解除绑定</div>
      </div>
      <div class="account-domain__area">
        <div class="domain-title__area">
          <span>推广域名</span>
          <p>{{accountInfo.promotionUrl}}</p>
        </div>
        <div class="primary-button__nomal domain-button__area" @click="changeShow">&nbsp;&nbsp;修改&nbsp;&nbsp;</div>
      </div>
      <div class="account-explain__area">
        <h5>推广域名说明</h5>
        <p>1、推广域名必须是当前网站下解析成功的域名，如未设置推广域名，微信公众号功能将不可用；</p>
        <p>2、公众号发送图文消息时，将在设置的推广域名下打开页面、文章、产品链接；</p>
        <p>3、微信推广可自定义页面、文章、产品分享到微信时显示的封面、标题及描述；使用该功能，请在JS接口安全域名中添加推广域名；
          <a>如何设置？</a>
        </p>
      </div>
    </div>
    <div v-if="isShow" class="add-promotion">
      <div class="content">
        <div class="title">
          <span>推广域名</span>
          <i @click="closeDomain">x</i>
        </div>
        <ul>
          <p>请选择推广域名</p>
          <li 
            v-for="(item,ind) in domainList" 
            :key='ind'
            @click="_setPromotionUrl(ind)"
            :class="{active: ind == curInder}"
          >
            {{item.domain}}
          </li>
          <div class="tips">
            <p>说明:</p>
            <p>1、请确保选择的推广域名已完成解析且可正常访问；</p>
            <p>2、请在微信公众平台的JS接口安全域名中添加推广域名；</p>
          </div>
        </ul>
        <div class="btn">
          <span @click="_hasPromotionUrl">确定</span>
          <span @click="closeDomain">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageSubNav from "_c/common/WechatTitle";
import ChangeSite from "@/components/common/changeSite";
import { unBind, getCdnDomainList,setPromotionUrl } from "@/api/request/account.js";
import { mapGetters } from "vuex";
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
      scrollHeight: 500,
      accountAvator: require("img/account/account_type_icon.png"),
      accountInfo: {
        platformName: "公众号名称",
        platformAppId:'',
        platformAvator: "",
        promotionUrl: '',
        serviceTypeInfo: ''
      }
    };
  },
  components: {
    ChangeSite,
    PageSubNav
  },
  created() {
    //this._getWxIsAuth();
  },
  methods: {
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
      await this.$store.dispatch('_setSiteId')
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.state.wxaccount.wx_status
      if (!wx_status.isAuth || !wx_status.isCertification || !wx_status.isResolveSuccess) {
        this.$router.replace({path:'/wechataccount/wxauther' });
      }
      this.accountInfo = this.$store.state.wxaccount.account_info
    },
    // 获取当前可选域名列表
    async _getCdnDomainList() {
      let {data} = await getCdnDomainList()
      this.domainList = data
    },
    //修改域名
    changeShow() {
      this._getCdnDomainList();
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
      let data = await setPromotionUrl({siteId: this.siteId,domain:domain})
      if(data && data.status == 200) {
        this.accountInfo.promotionUrl = domain
        this.isShow = false
      } else {
        notify(this,'推广域名设置失败', 'error')
      }
    },
    //解除绑定
    unBind(){
      this.$confirm("提示", {
          title: "提示",
          iconClass: "icon-warning",
          message: '解除绑定后，将不可再使用微信推广，自定义菜单和自动回复功能，同时历史数据将被清除，确定要删除吗？',
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
          this.$router.replace({path:'/wechataccount/wxauther' });
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
  padding: 32px 32px 0;
  height: 100%;
  .account-setting__manage {
    h4 {
      padding-top: 32px;
      font-size: 16px;
      font-family: "PingFangSC";
      font-weight: 500;
      color: rgba(38, 38, 38, 1);
      line-height: 22px;
    }
    .account-info__area {
      margin-top: 13px;
      margin-bottom: 26px;
      height: 100px;
      background: #F8FAFC;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-desc__area {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .account-icon {
          width: 80px;
          height: 80px;
          box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }
        .account-name-certification {
          margin-left: 32px;
          h6 {
            margin-bottom: 16px;
            font-size: 16px;
            font-family: "PingFangSC";
            font-weight: 500;
            line-height: 22px;width:134px;
            color:rgba(38,38,38,1);
          }
          p {
            position: relative;
            padding-left: 36px;
            width: 90px;
            height: 32px;
            line-height: 32px;
            color:#FFFFFF;
            background: linear-gradient(
              270deg,
              #63DC8C 0%,
              #3ECD6E 100%
            );
            box-shadow: 0px 5px 8px 0px rgba(9, 204, 235, 0.1);
            border-radius: 4px;
            &::after {
              position: absolute;
              top: 8px;
              left: 8px;
              display: block;
              content: "";
              width: 16px;
              height: 16px;
              background: url("~img/account/account_type_icon.png") no-repeat
                center center;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .account-domain__area {
      height:100px;
      background:rgba(255,255,255,1);
      border-radius:2px;
      border:1px solid rgba(229,229,229,1);
      display: flex;
      justify-content: space-between;
      padding: 30px;
      line-height: 14px;
      .domain-title__area {
        position: relative;
        width: 80%;
        line-height: 40px;
        display: flex;
        justify-content: flex-start;
        font-size:14px;
        font-family:"PingFangSC";
        font-weight:400;
        color:rgba(38,38,38,1); 
        p {
          display: inline-block;
          min-width: 240px;
          margin-left: 20px;
          border-radius:2px;
          border:1px solid rgba(229,229,229,1);
          padding: 0 10px;
        }
        ul {
          position: absolute;
          top: 40px;
          left: 76px;
          width: 240px;
          font-size:14px;
          line-height: 40px;
          background: #FFFFFF;
          border: 1px solid rgba(229,229,229,1);
          border-bottom: none;
          color: #a1a8b1;
          li {
            border-bottom: 1px solid rgba(229,229,229,1);
            padding-left: 10px;
            cursor: pointer;
            &:hover {
              color: rgba(38,38,38,1); 
            }
          }
        }
      }
      .domain-button__area {
        height: 34px;
      }
    }
    .account-explain__area {
      margin-top: 20px;
      h5 {
        height:20px;
        font-size:14px;
        font-family:"PingFangSC";
        font-weight:400;
        color:rgba(38,38,38,1);
        line-height:20px;
        margin-bottom: 8px;
      }
      p {
        font-size:14px;
        font-family:"PingFangSC";
        font-weight:400;
        color:rgba(161,168,177,1);
        line-height:26px;
      }
    }
  }
  .add-promotion {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 100;
    .content {
      position: relative;
      float: right;
      width: 500px;
      height: 100%;
      padding: 24px;
      background: #FFFFFF;
      .title {
        font-size:14px;
        font-family:"PingFangSC-Regular,PingFangSC";
        font-weight:400;
        color:rgba(38,38,38,1);
        line-height:20px;
        padding: 20px 0 12px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #E5E5E5;
        i {
          color: #A1A8B1;
          font-size: 26px;
          margin-top: -3px;
          cursor: pointer;
        }
      }
      ul {
        p {
          font-size:14px;
          font-family:"PingFangSC-Regular,PingFangSC";
          font-weight:400;
          color:rgba(38,38,38,1);
          line-height:20px;
          margin: 20px 0 14px;
        }
        li {
          height: 60px;
          padding-left: 15px;
          font-size:14px;
          font-family:'PingFangSC-Regular,PingFangSC';
          font-weight:400;
          color:rgba(38,38,38,1);
          line-height:60px;
          border-bottom: 1px solid #E5E5E5;
          cursor: pointer;
        }
        li:nth-child(1) {
          border-top: 1px solid #E5E5E5;
        }
        li:hover {
          background: #F8FAFC;
        }
        .active {
          background: #F0F3F7 !important;
          color: #09CCEB;
        }
        .tips {
          margin-top: 30px;
          p {
            margin: 0;
            font-size:14px;
            font-family:"PingFangSC-Regular,PingFangSC";
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
        span {
          display: inline-block;
          width:76px;
          height:40px;
          line-height: 40px;
          text-align: center;
          margin: 0 16px 24px 24px;
          background:rgba(9,204,235,1);
          color: #FFFFFF;
          border-radius:2px;
          cursor: pointer;
        }
        span:nth-child(2) {
          color: rgba(9,204,235,1);
          background: white;
          border: 1px solid rgba(9,204,235,1);
          margin: 0;

        }
      }
    }
  }
}
</style>