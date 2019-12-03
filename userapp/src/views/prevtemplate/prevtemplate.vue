<template>
<div class="prev-template">
    <div class="prve-form">
        <iframe id="prve-iframe" name="myframe" class="prve-form" :src="src" ref="iframe"></iframe>
    </div>
    <button class="release" @click="release">应用模版</button>
</div>
</template>
<script>
    import * as memberManageApi from "@/api/request/siteMemberApi";
    export default {
        name: "members-site",
        data() {
            return {
                src: ''
            }
        },
        created(){
            this.src = `http://${this.$route.query.domain}/prev/showtemplate/?flag=pc`
        },
        methods: {
            //deviceswitch
            release(){
                var iframe = document.getElementById("prve-iframe")

               
            // var iframeWindow = document.getElementById('prve-iframe').contentWindow;
            // iframeWindow.postMessage(msg, "http://localhost:63342/HelloHBuilder/html2/onmessage.html");
                
                var temp = parent.window.frames["myframe"].document.getElementById("deviceswitch").innerHRML;
                console.log('iframe:',iframe.contentWindow)
                console.log('temp:',temp)

                // let b =iframe.src;
                // console.log('44:',b)
            }
           
        }
    };
</script>
<style lang="scss" scoped>
    .prev-template {
        position: relative;
        width: 100%;
        height: 100%;
        .prve-form {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            background: #fff;
        }
        .release {
            position: fixed;
            top: 10px;
            right: 24px;
            z-index: 2001;
            width: 90px;
            height: 32px;
            border-radius: 2px;
            color: #fff;
            background: $--color-primary;
            cursor: pointer;
        }
    }
</style>