<template>
  <div class="wrap">
    <div class="background"></div>
    <div class="mask"></div>
    <div class="content">
      <div class="noPhone" v-show="creating&&!hasPhone">
        <div class="headTitle">创建管理员</div>
        <div class="tips">您已购买的服务还未创建系统管理员，请使用管理员手机号创建一个系统管理员</div>
        <!-- <div class="phone">
        <div>+86</div>
        </div>-->
        <div class="phone">
          <el-input class="phoneInput" placeholder="请输入手机号" v-model="phone">
            <span slot="prefix" class="phoneTip">
              <el-select v-model="codeValue" class="codeInput" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code">
                </el-option>
              </el-select>
            </span>
          </el-input>
        </div>
        <!-- <div class="slider"></div> -->
        <div class="smsCode">
          <el-input class="smsCodeInput" placeholder="短信验证码" v-model="smsCode">
            <div slot="suffix" style="padding:0 8px">
              <button class="smsText" v-show="!smsShow" @click="sendSms">{{smsText}}</button>
              <button class="smsText" v-show="smsShow">{{count}} s</button>
            </div>
          </el-input>
        </div>
        <button class="createBtn cl-button cl-button--primary" @click="create">创建</button>
      </div>
      <div class="hasPhone" v-show="creating&&hasPhone">
        <div v-show="!useNewPhone">
          <div class="headTitle">创建管理员</div>
          <div class="tips">
            <span>系统将为您创建手机号为</span>
            <span class="tipsPhone">{{oldPhone}}</span>
            <div style="margin-top:6px">的管理员账号</div>
          </div>
          <div class="useOtherPhone" @click="showNewPhone">使用其它手机号码</div>
          <button class="createBtn cl-button cl-button--primary" @click="create">创建</button>
        </div>
        <div v-show="useNewPhone">
          <div class="headTitle">
            <i class="iconfont iconicon-des-Arrow back" @click="cancelNewPhone"></i>
            创建管理员
          </div>
          <div class="tips">您已购买的服务还未创建系统管理员，请使用管理员手机号创建一个系统管理员</div>
          <div class="phone">
            <el-input class="phoneInput" placeholder="请输入手机号" v-model="newPhone">
              <span slot="prefix" class="phoneTip">
                <el-select v-model="codeValue" class="codeInput" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.code"
                    :label="item.code"
                    :value="item.code">
                  </el-option>
                </el-select>
              </span>
            </el-input>
          </div>
          <!-- <div class="slider"></div> -->
          <div class="smsCode">
            <el-input class="smsCodeInput" placeholder="短信验证码" v-model="newSmsCode">
              <div slot="suffix" style="padding:0 8px">
                <button class="smsText" v-show="!smsShow" @click="sendNewSms">{{smsText}}</button>
                <button class="smsText" v-show="smsShow">{{count}} s</button>
              </div>
            </el-input>
          </div>
          <button class="createBtn cl-button cl-button--primary" @click="create">创建</button>
        </div>
      </div>
      <div class="gongzhonghao" v-show="gongzhonghao">
        <div class="img"></div>
        <div class="imgTips">微信扫码关注公众号</div>
        <div class="textWrap">
          <div class="text">云建站助手</div>
          <div class="text">及时接收服务信息，随时随地移动管控</div>
          <div class="text">更安全，更便捷</div>
        </div>
        <span class="next" @click="next">略过</span>
      </div>
      <div class="last" v-show="createComplete">
        <el-progress
          class="progress"
          type="circle"
          :percentage="percentage"
          :color="percentageColor"
          status="success"
        ></el-progress>
        <div class="creating" v-show="!isCreateComplete">创建中...</div>
        <div class="createComplete" v-show="isCreateComplete">恭喜您，创建成功!</div>
        <div class="createText">您现在可以使用管理员手机号登录以下网址 快捷管理您已购的服务</div>
        <div style="margin-top:32px">
          <span class="domain">login.clouddream.net</span>
        </div>
        <button class="complete cl-button cl-button--primary" @click="complete">完成</button>
      </div>
    </div>
  </div>
