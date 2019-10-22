<template>
  <div class="account-setting__section">
    <ChangeSite
        @chooseWebsite="chooseWebsite"
        @getSiteId="getSiteId"
    />
    <div class="account-setting__content" > 
      <!-- 微信认证 -->
      <!-- <account-certification></account-certification> -->
      <div class="account-setting__bind--box">
        <SpeedProgress :steps = 'step' />
        <!-- 第一步绑定工众号 -->
        <div v-if="step == 1" class="account-setting__bind">
          <img :src="wechanIcon" alt />
          <p>请先绑定微信公众号</p>
          <div @click="_handleWxAuth">授权绑定微信公众号</div>
        </div>
        <!-- 第二步绑定域名 -->
        <div v-if="step == 2" class="account-setting__resolve">
          <img :src="wechanSpare" alt />
          <p>设置推广域名，立即开启自定菜单</p>
          <input type='text' v-model="addDomain" v-if="domainList.length <= 0"  placeholder="请输入需添加的域名"/>
          
          <ul v-else>
            <span>{{domainName}}<i @click="showDomainList(false)" class="icon iconfont iconicon-des-lower"></i></span>
            <li 
              v-show="isShowDomainList" 
              v-for="(item,index) in domainList" 
              @click="showDomainList(item)" 
              :key="index"
            >
              {{item.domain}}
            </li>
          </ul>
          <div v-if="isShowTips" class='tips'>
            <p class="ym-form-item__error">{{tipsText}}</p>
            <span @click='goResolve'>去解析</span>
          </div>
          <div class="add" @click='changeResolve'>完成设置</div>
        </div>
        <!-- 第三部完成设置 -->
        <div class='account-setting__complete' v-if='step == 3'>
          <i class='icon iconfont iconduihao'></i>
          <p>配置成功</p>
        </div>
        <div v-if="step == 1" class="account-bind__tips">
          <p>1、请确定您有一个正常使用的微信公众号，且您是公众号管理员；</p>
          <p>2、请确定您授权的微信公众号是认证的服务号或订阅号。</p>
        </div>
        <div v-if="step != 1" class="account-bind__tips account-bind__tips2">
          <p>1、公众号发送图文消息时，将在设置的推广域名下打开页面、文章、产品链接；</p>
          <p>2、推广域名必须是当前网站下解析成功的域名，请先添加并解析域名；</p>
          <p>3、如需解除绑定的微信公众号，请前往微信公众平台【公众号设置-授权管理】中取消授权。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageSubNav from "_c/common/WechatTitle";
import SpeedProgress from "@/components/common/speedProgress";
import ChangeSite from "@/components/common/changeSite";
import { regDomain } from "@/utlis/index.js";
import { notify } from "@/utlis/index.js";
import { wxAuth, getCdnDomainList, bindDomain, setPromotionUrl} from "@/api/request/account.js";
import AccountCertification from '_c/wechat-account/defineMenu/account-wxcertification';

