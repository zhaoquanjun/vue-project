<template>
<div class="prev-template">
    <div class="prve-form">
        <iframe id="prve-iframe" name="myframe" class="prve-form" :src="src" ref="iframe"></iframe>
    </div>
    <button class="release" @click="release">应用此模版</button>
</div>
</template>
<script>
    import * as memberManageApi from "@/api/request/siteMemberApi";
    import * as templateApi from "@/api/request/templateApi";
    import { designerUrl } from "@/environment/index";
    export default {
        name: "members-site",
        data() {
            return {
                item: this.$route.query,
                src: ''
            }
        },
        created(){
            this.src = `http://${this.item.Domain}/prev/showtemplate/?flag=pc`
        },
        methods: {
            async release(){
                let para ={
                    CurrentSiteId: this.item.CurrentSiteId,
                    SiteName: this.item.SiteName,
                    SecondDomain: this.item.Domain,
                    TemplateId: this.item.TemplateId,
                    TemplateSiteId: this.item.TemplateSiteId
                }
                let  {status} =  await templateApi.UseTemplateWithTheme(para);
                if (status == 200) {
                    this.$notify({
                        customClass: "notify-success",
                        message: `应用模版成功`,
                        duration: 1500,
                        showClose: false
                    });
                }
                setTimeout(()=>{
                    window.location.href = `${designerUrl}?siteId=${this.item.CurrentSiteId}`;
                },2000)
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