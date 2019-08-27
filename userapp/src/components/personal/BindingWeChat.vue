<template>
    <div class="set-pernal-info">
        <div class="modify-title">
            <p>绑定微信，可使用微信登录管理平台</p>
        </div>
        <div class="from-row">
            <div class="qrcode" id="weixin" style="text-align: center">{{weixinHtml}}</div>
            <div id="weixinTip" class="wechatTip" v-if="bindResultMessage">{{bindResultMessage}}</div>
        </div>
        <div class="footer pannel-footer">
            <button class="cancel footer-btn" @click="refqroce">刷新</button>
            <button class="cancel footer-btn" @click="close">取消</button>
        </div>
    </div>
</template>
<script>
export default {
    props: ["weixinHtml", "WeChatJsLoginParams"],
    data() {
        return {
            bindResultMessage: null
        };
    },
    mounted() {
        var obj = new WxLogin({
            self_redirect: true,
            id: "weixin",
            appid: this.WeChatJsLoginParams.appId,
            scope: "snsapi_login,snsapi_userinfo",
            redirect_uri: this.WeChatJsLoginParams.redirectUri,
            state: this.WeChatJsLoginParams.state,
            style: "",
            href:
                "data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5Om5vbmV9DQouaW1wb3dlckJveCAucXJjb2RlIHt3aWR0aDogMjIwcHg7fQ0KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMjBweDt9DQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9DQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7fQ=="
        });
    },
    created() {
        window.addEventListener("message", e => {
            let data = e.data;
            this._bindResult(data);
        });
    },
    methods: {
        close() {
            this.$store.commit("CLOSERIGHTPANNEL", false);
        },
        refqroce() {
            this.$emit("updateWeiXinHtml");
        },
        _bindResult(data) {
            if (data.result == "True") {
                this.bindResultMessage = null;
                this.$store.commit("CLOSERIGHTPANNEL", false);
                this.$message({
                    type: "success",
                    message: "绑定成功!"
                });
                this.$emit("getExternalUserAsync");
            } else if (data.result == "False") {
                this.bindResultMessage = data.message;
                this.refqroce();
            }
        }
    },
    updated() {
        //清空数据，并重新绑定
        document.getElementById("weixin").innerHTML = "";

        var obj = new WxLogin({
            self_redirect: true,
            id: "weixin",
            appid: this.WeChatJsLoginParams.appId,
            scope: "snsapi_login,snsapi_userinfo",
            redirect_uri: this.WeChatJsLoginParams.redirectUri,
            state: this.WeChatJsLoginParams.state,
            style: "",
            href:
                "data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5Om5vbmV9DQouaW1wb3dlckJveCAucXJjb2RlIHt3aWR0aDogMjIwcHg7fQ0KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMjBweDt9DQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9DQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7fQ=="
        });
    },
    computed: {
        pannelShow() {
            return this.$store.state.isRightPanelShow;
        }
    },
    watch: {
        pannelShow() {
            this.bindResultMessage = null;
        }
    }
};
</script>
<style lang="scss" scoped>
@import "./style/personal";
.set-pernal-info {
    padding: 32px;
    .qrcode {
        height: 300px;
    }
    .wechatTip {
        text-align: left;
        width: 200px;
        line-height: 20px;
        margin: 0 auto;
        &::before {
            display: inline-block;
            content: "";
            width: 12px;
            height: 12px;
            margin-right: 8px;
            vertical-align: -1px;
            background: url("~img/personal/wraning.png") no-repeat center;
            background-size: contain;
        }
    }
}
.from-row {
    margin-top: 30px;
}


</style>