export default {
  data() {
    return {
      step: 1,
      title: "账号设置",
      siteId: this.$store.state.dashboard.siteId,
      isResolveSuccess: this.$store.state.wxaccount.wx_status.isResolveSuccess,
      isAuth: this.$store.state.wxaccount.wx_status.isAuth,
      isCertification: this.$store.state.wxaccount.wx_status.isCertification,
      wechanIcon: require("img/account/wechat_icon.png"),
      wechanSpare: require("img/account/wechat_spare.png"),
      domainList:[],
      isResolve: 2,  //0暂未设置解析,1等待解析生效,2解析成功,3等待服务器生成解析记录值
      domainName: '请输入需添加的域名',
      tipsText: '请输入正确的域名',
      isShowTips: false,
      addDomain: '',
      isShowDomainList: false
    };
  },
  components: {
    ChangeSite,
    SpeedProgress,
    PageSubNav,
    AccountCertification
  },
  created() {
    this._getCdnDomainList();
  },
  methods: {
    getSiteId(siteId) {
      this.siteId = siteId;
      // this.getSiteInfo(siteId);
    },
    async _getInfo(){
      await this.$store.dispatch('_getWxStatus')
    },
    // 获取当前可选域名列表
    async _getCdnDomainList() {
      await this.$store.dispatch('_setSiteId')
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.getters.wx_status;
      if (wx_status.isAuth && wx_status.isCertification && wx_status.isResolveSuccess) {
        this.step = 3
      } else if (wx_status.isAuth && wx_status.isCertification && !wx_status.isResolveSuccess) {
        this.step = 2
      } else {
        this.step = 1
      }
      let {data} = await getCdnDomainList(this.siteId)
      if (data) {
        this.domainList = data
      }
    },
    //去解析
    goResolve(){
      window.open("http://dashboard.console.clouddream.net/website/sitedomain");
    },
    //完成设置
    async changeResolve(){
      if(this.domainList.length <=0) {
        //新增域名
        if (!regDomain.test(this.addDomain)) {
          this.tipsText = '请输入正确格式的域名';
          this.isShowTips = true
          return
        }
        let {data} = await bindDomain(this.siteId,{domain:this.addDomain})
        if(data && data.isSuccess) {
          notify(this,'设置域名成功', 'success')
          this._getCdnDomainList();
        } else if (data && !data.isSuccess) {
          notify(this,data.msg, 'error')
        }
      } else {
        //设置推广域名
        if(!this.domainName) {
          notify(this,'请选择推广域名', 'error')
          return
        } else if (this.isResolve != 2) {
          notify(this,'请先在完成域名解析', 'error')
          return
        }
        let data = await setPromotionUrl({siteId: this.siteId, domain:this.domainName})
        if(data && data.status == 200) {
          this.step = 3
          setTimeout(()=>{
            this.$router.replace({
                name: 'accountsetting'
            })
          },3000); 
        } else {
          notify(this,'推广域名设置失败', 'error')
        }
      }
    },
    //显示域名选择列表
    showDomainList(val){
      this.isShowTips = false
      this.isShowDomainList = !this.isShowDomainList;
      if(val) {
        this.domainName = val.domain
        this.isResolve = val.cdnDomainResolveStatus
        if (val.cdnDomainResolveStatus != 2) {
          this.tipsText = '域名未解析，请先完成域名解析'
          this.isShowTips = true
        }
      }
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      this._getWxIsAuth()
    },
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.state.wxaccount.wx_status
      if (wx_status.isAuth && wx_status.isCertification && wx_status.isResolveSuccess) {
        this.$router.replace({path:'/wechataccount/accountsetting' });
      }
    },
    // 微信授权
    async _handleWxAuth() {
      let data = await wxAuth();
      let oA = document.createElement("a");
      oA.setAttribute("href", data.data);
      oA.setAttribute("id", "authBtn");
      oA.setAttribute("target", "_blank");
      document.body.appendChild(oA);
      let btn = document.getElementById("authBtn");
      btn.click();
      if (btn) document.body.removeChild(document.getElementById("authBtn"));
      this.$confirm("提示", {
        title: "提示",
        showCancelButton: false,
        message: this.$createElement("div", null, '是否授权成功'),
        callback: async action => {
          if (action === "confirm") {
            this.$router.push('/wechataccount/accountsetting')
            this._getCdnDomainList()
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.account-setting__section {
  box-sizing: border-box;
  padding: 0 32px;
  height: 100%;
  .account-setting__content {
    position: relative;
    height: calc(100% - 103px);
    min-height: 600px;
    .account-setting__bind--box {
      width: 100%;
      height: calc(100% - 266px);
      .account-setting__bind {
        width:290px;
        height:225px;
        margin: 0 auto;
        text-align: center;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 12px 0px rgba(243,243,243,1);
        border-radius:3px;
        border:1px solid rgba(99,220,140,1);
        img {
          width: 85px;
          height: 61px;
          margin: 48px 0 12px;
        }
        p {
          font-size:14px;
          font-family:"PingFangSC";
          font-weight:400;
          color:rgba(161,168,177,1);
          line-height:20px;
        }
        div {
          cursor: pointer;
          font-size:14px;
          font-family:"PingFangSC";
          font-weight:400;
          margin-top: 20px;
          color:rgba(99,220,140,1);
          line-height:20px;
        }
      }
      .account-setting__resolve {
        width:425px;
        height:293px;
        margin: 0 auto;
        text-align: center;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 12px 0px rgba(243,243,243,1);
        border-radius:3px;
        border:1px solid rgba(99,220,140,1);
        img {
          width: 64px;
          height: 56px;
          margin: 48px 0 12px;
        }
        p {
          font-size:14px;
          font-family:"PingFangSC";
          font-weight:400;
          color:rgba(161,168,177,1);
          line-height:30px;
        }
        input {
          width:340px;
          height:40px;
          background:rgba(255,255,255,1);
          border-radius:2px;
          border:1px solid rgba(229,229,229,1);
          font-family:'PingFangSC-Regular,PingFangSC';
          font-weight:400;
          padding-left: 10px;
          margin: 20px 0 30px;
        }
        input::placeholder {
          color:rgba(211,211,211,1);
          opacity: 1;
        }
        .tips {
          height:20px;
          width:340px;
          margin: -23px auto 6px;
          text-align: left;
          p {
            display: inline-block;
            color: #262626;
            padding:0px;
            font-size: 12px;
            line-height: 20px;
            position: relative;
          }
          span {
            padding-left: 5px;
            color: rgba(0, 193, 222, 1);
          }
        }
        .add {
          width: 340px;
          height: 34px;
          color: rgba(255, 255, 255, 1);
          background-color: rgba(0, 193, 222, 1);
          font-size: 14px;
          line-height: 34px;
          text-align: center;
          margin: 0 auto;
        }
        div {
          font-size:14px;
          font-weight:400;
          color:rgba(99,220,140,1);
          line-height:20px;
          cursor: pointer;
          .iconjiantouxia {
            display: inline-block;
            font-weight: 600;
            margin-left: 6px;
            transform: rotate(-90deg);
          }
        }
        ul {
          position: relative;
          width:340px;
          height:40px;
          background:rgba(255,255,255,1);
          border-radius:2px;
          border:1px solid rgba(229,229,229,1);
          margin: 20px auto 30px;
          text-align: left;
          span {
            display: inline-block;
            width: 340px;
            color: #D3D3D3;
            padding: 0 10px;
            line-height: 40px;
            margin-bottom: 4px;
            i {
              color: #a1a8b1;
              float: right;
            }
          }
          li {
            height: 40px;
            padding-left: 15px;
            font-size:14px;
            font-family:'PingFangSC-Regular,PingFangSC';
            font-weight:400;
            color:rgba(38,38,38,1);
            line-height:40px;
            background: #ffffff;
            border: 1px solid #E5E5E5;
            border-bottom: none;
            cursor: pointer;
          }
          li:last-child {
            border-bottom: 1px solid #E5E5E5;
          }
          li:hover {
            background: #F8FAFC;
          }
        }
      }
      .account-setting__complete {
        width:320px;
        height:280px;
        margin: 0 auto;
        text-align: center;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 12px 0px rgba(243,243,243,1);
        border-radius:3px;
        border:1px solid rgba(99,220,140,1);
        i {
          display: inline-block;
          width:100px;
          height:100px;
          font-weight: 500;
          border:2px solid rgba(99,220,140,1);
          border-radius: 50%;
          color: rgba(99,220,140,1);
          font-size: 30px;
          line-height: 100px;
          margin: 50px 0 30px;
        }
        p {
          font-size:18px;
          font-weight:300;
          color:rgba(38,38,38,1);
        }
      }
      .account-bind__tips {
        width: 418px;
        margin: 40px auto 0;
        p {
          font-size:14px;
          font-family:"PingFangSC";
          font-weight:400;
          color:rgba(161,168,177,1);
          line-height:30px;
        }
      }
      .account-bind__tips2 {
        width: 580px;
      }
    }
  }
}
</style>