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
        <div class="account-body">
          <!-- 第一步绑定工众号 -->
          <div v-if="step == 1" class="account-setting__bind">
            <img :src="wechanIcon" alt />
            <p>请先绑定微信公众号</p>
            <div @click="_handleWxAuth">授权绑定微信公众号</div>
          </div>
          <!-- 第二步绑定域名 -->
          <div v-if="step == 2" class="account-setting__resolve">
            <!-- <img :src="wechanSpare" alt /> -->
            <p>设置推广域名，立即开启自定义菜单</p>
            <input 
              type='text'
              v-model="addDomain" 
              v-if="domainList.length <= 0" 
              placeholder="请输入需添加的域名"/>
            <ul v-else>
              <span
                class="pointer" 
                @click="showDomainList(false)" >
                  {{domainName}}
                <i class="icon iconfont iconicon-des-lower"></i>
              </span>
              <div class="select-contant">
                <li
                  v-show="isShowDomainList" 
                  v-for="(item,index) in domainList"
                  :class="{active: domainIndex == index}"
                  @click="showDomainList(item,index)" 
                  :key="index"
                >
                  {{item.domain}}
                  <i v-if="domainIndex == index" class="icon iconfont iconduihao"></i>
                </li>
              </div>
            </ul>
            <div v-if="isShowTips && !isShowDomainList" class='tips'>
              <p class="ym-form-item__error">{{tipsText}}</p>
              <span @click='goResolve'>去解析</span>
            </div>
            <div class="add" @click='changeResolve'>{{domainList.length>0?'完成设置':'添加域名'}}</div>
          </div>
          <!-- 第三部完成设置 -->
          
          <div class='account-setting__complete' v-if='step == 3'>
            <!-- <i class='icon iconfont iconduihao'></i> -->
            <el-progress 
              v-if="!percenStatus"
              type="circle" 
              :percentage="percentage"
              :width="100"
              color="#63DC8C"
              :stroke-width='2'
            >
            </el-progress>
            <el-progress
              v-if="percenStatus"
              type="circle" 
              :width="100"
              color="#63DC8C"
              :status="percenStatus"
              :stroke-width='2'
            >
            </el-progress>
            <p v-if="percentage<100">正在配置...</p>
            <p v-else>配置成功</p>
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
    <div class="popup-mask" v-if="isShowPopup">
      <div class="popup-contant">
        <div class="auther-top">
          <span>提示</span>
          <i class="icon iconfont iconguanbi" @click="isShowPopup = !isShowPopup"></i>
        </div>
        <div class="auther-body">
          <i class="icon iconfont iconyiwen"></i>
          <span v-if="authStatus != 0">
            {{authStatus == 1 ? '授权失败':'授权成功'}}
          </span>
          <p v-if="authStatus != 2">{{authTipText}}</p>
        </div>
        <div class="auther-footer">
          <!-- <span >取消</span> -->
          <span v-if="authStatus != 0" class="sure" @click="closeAuther">
            {{authStatus == 1 ? '关闭':'确定'}}
          </span>
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
import environment from "@/environment/index";
import { wxAuth, getCdnDomainList, bindDomain, setPromotionUrl} from "@/api/request/account.js";
import AccountCertification from '_c/wechat-account/defineMenu/account-wxcertification';
import { setTimeout } from 'timers';
import {getLocal,setLocal,removeLocal} from '@/libs/local'

