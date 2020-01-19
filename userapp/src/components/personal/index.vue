<template>
    <div class="personal">
        <div class="personal-title">个人账号管理</div>
        <dl class="user-account clear">
            <dt class="avatar">
                <img :src="userInfo.userHeadUrl" />

                <span class="modify-avatar" @click="modifyAvatar">修改头像</span>
            </dt>
            <dd class="account-info">
                <p class="user-name">
                    <span class="name" v-if="flag">
                        {{input!=''? input : '设置您的名字'}}
                        <i
                            @click="setName"
                            class="icon-size iconfont iconbianji cl-iconfont is-square"
                        ></i>
                    </span>
                    <template v-else>
                        <el-input
                            maxlength="20"
                            show-word-limit
                            v-model="input"
                            placeholder="请输入内容"
                        ></el-input>
                        <span @click="blur">保存</span>
                        <span @click="cancelSetName">取消</span>
                    </template>
                </p>
                <p class="create-time">
                    创建时间:
                    <i>{{createTime}}</i>
                </p>
            </dd>
        </dl>
        <ul class="social-list">
            <li class="mobilePhone">
                <div class="left-wrap">
                    <i class="iconfont iconshouji1"></i>
                    <span class="set-name">手机号码</span>
                    <span class="social-desc">手机号同时也是您的平台账号，可直接使用手机号登录管理平台，登录地址：login.clouddream.net</span>
                </div>
                <div class="right-wrap">
                    <span class="user-value">{{userInfo.phoneNumber | geTel }}</span>

                    <span class="pd-left">
                        <i class="iconfont iconxingzhuangjiehe isbind"></i>
                        <div class="bind isbind">已绑定</div>|
                        <button @click="modifiPhoneNum">修改</button>
                    </span>
                </div>
            </li>
            <li class="password">
                <div class="left-wrap">
                    <i class="iconfont iconmima"></i>
                    <span class="set-name">登录密码</span>
                    <span class="social-desc">设置登录密码，可使用手机号+密码登录管理平台，为保证帐号更加安全，建议您定期修改密码</span>
                </div>
                <div class="right-wrap">
                    <span class="user-value" v-if="pwdTitle != '0'">******</span>
                    <span class="pd-left">
                        <i v-show="pwdTitle=='1'" class="iconfont iconxingzhuangjiehe isbind"></i>
                        <i v-show="pwdTitle!='1'" class="iconfont iconicon-exclamationmark notbind"></i>
                        <div
                            class="bind"
                            :class="pwdTitle=='1'?'isbind':'notbind'"
                        >{{pwdTitle=="0"?"未设置":"已设置"}}</div>|
                        <button @click="modifiPwd">{{pwdBtn}}</button>
                    </span>
                </div>
            </li>
            <li class="wechat">
                <div class="left-wrap">
                    <i class="iconfont iconweixin"></i>
                    <span class="set-name">绑定微信</span>
                    <span class="social-desc">绑定微信，可使用微信登录管理平台</span>
                </div>
                <div class="right-wrap">
                    <span class="user-value" v-if="WeChatUser">
                        <img v-if="WeChatUser.externalHeadImgUrl" :src="WeChatUser.externalHeadImgUrl" />
                        <img
                            v-else
                            :src='defaultAvatar'
                        />
                        <b>{{WeChatUser.externalName}}</b>
                    </span>
                    <span class="pd-left">
                        <i v-show="WeChatUser" class="iconfont iconxingzhuangjiehe isbind"></i>
                        <i v-show="!WeChatUser" class="iconfont iconicon-exclamationmark notbind"></i>
                        <div
                            class="bind"
                            :class="WeChatUser?'isbind':'notbind'"
                        >{{WeChatUser?"已绑定":"未绑定"}}</div>|
                        <button v-if="WeChatUser" @click="_untyingWeixin(WeChatUser.provider)">解绑</button>
                        <button v-else @click="_bindingWeixin()">绑定</button>
                    </span>
                </div>
            </li>
            <!-- <li class="dingtalk">
                <div>
                    <span class="set-name">绑定钉钉</span>
                    <span class="social-desc">绑定钉钉，可使用钉钉登录管理平台</span>
                </div>
                <div>
                    <span class="user-value" v-if="DingDingUser">
                        <img v-if="DingDingUser.headImgUrl" :src="DingDingUser.headImgUrl" />
                        <img
                            v-else
                            :src='defaultAvatar'
                        />
                        <b>{{DingDingUser.externalName}}</b>
                    </span>
                    <span class="pd-left">
                        <button
                            class="bind"
                            :class="DingDingUser?'isbind':'notbind'"
                        >{{DingDingUser?"已绑定":"未绑定"}}</button>|
                        <button v-if="DingDingUser" @click="_untyingDing(DingDingUser.provider)">解绑</button>
                        <button v-else @click="_bindingDing()">绑定</button>
                    </span>
                </div>
            </li> -->
            <li class="alipay">
                <div class="left-wrap">
                    <i class="iconfont iconzhifubao"></i>
                    <span class="set-name">绑定支付宝</span>
                    <span class="social-desc">绑定支付宝，可使用支付宝登录管理平台</span>
                </div>
                <div class="right-wrap">
                    <span class="user-value" v-if="AlipayUser">
                        <img v-if="AlipayUser.externalHeadImgUrl" :src="AlipayUser.externalHeadImgUrl" />
                        <img
                            v-else
                            :src='defaultAvatar'
                        />
                        <b>{{AlipayUser.externalName}}</b>
                    </span>
                    <span class="pd-left">
                        <i v-show="AlipayUser" class="iconfont iconxingzhuangjiehe isbind"></i>
                        <i v-show="!AlipayUser" class="iconfont iconicon-exclamationmark notbind"></i>
                        <div
                            class="bind"
                            :class="AlipayUser?'isbind':'notbind'"
                        >{{AlipayUser?'已绑定':'未绑定'}}</div>|
                        <button v-if="AlipayUser" @click="_untyingAlipay(AlipayUser.provider)">解绑</button>
                        <button v-else @click="_bindingAlipay()">绑定</button>
                    </span>
                </div>
            </li>
        </ul>
        <el-dialog
            width="0"
            :close-on-click-modal="false"
            :show-close="false"
            :append-to-body="false"
            :visible.sync="$store.state.isRightPanelShow || $store.state.isInvitationPanelShow"
        >
            <right-pannel :style="{width:pannelWidth+'px'}">
                <span slot="title-text">{{titText}}</span>
                  <component
                    v-if="$store.state.isRightPanelShow || $store.state.isInvitationPanelShow"
                    :is="curComponent"
                    :sourcePhone="userInfo.phoneNumber"
                    :provider="CurrentProvider"
                    :imageUrl="userInfo.userHeadUrl"
                    :defaultAvatarHeadUrl="defaultAvatarHeadUrl"
                    :isSetPassWord="userInfo.isSetPassWord"
                    @setPwdTitleAndBtn="_setPwdTitleAndBtn"
                    @removeExternalUserAsync="_removeExternalUserAsync"
                    @updateWeiXinHtml="updateWeiXinHtml"
                    @getUserProfileAsync="_getUserProfileAsync"
                    @getExternalUserAsync="_getExternalUserAsync"
                    :weixinHtml="weixinHtml"
                    :WeChatJsLoginParams="WeChatJsLoginParams"
                ></component>
            </right-pannel>
        </el-dialog>
        <!-- <el-dialog
            title="提示"
            :visible.sync="alipayBindTip"
            width="30%"
            @close="alipayBindHandleClose"
        >
            <span>支付宝绑定完成</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="alipayBindTip = false">确 定</el-button>
            </span>
        </el-dialog>-->
    </div>
