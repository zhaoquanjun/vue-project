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
    import { designerUrl, httpSchema } from "@/environment/index";
    export default {
        name: "members-site",
        data() {
            return {
                item: this.$route.query,
                src: ''
            }
        },
        created(){
            console.log("query",this.item.flag)
            this.src = `${httpSchema}${this.item.Domain}/prev/showtemplate/?flag=${this.item.flag}`
            console.log(this.src)
        },
        methods: {
            async release(){
                
                    if (this.item.isChangeTemplate) {
                        this.$confirm(
                        `更换模版会替换现有的设计界面，您确认要切换吗？`,
                        "提示",
                        {
                            iconClass: "icon-warning",
                            callback: async action => {
                                if (action === "confirm") {
                                    this.choseTemplate(this.item);
                                } else {
                                    return;
                                }
                            }
                        });
                    } 
            },
            // 选择模版
            async choseTemplate(item) {
                    let para ={
                        CurrentSiteId: this.item.CurrentSiteId,
                        SiteName: this.item.SiteName,
                        SecondDomain: this.item.Domain,
                        TemplateId: this.item.TemplateId,
                        TemplateSiteId: this.item.TemplateSiteId
                    }
                    let  {status} =  await templateApi.UseTemplateWithTheme(para);
                    if (status == 200) {
                        this.$confirm(
                            `您已选择${this.item.templateName}模板，是否立即开始设计？`,
                            "提示",
                                {
                                confirmButtonText: "开始设计",
                                cancelButtonText: "暂不设计",
                                iconClass: "icon-success",
                                callback: async action => {
                                        if (action === "confirm") {
                                            window.location.href = `${designerUrl}?siteId=${this.item.CurrentSiteId}`;
                                        } else {
                                            return;
                                        }
                                    }
                                }
                        )
                    }
                
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