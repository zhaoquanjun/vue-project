<template>
    <div class="set-phone-number">
        <el-row class="demo-autocomplete"></el-row>
        <el-alert title="绑定微信，可使用微信登陆管理平台" type="success"></el-alert>
        <div class="from-row">
            <div id="weixin" style="text-align: center">{{this.weixinHtml}}</div>
        </div>  
        <div class="footer">
            <button class="cancel footer-btn" @click="refqroce">刷新</button>
            <button class="cancel footer-btn" @click="close">取消</button>
         </div>
    </div>

</template>
<script>
export default {
    props: ["weixinHtml","weChatJsLogin"],
    mounted(){    
       var obj = new WxLogin({
            self_redirect: true,
            id: "weixin",
            appid: this.weChatJsLogin.appId,
            scope: "snsapi_login,snsapi_userinfo",
            redirect_uri: this.weChatJsLogin.redirectUri,
            state: this.weChatJsLogin.state,
            style: "",
            href: "data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5Om5vbmV9DQouaW1wb3dlckJveCAucXJjb2RlIHt3aWR0aDogMjIwcHg7fQ0KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMjBweDt9DQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9DQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7fQ=="
        });
    },
     methods: {       
        close() { 
            this.$store.commit("CLOSERIGHTPANNEL", false);
        },
        refqroce(){
            this.$emit('updateWeiXinHtml');
        }
     },
    updated(){
        //清空数据，并重新绑定
        document.getElementById("weixin").innerHTML="";
        var obj = new WxLogin({
            self_redirect: true,
            id: "weixin",
            appid: this.weChatJsLogin.appId,
            scope: "snsapi_login,snsapi_userinfo",
            redirect_uri: this.weChatJsLogin.redirectUri,
            state: this.weChatJsLogin.state,
            style: "",
            href: "data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5Om5vbmV9DQouaW1wb3dlckJveCAucXJjb2RlIHt3aWR0aDogMjIwcHg7fQ0KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMjBweDt9DQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9DQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7fQ=="
        });
    },
}
</script>
<style lang="scss" scoped>
.from-row {
    margin-top: 30px;
}

.footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 15px 17px;
    border-top: 1px solid #efefef;
    .footer-btn {
        width: 63px;
        height: 32px;
        background: rgba(0, 193, 222, 1);
        color: #fff;
    }
    .cancel {
        margin-left: 20px;
        background: #fff;
        border: 1px solid rgba(0, 193, 222, 1);
        color: rgba(0, 193, 222, 1);
    }
}
</style>
</style>