export default {
  data() {
    return {
      step: 1,
      title: "账号设置",
      domainIndex: -1,
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
      authTipText: '请在新打开的窗口中完成授权...',
      isShowTips: false,
      isShowPopup: false,
      authStatus: 1,//0 为获取，1 失败， 2成功，
      addDomain: '',
      percentage: 0,
      percenStatus: false,
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
    },
    // 切换站点刷新信息
    chooseWebsite(siteId) {
      this.siteId = siteId;
      this._getWxIsAuth()
      this._getCdnDomainList();
    },
    async _getInfo(){
      await this.$store.dispatch('_getWxStatus')
    },
    // 获取当前可选域名列表
    async _getCdnDomainList() {
      // await this.$store.dispatch('_setSiteId')
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
        if(this.domainList.length > 0) {
          this.showDomainList(this.domainList[0],0)
          this.isShowDomainList =false
        }
      }
    },
    //去解析
    goResolve(){
      window.open(environment.redirectUrl.siteDomain);
    },
    //完成设置
    async changeResolve(){
      if(this.domainList.length <=0) {
        //新增域名
        if (!regDomain.test(this.addDomain)) {
          this.tipsText = '名称仅包含中英文、数字、特殊符号。';
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
          // notify(this,'请先在完成域名解析', 'error')
          return
        }
        let data = await setPromotionUrl({siteId: this.siteId, domain:this.domainName})
        if(data &&  data.status == 200) {
          this.step = 3
          var t1=window.setInterval(()=> {
            if(this.percentage >= 100) {
              window.clearInterval(t1);
              this.percenStatus = 'success'
              setTimeout(()=>{
                this.$router.replace({
                    name: 'accountsetting'
                })
              },2500); 
            } else {
              this.percentage = this.percentage + 5
            }
          }, 600);
        } else {
          notify(this,'推广域名设置失败', 'error')
        }
      }
    },
    //显示域名选择列表
    showDomainList(val,ind){
      this.isShowDomainList = !this.isShowDomainList;     
      if(val) {
        this.isShowTips = false
        this.domainName = val.domain
        this.domainIndex = ind
        this.isResolve = val.cdnDomainResolveStatus
        if (val.cdnDomainResolveStatus != 2) {
          this.tipsText = '域名未解析，请先完成域名解析'
          this.isShowTips = true
        }
      }
    },
    // 校验是否已经授权认证
    async _getWxIsAuth() {
      await this.$store.dispatch('_getWxStatus')
      let wx_status = this.$store.state.wxaccount.wx_status
      if (wx_status.isAuth && wx_status.isCertification && wx_status.isResolveSuccess) {
        this.$router.replace({path:'/wechat/accountsetting' });
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
      
      this.isShowPopup = true
      this.authStatus = 0
      this.authTipText = '请在新打开的窗口中完成授权...',
      removeLocal("transitTips")
      // setTimeout(function (){
      //   setLocal("transitTips", {data:'999',status: 500})
      // }, 6000)
      var authTimer=window.setInterval(()=> {
        if(!this.isShowPopup) {
          window.clearInterval(this.authTimer)
        }
        let data = getLocal("transitTips")
        if(data) {
          this.authTipText = data.data;
          if (data.data == 'success') {
            this.authStatus = 2
            this.authTipText = ''
          } else {
            this.authStatus = 1
            this.authTipText = data.data
          }
        }
      },1200)
    },

    closeAuther(){
      this.isShowPopup = false
      removeLocal("transitTips")
      this.$router.push('/wechat/accountsetting')
      this._getCdnDomainList()
    }
  }
};
</script>
<style scoped>
.el-progress.is-success /deep/ .el-progress__text {
  color: #63DC8C;
  font-size: 40px !important;
  font-weight: 700;
}
.el-progress /deep/ .el-progress__text {
  font-size: 22px !important;
}
</style>
<style lang="scss" scoped>
.account-setting__section {
  box-sizing: border-box;
  padding: 16px 32px 0;
  height: 100%;
  min-width: 800px;
  .account-setting__content {
    position: relative;
    min-height: 500px;
    .account-setting__bind--box {
      width: 100%;
      height: calc(100% - 266px);
      .account-body {
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(221,226,234,1);
      }
      .account-setting__bind {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        
        img {
          width: 58px;
          height: 44px;
          margin: 72px 0 24px;
        }
        p {
          font-size:14px;
          font-family:"PingFangSC";
          font-weight:400;
          color:#A1A8B1;
          line-height:20px;
        }
        div {
          display: inline-block;
          width: 340px;
          height: 40px;
          cursor: pointer;
          font-size:14px;
          font-family:"PingFangSC";
          font-weight:400;
          margin-top: 20px;
          color:#ffffff;
          background: #01c0de;
          line-height:40px;
          border-radius: 3px;
        }
      }
      .account-setting__resolve {
        padding-top: 50px;
        width:425px;
        margin: 0 auto;
        text-align: center;
        background:rgba(255,255,255,1);
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
            color: #262626;
            padding: 0 10px;
            line-height: 40px;
            margin-bottom: 4px;
            i {
              color: #a1a8b1;
              float: right;
            }
          }
          .select-contant {
            max-height: 162px;
            overflow-y: auto;
          }
          li {
            height: 40px;
            padding: 0 16px;
            font-size:14px;
            font-family:'PingFangSC-Regular,PingFangSC';
            font-weight:400;
            color:rgba(38,38,38,1);
            line-height:40px;
            background: #ffffff;
            border: 1px solid #E5E5E5;
            border-bottom: none;
            cursor: pointer;
            i {
              float: right;
            }
          }
          li:last-child {
            border-bottom: 1px solid #E5E5E5;
          }
          li:hover {
            background: #F8FAFC;
          }
          .active {
            background: #F0F3F7 !important;
            color: #09CCEB;
          }
        }
      }
      .account-setting__complete {
        margin: 0 auto;
        padding-top: 50px;
        text-align: center;
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
          margin-top: 14px;
          color:rgba(38,38,38,1);
        }
      }
      .account-bind__tips {
        width: 418px;
        margin: 32px auto 50px;
        background: white;
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
    border-radius: 3px;
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
      padding: 40px;
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
        font-size: 14px;
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
        height: 40px;
        cursor: pointer;
        background: #ffffff;
        border-radius: 3px;
        text-align: center;
        line-height: 40px;
        border: 1px solid #09cceb;
        margin-left: 24px;
        color: #09cceb;
      }
      .sure {
        border: 1px solid #09cceb;
        background: #09cceb;
        color: #ffffff;
      }
    }
  }
}
</style>