</template>
<script>
import RightPannel from "_c/RightPannel";
import SetAvatar from "./SetAvatar";
import SetPhoneNumber from "./SetPhoneNumber";
import SetPwd from "./SetPwd";
import BindingWeChat from "./BindingWeChat";
import UntyingWeChat from "./UntyingWeChat";
import GetSms from "./GetSms";
import { mapState, mapMutations, mapGetters } from "vuex";
import securityService from "@/services/authentication/securityService";
import {
    getUserProfile,
    getExternalUserInfo,
    removeExternalUser,
    getWeChatJsLoginParams,
    formatDateTime,
    getAlipayBindUrl
} from "@/api/index.js";
import { updateUserName } from "@/api/index.js";
import { picUrlHangZhou } from "@/environment/index";
export default {
    data() {
        return {
            defaultAvatar: require("../../assets/defualtAvatar.png"),
            input: "",
            flag: true,
            userInfo: { phoneNumber: "" },
            curComponent: "",
            titText: "修改手机号",
            ExternalUsers: null,
            WeChatUser: null,
            AlipayUser: null,
            DingDingUser: null,
            WeChatJsLoginParams: null,
            CurrentProvider: "",
            weixinHtml: "",
            createTime: "",
            defaultAvatarHeadUrl: false,
            // alipayBindTip: false,
            pwdTitle: "0",
            pwdBtn: "设置"
        };
    },
    components: {
        RightPannel,
        SetPhoneNumber,
        UntyingWeChat,
        BindingWeChat,
        SetPhoneNumber,
        SetPwd,
        SetAvatar
    },
    created() {
        this._getUserProfileAsync();
        this._getExternalUserAsync();
        this._getWeChatJsLoginParams();
    },
    /* 局部过滤器 */
    filters: {
        geTel(tel) {
            var reg = /^(\d{3})\d{4}(\d{4})$/;
            return tel.replace(reg, "$1****$2");
        }
    },
    methods: {
        ...mapMutations(["ISRIGHTPANNELSHOW"]),
        _setPwdTitleAndBtn() {
            this.pwdTitle = "1";
            this.pwdBtn = "修改";
            this.userInfo.isSetPassWord = true;
            this.is
        },
        async _getUserProfileAsync() {
            console.log('grandfather');
            let { data } = await getUserProfile();
            this.userInfo = data;
            this.input = data.displayName;
            this.oldUserName = data.displayName;
            this.createTime = formatDateTime(
                data.createTime,
                "yyyy-MM-dd hh:mm"
            );
            if (this.userInfo.isSetPassWord) {
                this._setPwdTitleAndBtn();
            }
            if (!data.userHeadUrl) {
                this.defaultAvatarHeadUrl = true;
                this.userInfo.userHeadUrl = this.defaultAvatar;
            } else {
                this.defaultAvatarHeadUrl = false;
            }
            // console.log(this.userInfo)
        },
        async _getExternalUserAsync() {
            this.WeChatUser = null;
            this.AlipayUser = null;
            this.DingDingUser = null;
            let { data } = await getExternalUserInfo();
            this.ExternalUsers = data;
            if (this.ExternalUsers && this.ExternalUsers.length > 0) {
                this.ExternalUsers.forEach(element => {
                    // if (
                    //     element != null &&
                    //     (element.headImgUrl == null ||
                    //         element.headImgUrl.length < 1)
                    // ) {
                    //     element.headImgUrl = this.defaultAvatar;
                    // }
                    if (element.provider == "Weixin") {
                        this.WeChatUser = element;
                    } else if (element.provider == "Alipay") {
                        this.AlipayUser = element;
                    } else if (element.provider == "DingDing") {
                        this.DingDingUser = element;
                    }
                });
            }
        },
        //获取微信Js相关参数
        async _getWeChatJsLoginParams() {
            let { data } = await getWeChatJsLoginParams();
            this.WeChatJsLoginParams = data;
        },
        //解绑第三方账号
        async _removeExternalUserAsync(provider) {
            let { data } = await removeExternalUser(provider);
            if (data != undefined && (data == "true" || data == true)) {
                 this.$notify({
                    customClass: "notify-success",
                    message: `解绑成功!`,
                    showClose: false,
                    duration: 1500
                });
                this.ISRIGHTPANNELSHOW(false);
                this._getExternalUserAsync();
            } else {
                 this.$notify({
                    customClass: "notify-error",
                    message: `解绑失败!`,
                    showClose: false,
                    duration: 1500
                });
            }
        },

        modifyAvatar() {
            this.curComponent = SetAvatar;
            this.titText = "修改头像";
            this.ISRIGHTPANNELSHOW(true);
        },
        updateWeiXinHtml() {
            this.weixinHtml = "绑定微信" + new Date();
            this._getExternalUserAsync();
        },
        // 修改手机号
        modifiPhoneNum() {
            this.titText = "修改手机号";
            this.curComponent = SetPhoneNumber;
            this.ISRIGHTPANNELSHOW(true);
        },
        //修改密码||设置密码
        modifiPwd() {
            this.curComponent = SetPwd;
            if (this.userInfo.isSetPassWord) {
                this.titText = "修改密码";
            } else {
                this.titText = "设置密码";
            }
            this.ISRIGHTPANNELSHOW(true);
        },

        // 解绑微信
        _untyingWeixin(provider) {
            this.titText = "微信解绑";
            this.CurrentProvider = provider;
            this.curComponent = UntyingWeChat;
            this.ISRIGHTPANNELSHOW(true);
        },
        //绑定微信
        _bindingWeixin() {
            this.titText = "绑定微信";
            this.weixinHtml = "绑定微信" + new Date();
            this.CurrentProvider = "Weixin";
            this.curComponent = BindingWeChat;
            this.ISRIGHTPANNELSHOW(true);
        },
        //钉钉 解绑
        _untyingDing(provider) {
            this.titText = "钉钉解绑";
            this.CurrentProvider = provider;
            //this.curComponent = UntyingWeChat;
            this.ISRIGHTPANNELSHOW(true);
        },
        //钉钉 绑定
        _bindingDing() {
            this.titText = "绑定钉钉";
            this.CurrentProvider = "Dingding";
        },
        //支付宝 解绑
        _untyingAlipay(provider) {
            this.titText = "支付宝解绑";
            this.CurrentProvider = provider;
            this.curComponent = UntyingWeChat;
            this.ISRIGHTPANNELSHOW(true);
        },
        //支付宝 绑定
        async _bindingAlipay() {
            this.titText = "绑定支付宝";
            this.CurrentProvider = "Alipay";

            this.$confirm("支付宝绑定完成", "提示", {
                showCancelButton: false, // 是否显示取消按钮
                iconClass: "icon-success", // 自定义图标
                callback: async action => {
                    if (action === "confirm") {
                        this._getExternalUserAsync();
                    }
                }
            });
            let result = await getAlipayBindUrl();
            if (result != undefined && result.data)
                window.open(result.data, "_blank");
        },
        setName() {
            this.flag = false;
        },
        // 修改名称
        async blur() {
            this.flag = true;
            let { status } = await updateUserName(this.input);
            if (status === 200) {
                this.$notify({
                    customClass: "notify-success",
                    message: `设置成功!`,
                    showClose: false,
                    duration: 1500
                });
                this.oldUserName = this.input;
                this.$store.dispatch("_getAppHeadInfo");
            } else {
                 this.$notify({
                    customClass: "notify-error",
                    message: `设置失败!`,
                    showClose: false,
                    duration: 1500
                });
            }
        },
        // 取消修改名称
        cancelSetName() {
            this.input = this.oldUserName;
            this.flag = true;
        },
        modifyAvatar() {
            this.curComponent = SetAvatar;
            this.titText = "修改头像";
            this.ISRIGHTPANNELSHOW(true);
        },
        async alipayBindHandleClose() {
            await this._getExternalUserAsync();
        }
    },
    computed: {
        pannelWidth() {
            return this.$store.state.isRightPanelShow === true ? 470 : 0;
        }
    }
};
</script>

