<template>
    <div class="personal">
        <h3>个人账号管理</h3>        
        <dl class="user-account clear">
            <dt class="avatar">
                <img src="../../assets/avatar.jpeg" alt="个人头像" @mouseover="changeFlag">
                <button @click="uploadImg" v-show="showUploadBtn">修改头像</button>
            </dt>

            <dd class="account-info">
                <p>
                    <span v-if="flag">
                        {{input!=''? input : '设置您的名字'}}
                        <i @click="setName" class="el-icon-edit"></i>
                    </span>
                    <el-input @blur="blur"
                              v-else
                              maxlength="20"
                              show-word-limit
                              v-model="input"
                              placeholder="请输入内容"></el-input>
                    <!--<el-input @blur="blur"
                  v-else
                  maxlength="20"
                  show-word-limit
                  size="small"
                  v-model="input"
                  placeholder="请输入内容"></el-input>-->
                </p>
                <p>
                    创建时间
                    <i v-model="createTime">{{createTime}}</i>
                </p>
            </dd>
        </dl>
        <ul class="social-list">
            <li>
                <div class="fleft">
                    <span>
                        <i>x</i>
                        <b>手机号码</b>
                    </span>
                    <span class="pd-left social-desc">手机号同时也是您的平台账号，可直接使用手机号登录管理平台，登录地址：www.clouddream.net.cn</span>
                </div>
                <div class="fright">
                    <span>{{userInfo.phoneNumber}}</span>

                    <span class="pd-left">
                        <button>已绑定</button> |
                        <button @click="modifiPhoneNum">修改</button>
                    </span>
                </div>
            </li>
            <li>
                <div class="fleft">
                    <span>
                        <i>x</i>
                        <b>登录密码</b>
                    </span>
                    <span class="pd-left social-desc">设置登录密码，可使用手机号+密码登录管理平台，为保证帐号更加安全，建议您定期修改密码</span>
                </div>
                <div class="fright">
                    <span></span>

                    <span class="pd-left">
                        <button>已绑定</button> |
                        <button @click="modifiPwd">修改</button>
                    </span>
                </div>
            </li>
            <li>
                <div class="fleft">
                    <span>
                        <i>x</i>
                        <b>绑定微信</b>
                    </span>
                    <span class="pd-left social-desc">绑定微信，可使用微信登录管理平台</span>
                </div>
                <div class="fright">
                    <span v-if="WeChatUser">{{WeChatUser.externalName}}</span>
                    <span v-else></span>

                    <span class="pd-left">
                        <button v-if="WeChatUser">已绑定</button>
                        <button v-else>未绑定</button>
                        |
                        <button v-if="WeChatUser" @click="_untyingWeixin(WeChatUser.provider)">解绑</button>
                        <button v-else @click="_bindingWeixin()">绑定</button>
                    </span>
                </div>
            </li>
            <li>
                <div class="fleft">
                    <span>
                        <i>x</i>
                        <b>绑定钉钉</b>
                    </span>
                    <span class="pd-left social-desc">绑定钉钉，可使用钉钉登录管理平台</span>
                </div>
                <div class="fright">
                    <button v-if="DingDingUser">已绑定</button>
                    <button v-else>未绑定</button>
                    |
                    <button v-if="DingDingUser" @click="_untyingDing(DingDingUser.provider)">解绑</button>
                    <button v-else @click="_bindingDing()">绑定</button>
                </div>
            </li>
            <li>
                <div class="fleft">
                    <span>
                        <i>x</i>
                        <b>绑定支付宝</b>
                    </span>
                    <span class="pd-left social-desc">绑定支付宝，可使用支付宝登录管理平台</span>
                </div>
                <div class="fright">
                    <span v-if="AlipayUser">{{AlipayUser.externalName}}</span>
                    <span v-else></span>

                    <span class="pd-left">
                        <button v-if="AlipayUser">已绑定</button>
                        <button v-else>未绑定</button>
                        |
                        <button v-if="AlipayUser" @click="_untyingAlipay(AlipayUser.provider)">解绑</button>
                        <button v-else @click="_bindingAlipay()">绑定</button>
                    </span>
                </div>
            </li>
        </ul>
        <right-pannel :style="{width:pannelWidth+'px'}">
            <span slot="title-text">{{titText}}</span>
            <component :is="curComponent" :sourcePhone="userInfo.phoneNumber" :provider="CurrentProvider" 
            @removeExternalUserAsync="_removeExternalUserAsync" 
            @updateWeiXinHtml="updateWeiXinHtml" 
            :weixinHtml="weixinHtml" :WeChatJsLoginParams="WeChatJsLoginParams"></component>
        </right-pannel>
        <el-dialog width="0"
                   style="z-index:10"
                   :close-on-click-modal="false"
                   :show-close="false"
                   :visible.sync="$store.state.isRightPanelShow || $store.state.isInvitationPanelShow"></el-dialog>
    </div>
</template>
<script>

