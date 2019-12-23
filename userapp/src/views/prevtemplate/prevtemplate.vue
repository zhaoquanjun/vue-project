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
            this.src = `http://${this.item.Domain}/prev/showtemplate/?flag=${this.item.flag}`
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
                    // this.$notify({
                    //     customClass: "notify-success",
                    //     message: `应用模版成功`,
                    //     duration: 1500,
                    //     showClose: false
                    // });  
                    if (this.item.isChangeTemplate) {
                        this.$confirm(
                        `更换模版会替换现有的设计界面，您确认要切换吗？`,
                        "提示",
                        {
                            iconClass: "icon-warning",
                            callback: async action => {
                                if (action === "confirm") {
                                    this.choseTemplate(this.item);
                                    // setTimeout(()=>{
                                    //     window.location.href = `${designerUrl}?siteId=${this.item.CurrentSiteId}`;
                                    // },2000)
                                } else {
                                    return;
                                }
                            }
                        }
                        );
                    } else {
                        this.choseTemplate(this.item);
                    }
                }
            },
            // 选择模版
            async choseTemplate(item) {
                const loading = this.$loading({
                    lock: true,
                    text: "正在复制模版",
                    spinner: "copy-icon",
                    customClass: "copyTemplateLoading",
                    background: "rgba(0, 0, 0, 0.5)"
                });
                try {
                    if (this.isAllTab == false) {
                    let para = {
                        currentSiteId: this.item.CurrentSiteId,
                        templateSiteId: this.item.TemplateSiteId,
                        siteName: this.item.SiteName,
                        imageUrl: this.item.image,
                        templateId: this.item.TemplateId
                    };
                    var { status } = await templateApi.updateSiteWithTemplate(para);
                    } else {
                    let para = {
                        TemplateId: this.item.TemplateId,
                        CurrentSiteId: this.item.CurrentSiteId,
                        TemplateSiteId: this.item.TemplateSiteId,
                        SiteName: this.item.SiteName
                    };
                    var { status } = await templateApi.updateSiteTemplate(para);
                    }
                    if (status == 200) {
                    loading.close();
                    this.$confirm(
                        `您已选择${this.item.templateName}模板，是否立即开始设计？`,
                        "提示",
                        {
                        confirmButtonText: "开始设计",
                        cancelButtonText: "暂不设计",
                        iconClass: "icon-success"
                        }
                    )
                        .then(() => {
                        window.location.href = `${designerUrl}?siteId=${this.item.CurrentSiteId}`;
                        })
                        .catch(action => {
                        if (action == "cancel") {
                            this.templateShow = false;
                            if (this.$route.path == "/website/selectTemplate") {
                            this.$router.push({
                                path: "/website/mysite/siteinfo"
                            });
                            }
                            this.$emit("getSiteInfo", this.item.TemplateSiteId);
                            this.$emit("getTodoInfo", this.item.TemplateSiteId);
                        }
                        });
                    }
                } catch {
                    loading.close();
                    this.$notify({
                    customClass: "notify-error",
                    message: `模版复制失败，请稍后重试`,
                    duration: 1500,
                    showClose: false
                    });
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