<style scoped>
.el-input /deep/ .el-input__inner {
    padding-right: 60px;
}
</style>

<style lang="scss" scoped>
.personal {
    padding: 24px 16px;
    .personal-title {
        border-left: 2px solid $--color-primary;
        padding-left: 8px;
        font-size: $--font-size-base;
        font-weight: 700;
    }
    .user-account {
        background: #fff;
        display: flex;
        align-items: center;
        padding: 32px;
        margin: 24px 0 16px;
        border: $--border-base;
        background-image: url("~img/personal/background.png");
        background-repeat: no-repeat;
        background-position: right;
        background-size: 750px;
        .avatar {
            float: left;
            width: 100px;
            height: 100px;
            position: relative;
            overflow: hidden;
            border-radius: 50%;
            img {
                width: 100%;
                height: 100%;
            }
            .modify-avatar {
                cursor: pointer;
                display: none;
                position: absolute;
                left: 0;
                bottom: 0;
                background: #262626;
                opacity: 0.6;
                color: #fff;
                padding: 5px;
                width: 100%;
                text-align: center;
                box-sizing: border-box;
            }
            &:hover .modify-avatar {
                display: block;
            }
        }
        .account-info {
            float: left;
            padding-left: 40px;
            p {
                font-size: 14px;
                line-height: 22px;
            }
            .user-name {
                display: flex;
                align-items: center;
                .name {
                    color: #262626;
                    font-size: 14px;
                    padding-left: 0;
                }
                > span {
                    cursor: pointer;
                    flex: none;
                    color: $--color-primary;
                    padding-left: 16px;
                }
            }
            .create-time {
                color: #8c8c8c;
                padding-top: 8px;
            }
            // p {
            //     height: 32px;
            //     line-height: 32px;
            // }
        }
    }
    .social-list {
        background: #fff;
        border: $--border-base;
        height: 460px;
        padding-top: 8px;
        li {
            padding: 0 32px;
            height: 50px;
            box-sizing: border-box;
            border-bottom: 1px solid #EBECED;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left-wrap{
                display: flex;
                align-items: center;
                .iconfont{
                    font-size: 20px;
                }
            }
            .right-wrap{
                display: flex;
                align-items: center;
                .user-value {
                    color: #8c8c8c;
                    display: flex;
                    align-items: center;
                    img {
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        vertical-align: top;
                        margin-right: 8px;
                    }
                }
            }
            .set-name {
                display: inline-block;
                width: 105px;
                font-size: $--font-size-small;
                color: $--color-text-primary;
                margin-left: 14px;
            }
        }

        .pd-left {
            padding-left: 40px;
            color: #eee;
            & :last-child {
                padding-left: 15px;
                color: #0895E6;
            }
            .bind {
                padding-right: 15px;
                padding-left: 10px;
                display: inline-block;
            }
            .notbind {
                color: $--color-danger;
            }
            .isbind {
                color: $--color-success;
            }
        }
        .social-desc {
            color: #8c8c8c;
        }
    }
}
</style>