import RightPannel from "../RightPannel";
import SetPhoneNumber from "./SetPhoneNumber";
import SetPwd from "./SetPwd";
import BindingWeChat from "./BindingWeChat";
import UntyingWeChat from "./UntyingWeChat";
import GetSms from "./GetSms";
import { mapState,mapMutations, mapGetters } from "vuex";
import securityService from "@/services/authentication/securityService";
import { getUserProfile, getExternalUserInfo, removeExternalUser, getWeChatJsLoginParams,formatDateTime } from "@/api/index.js"; 
import { updateUserName } from "@/api/index.js";
    export default {
        data() {
            return {
                input: "",
                flag: true,
                userInfo: {phoneNumber:"15801566482"},
                curComponent: "",
                titText: "手机号修改",
                ExternalUsers:null,
                WeChatUser: null,
                AlipayUser: null,
                DingDingUser: null,
                WeChatJsLoginParams:null,
                CurrentProvider:"",
                weixinHtml: "",
                createTime: "2019-06-28",
                showUploadBtn: false
            };
        },
        components: {
            RightPannel,
            SetPhoneNumber,
            UntyingWeChat,
            BindingWeChat,
            SetPhoneNumber,
            SetPwd
        },
        created() {
            this._getUserProfileAsync();
            this._getExternalUserAsync();
            this._getWeChatJsLoginParams();           
        },
        methods: {
            ...mapMutations(["ISRIGHTPANNELSHOW"]),          
            async _getUserProfileAsync() {
                let { data } = await getUserProfile();
                this.userInfo = data;
                this.input = data.displayName;                
                this.createTime = formatDateTime(data.createTime, "yyyy-MM-dd hh:mm:ss");
               // console.log(this.userInfo)
            },
            async _getExternalUserAsync() {
                this.WeChatUser=null;
                this.AlipayUser=null;
                this.DingDingUser=null;
                let { data } = await getExternalUserInfo();
               // console.log(data);
                this.ExternalUsers = data; 
                if(this.ExternalUsers && this.ExternalUsers.length>0  ){
                    this.ExternalUsers.forEach(element => {
                        if(element.provider=="Weixin"){
                            this.WeChatUser=element;
                        }else if(element.provider=="Alipay"){
                            this.AlipayUser=element;
                        }else if(element.provider=="DingDing"){
                            this.DingDingUser=element;
                        }
                    });
                }
            },
            changeFlag() {
                this.showUploadBtn = true;
            },
            //上传头像
            uploadImg() {
                this.showUploadBtn = false;
            },
            //获取微信Js相关参数
            async _getWeChatJsLoginParams(){
                let { data } = await getWeChatJsLoginParams();
                this.WeChatJsLoginParams = data;
            },
            //解绑第三方账号
            async _removeExternalUserAsync(provider){
                let { data } = await removeExternalUser(provider);
                if(data == "true"){
                    this.$message({
                        type: "success",
                        message: "解绑成功!"
                    });
                    this.ISRIGHTPANNELSHOW(false)
                    this._getExternalUserAsync();
                }else
                {
                    this.$message({
                        type: "failed",
                        message: "解绑失败!"
                    });
                }
            },
            updateWeiXinHtml(){
               this.weixinHtml="绑定微信" +new Date;
            },
            // 修改手机号
            modifiPhoneNum() {
                this.curComponent = SetPhoneNumber;
                this.ISRIGHTPANNELSHOW(true)
            },            
            //修改密码
            modifiPwd() {
                this.curComponent = SetPwd;
                this.titText = "设置密码";
                this.ISRIGHTPANNELSHOW(true)
            },
            // 解绑微信
            _untyingWeixin(provider) { 
                this.titText="解绑微信";
                this.CurrentProvider=provider;
                this.curComponent = UntyingWeChat;
                this.ISRIGHTPANNELSHOW(true)
            },
            //绑定微信
            _bindingWeixin(){
                this.titText="绑定微信";
                this.weixinHtml="绑定微信" +new Date;
                this.CurrentProvider="Weixin";
                this.curComponent = BindingWeChat;
                this.ISRIGHTPANNELSHOW(true)
            }, 
            //钉钉 解绑
            _untyingDing(provider) { 
                this.titText="解绑钉钉";
                this.CurrentProvider=provider;
                //this.curComponent = UntyingWeChat;
                this.ISRIGHTPANNELSHOW(true)
            },
            //钉钉 绑定
            _bindingDing() { 
                this.titText="绑定钉钉";
                this.CurrentProvider="Dingding";
            },
            //支付宝 解绑
            _untyingAlipay(provider) {
                this.titText="解绑支付宝";
                this.CurrentProvider=provider;
                //this.curComponent = UntyingWeChat;
                this.ISRIGHTPANNELSHOW(true)
            },
            //支付宝 绑定
            _bindingAlipay() {
                this.titText="绑定支付宝";
                this.CurrentProvider="Alipay";
             },
            setName() {
                this.flag = false;
            },
            async blur() {
                this.flag = true;
                let { status } = await updateUserName(this.input);
                if (status === 200) {
                    this.$message({
                        type: "success",
                        message: "设置成功!"
                    });
                } else {
                    this.$message({
                        type: "failed",
                        message: "设置失败!"
                    });
                }
            },

        },
        computed: {
            pannelWidth() {
                return this.$store.state.isRightPanelShow === true ? 390 : 0;
            }
        }
    };
</script>
<style scoped>
</style>

<style lang="scss" scoped>
.personal {
    padding: 30px 20px 20px 40px;
    background: #fff;
}
.user-account {
    line-height: 30px;
    display: flex;
    align-items: center;
    padding-top: 15px;
    .avatar {
        float: left;
        width: 80px;
        height: 80px;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .account-info {
        float: left;
        padding-left: 20px;
        p {
            height: 32px;
            line-height: 32px;
        }
    }
}
.social-list {
    padding-top: 50px;
    li {
        padding: 20px 10px;
    }
    .fleft {
        float: left;
    }
    .fright {
        float: right;
    }
    .pd-left {
        padding-left: 30px;
    }
    .social-desc {
        color: #ccc;
    }
}
</style>

