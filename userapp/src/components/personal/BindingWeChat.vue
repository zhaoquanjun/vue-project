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
            <button class="confirm footer-btn" @click="refqroce">刷新</button>
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
                "data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5Om5vbmV9Ci5pbXBvd2VyQm94IC5xcmNvZGUge3dpZHRoOiAyMjBweDt9Ci5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjIwcHg7fQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9Ci5pbXBvd2VyQm94IC5zdGF0dXMge3RleHQtYWxpZ246IGNlbnRlcjt9Ci5pbXBvd2VyQm94IC5pbmZvICN3eF9kZWZhdWx0X3RpcHtkaXNwbGF5Om5vbmU7fQouaW1wb3dlckJveCAuaW5mbyAuc3RhdHVzX3R4dCBwe2Rpc3BsYXk6bm9uZTt9"
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
                 this.$notify({
                        customClass: "notify-success", // error success
                        message: `绑定成功`,
                        duration: 1500,
                        showClose: false
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
                "data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5Om5vbmV9Ci5pbXBvd2VyQm94IC5xcmNvZGUge3dpZHRoOiAyMjBweDt9Ci5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjIwcHg7fQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9Ci5pbXBvd2VyQm94IC5zdGF0dXMge3RleHQtYWxpZ246IGNlbnRlcjt9Ci5pbXBvd2VyQm94IC5pbmZvICN3eF9kZWZhdWx0X3RpcHtkaXNwbGF5Om5vbmU7fQouaW1wb3dlckJveCAuaW5mbyAuc3RhdHVzX3R4dCBwe2Rpc3BsYXk6bm9uZTt9"
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
        width: 250px;
        line-height: 20px;
        font-size:14px;
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