</template>
<script>
import { sendTargetPhoneCode } from "@/api/index.js";
import * as dashboardApi from "@/api/request/dashboardApi";

export default {
  data() {
    return {
      hasPhone: false,
      codeValue: "+86",
      options:[
        {
          code: "+86"
        },
        {
          code: "+852"
        },
        {
          code: "+886"
        },
        {
          code: "+1"
        },
        {
          code: "+44"
        },
        {
          code: "+81"
        },
        {
          code: "+7"
        },
        {
          code: "+39"
        }
      ],
      phone: "",
      newPhone: "",
      oldPhone: "",
      useNewPhone: false,
      smsCode: "",
      newSmsCode: "",
      smsText: "发送验证码",
      smsShow: false,
      count: "60",
      percentage: 0,
      percentageColor: "#63DC8C",
      percentageSuccess: "",
      isCreateComplete: false,
      creating: true,
      gongzhonghao: false,
      createComplete: false,
      redirectUrl: "",
      sign: ""
    };
  },
  mounted() {
    this.getAliyunSsoLoginInfo();
  },
  methods: {
    showNewPhone() {
      this.useNewPhone = true;
    },
    cancelNewPhone() {
      this.useNewPhone = false;
    },
    async create() {
      if (this.hasPhone) {
        if (this.useNewPhone) {
          if (this.newPhone == "") {
            this.$notify({
              customClass: "notify-error",
              message: "请输入手机号",
              duration: 1500,
              showClose: false
            });
            return;
          } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.newPhone)) {
            this.$notify({
              customClass: "notify-error",
              message: "您输入的手机号格式有误，请重新输入",
              duration: 1500,
              showClose: false
            });
            return;
          }
        }
      } else {
        if (this.phone == "") {
          this.$notify({
            customClass: "notify-error",
            message: "请输入手机号",
            duration: 1500,
            showClose: false
          });
          return;
        } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
          this.$notify({
            customClass: "notify-error",
            message: "您输入的手机号格式有误，请重新输入",
            duration: 1500,
            showClose: false
          });
          return;
        }
      }
      let isChange = "";
      if (this.hasPhone) {
        isChange = this.useNewPhone ? true : false;
      } else {
        isChange = true;
      }
      let para = {
        Mobile: this.oldPhone,
        NewMobile: this.hasPhone ? this.newPhone : this.phone,
        Code: this.hasPhone ? this.newSmsCode : this.smsCode,
        IsChanged: isChange,
        OrderBizId: this.$route.query.orderBizId,
        Sign: this.sign
      };
      let { data, status } = await dashboardApi.createAliyunSsoLoginUser(para);
      if (data.isSuccess == true) {
        this.creating = false;
        this.gongzhonghao = true;
        this.redirectUrl = data.redirectUrl;
      } else {
        this.$notify({
          customClass: "notify-error",
          message: data.message,
          duration: 1500,
          showClose: false
        });
      }
    },
    next() {
      this.gongzhonghao = false;
      this.createComplete = true;
      let timer = setInterval(() => {
        this.percentage++;
        if (this.percentage == 100) {
          this.percentageSuccess = "success";
          this.isCreateComplete = true;
          clearInterval(timer); // 清除定时器
          timer = null;
        }
      }, 1);
    },
    complete() {
      window.location.href = this.redirectUrl;
    },
    sendSms() {
      if (this.phone == "") {
        this.$notify({
          customClass: "notify-error",
          message: "请输入手机号",
          duration: 1500,
          showClose: false
        });
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
        this.$notify({
          customClass: "notify-error",
          message: "您输入的手机号格式有误，请重新输入",
          duration: 1500,
          showClose: false
        });
      } else {
        this.sendAliyunMobileVerifyCode(this.phone);
      }
    },
    sendNewSms() {
      if (this.newPhone == "") {
        this.$notify({
          customClass: "notify-error",
          message: "请输入手机号",
          duration: 1500,
          showClose: false
        });
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.newPhone)) {
        this.$notify({
          customClass: "notify-error",
          message: "您输入的手机号格式有误，请重新输入",
          duration: 1500,
          showClose: false
        });
      } else {
        this.sendAliyunMobileVerifyCode(this.newPhone);
      }
    },
    async sendAliyunMobileVerifyCode(phone) {
      let { data, status } = await dashboardApi.sendAliyunMobileVerifyCode(
        phone
      );
      if (status === 200) {
        this.$notify({
          customClass: "notify-success",
          message: "发送成功",
          duration: 1500,
          showClose: false
        });
        let timer = null;
        if (!timer) {
          this.count = 60;
          this.smsShow = true;
          timer = setInterval(() => {
            if (this.count > 0 && this.count <= 60) {
              this.count--;
            } else {
              this.smsShow = false;
              clearInterval(timer); // 清除定时器
              timer = null;
              this.count = "";
            }
          }, 1000);
        }
      } else {
        this.$notify({
          customClass: "notify-error",
          message: "发送失败",
          duration: 1500,
          showClose: false
        });
      }
    },
    async getAliyunSsoLoginInfo() {
      let para = {
        OrderBizId: this.$route.query.orderBizId,
        Verify: this.$route.query.verify,
        TimeStamp: this.$route.query.timestamp,
        Token: this.$route.query.token
      };
      let { data, status } = await dashboardApi.getAliyunSsoLoginInfo(para);
      if (status == 200) {
        this.hasPhone = data.verifyMobile;
        this.oldPhone = data.mobile;
        this.sign = data.sign;
      } else {
        this.$notify({
          customClass: "notify-error",
          message: data.message,
          duration: 1500,
          showClose: false
        });
      }
    },
    request(paramName) {
      let paramValue = "";
      let params = window.location.href.split("?")[1];
      if (params == null || params == "") return paramValue;
      let arr = params.split("&");
      if (arr.length >= 1) {
        for (let i = 0; i < arr.length; i++) {
          let name = arr[i].substring(0, arr[i].indexOf("="));
          if (name == paramName) {
            let begin = arr[i].indexOf("=");
            let end = arr[i].length;
            paramValue = arr[i].substring(begin + 1, end);
            break;
          }
        }
      }
      return paramValue;
    }
  }
};
</script>
<style scoped>
.wrap /deep/ .el-input__inner {
  border: none;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
.phone /deep/ .el-input-group__prepend {
  background: #fff;
}
.progress /deep/ .el-progress__text .el-icon-check {
  font-size: 30px !important;
  color: #67C23A;
}
.progress /deep/ .el-progress-circle {
  width: 55px !important;
  height: 55px !important;
}
</style>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
.background {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  // background: url("~img/dashboard/board-ssoLogin.png") no-repeat center;
  background-size: contain;
  background-image: url("~img/dashboard/board-ssoLogin.png");
  background-repeat: no-repeat;
  background-position: top;
  // background-size: 50%;
  z-index: 1018;
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1019;
  background: #000;
  width: 100%;
  height: 100%;
  opacity: 0.7;
}
.content {
  position: fixed;
  width: 416px;
  margin: auto;
  background: #fff;
  z-index: 1020;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border-radius: 2px;
  padding: 0 24px 40px;
  box-sizing: border-box;
  .headTitle {
    position: relative;
    margin-top: 32px;
    font-size: 18px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 25px;
    text-align: center;
    .back {
      position: absolute;
      left: 0px;
      line-height: 14px;
      color: $--color-text-regular;
      transform: rotate(180deg);
      cursor: pointer;
      padding: 8px;
      &:hover {
        background: rgba(248, 250, 252, 1);
        border-radius: 2px;
      }
    }
  }
  .noPhone {
    .tips {
      background: rgba(255, 251, 248, 1);
      border-radius: 2px;
      border: 1px solid rgba(255, 202, 163, 1);
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 300;
      color: $--color-primary;
      line-height: 20px;
      margin-top: 22px;
    }
    .phone {
      margin-top: 16px;
      width: 100%;
      height: 40px;
      border-radius: 2px;
      border: $--border-base;
      /deep/ .el-input__inner {
        padding-left: 81px;
      }
      .codeInput /deep/ .el-input__inner {
        padding-left: 8px;
      }
      .phoneTip {
        width: 75px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(38, 38, 38, 1);
        line-height: 40px;
        display: inline-block;
        text-align: center;
      }
    }

    .slider {
      margin-top: 16px;
      width: 100%;
      height: 43px;
      background: rgba(229, 229, 229, 1);
      border-radius: 2px;
      opacity: 0.58;
    }
    .smsCode {
      margin-top: 16px;
      width: 100%;
      height: 40px;
      border-radius: 2px;
      border: $--border-base;
      /deep/ .el-input__inner {
        padding-right: 90px;
      }
      .smsText {
        font-size: 14px;
        font-weight: 400;
        color: $--color-primary;
        line-height: 40px;
      }
    }
  }
  .hasPhone {
    .tips {
      margin-top: 22px;
      padding: 8px 16px;
      background: rgba(255, 251, 248, 1);
      border-radius: 2px;
      border: 1px solid rgba(255, 202, 163, 1);
      color: $--color-primary;
      font-size: 14px;
      font-weight: 300;
      line-height: 20px;
      .tipsPhone {
        padding-left: 8px;
        font-size: 20px;
        font-weight: 400;
        color: $--color-primary;
        line-height: 28px;
      }
    }
    .useOtherPhone {
      display: inline-block;
      margin-top: 16px;
      font-size: 14px;
      font-weight: 400;
      color: $--color-info;
      line-height: 20px;
      padding: 8px;
      cursor: pointer;
    }
    .phone {
      margin-top: 16px;
      width: 100%;
      height: 40px;
      border-radius: 2px;
      border: $--border-base;
      /deep/ .el-input__inner {
        padding-left: 81px;
      }
      .codeInput /deep/ .el-input__inner {
        padding-left: 8px;
      }
      .phoneTip {
        width: 75px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(38, 38, 38, 1);
        line-height: 40px;
        display: inline-block;
        text-align: center;
      }
    }
    .slider {
      margin-top: 16px;
      width: 100%;
      height: 43px;
      background: rgba(229, 229, 229, 1);
      border-radius: 2px;
      opacity: 0.58;
    }
    .smsCode {
      margin-top: 16px;
      width: 100%;
      height: 40px;
      border-radius: 2px;
      border: $--border-base;
      /deep/ .el-input__inner {
        padding-right: 90px;
      }
      .smsText {
        font-size: 14px;
        font-weight: 400;
        color: $--color-primary;
        line-height: 40px;
      }
    }
  }
  .createBtn {
    margin-top: 32px;
    width: 100%;
    height: 40px;
    font-size: 14px;
  }
  .gongzhonghao {
    position: relative;
    text-align: center;
    .img {
      margin: auto;
      margin-top: 56px;
      width: 130px;
      height: 130px;
      background: url("~img/gongzhonghao.png") no-repeat center;
      background-size: contain;
    }
    .imgTips {
      margin-top: 16px;
      font-size: 14px;
      font-weight: 400;
      color: $--color-text-regular;
      line-height: 20px;
    }
    .textWrap {
      margin-top: 28px;
      padding-bottom: 52px;
      .text {
        font-size: 14px;
        font-weight: 400;
        color: $--color-primary;
        line-height: 30px;
      }
    }
    .next {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 14px;
      font-weight: 400;
      color: $--color-text-regular;
      line-height: 20px;
      cursor: pointer;
    }
  }
  .last {
    text-align: center;
    background-image: url("~img/dashboard/board-siteBackground2.png");
    background-repeat: no-repeat;
    background-position: 80% top;
    background-size: 50%;
    .progress {
      margin-top: 76px;
      width: 55px;
      height: 55px;
    }
    .creating {
      margin-top: 20px;
      font-size: 16px;
      font-weight: 400;
      color: $--color-text-regular;
      line-height: 22px;
    }
    .createComplete {
      margin-top: 20px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 22px;
    }
    .createText {
      display: inline-block;
      margin-top: 20px;
      width: 266px;
      font-size: 14px;
      font-weight: 400;
      color: $--color-text-regular;
      line-height: 25px;
    }
    .domain {
      font-size: 14px;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
    }
    .complete {
      margin-top: 32px;
      width: 100%;
      height: 40px;
      font-size: 14px;
    }
  }
}
</style>