<template>
    <div class="personal">
        <h3>个人账号管理</h3>
        <dl class="user-account clear">
            <dt class="avatar">
                <img src="../../assets/avatar.jpeg" alt>
            </dt>
            <dd class="account-info">
                <p>
                    <span v-if="flag">
                        {{input!=''? input : '设置您的名字'}}
                        <i @click="setName" class="el-icon-edit"></i>
                    </span>
                    <el-input
                        @blur="blur"
                        v-else
                        maxlength="20"
                        size="small"
                        v-model="input"
                        placeholder="请输入内容"
                    ></el-input>
                </p>
                <p>
                    创建时间
                    <i>{{userInfo.createTime}}</i>
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
                        <b>绑定邮箱</b>
                    </span>
                    <span
                        class="pd-left social-desc"
                    >绑定邮箱可用于接收系统发送给您的各种通知</span>
                </div>
                <div class="fright">
                    <span>13011011746</span>

                    <span class="pd-left">
                        <button>已绑定</button> |
                        <button @click="modifiEmail">修改</button>
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
                    <span>13011011746</span>

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
                    <span>13011011746</span>

                    <span class="pd-left">
                        <button>已绑定</button> |
                        <button @click="modifiWeixin">修改</button>
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
                    <span>13011011746</span>

                    <span class="pd-left">
                        <button>已绑定</button> |
                        <button @click="modifiDing">修改</button>
                    </span>
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
                    <span>13011011746</span>

                    <span class="pd-left">
                        <button>已绑定</button> |
                        <button @click="modifAlipay">修改</button>
                    </span>
                </div>
            </li>
        </ul>
        <right-pannel :style="{width:pannelWidth+'px'}">
            <span slot="title-text">{{titText}}</span>
             <component :is="curComponent" :sourcePhone="userInfo.phoneNumber"></component>
        </right-pannel>
         <el-dialog
                width="0"
                style="z-index:10"
                :close-on-click-modal="false"
                :show-close="false"
                :visible.sync="$store.state.isRightPanelShow || $store.state.isInvitationPanelShow"
                

            ></el-dialog>
    </div>
</template>
<script>

import RightPannel from "../RightPannel";
import SetPhoneNumber from "./SetPhoneNumber";
import GetSms from "./GetSms";
import { mapState,mapMutations, mapGetters } from "vuex";
import securityService from "@/services/authentication/securityService";
import { getUserProfile } from "@/api/index.js"; 
import { updateUserName } from "@/api/index.js";

    export default {
        data() {
            return {
                input: "",
                flag: true,
                userInfo: {},
                curComponent: "",
                titText: "手机号修改",
            };
        },
        components: {
            RightPannel,
            SetPhoneNumber
        },
        created() {
            this._getUserProfileAsync();
        },
        methods: {
            ...mapMutations(["ISRIGHTPANNELSHOW"]),
            async _getUserProfileAsync() {
                let { data } = await getUserProfile();
                this.userInfo = data;
                this.input = data.displayName;
                console.log(this.userInfo)
            },
            // 修改手机号
            modifiPhoneNum() {
                this.curComponent = SetPhoneNumber;
                this.ISRIGHTPANNELSHOW(true)
            },
            //修改邮箱
            modifiEmail() { },
            //修改密码
            modifiPwd() { },
            // 微信操作
            modifiWeixin() { },
            //钉钉操作
            modifiDing() { },
            //支付宝操作
            modifAlipay() { },
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

