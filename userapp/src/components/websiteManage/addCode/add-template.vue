<template>
    <div class="add-template">
        <div class="template">
            <div class="header">
                <span class="title">添加模版</span>
                <i @click="closeAddTemplate" class="icon iconfont iconguanbi cl-iconfont is-circle"></i>
            </div>
            <div v-show="!step1" class="content">
                <div class="input">
                    <span>模版CODE</span>
                    <el-input v-model="codeValue" maxlength="20" placeholder="请输入内容"></el-input>
                </div>
                <a href="">申请模版</a>
            </div>
            <div v-show="step1" class="save">
                <div>
                    <span>模板CODE：</span>
                    <p>{{templateData.tempCode}}</p>
                </div>
                <div>
                    <span>模板名称：</span>
                    <p>{{templateData.tempName}}</p>
                </div>
                <div>
                    <span>模板类型：</span>
                    <p>{{templateData.templateType}}</p>
                </div>
                <div>
                    <span>模板内容：</span>
                    <p>{{templateData.tempContent}}</p>
                </div>
            </div>
            <div class="footer">
                <button 
                    v-if="!step1" 
                    class="cl-button cl-button--primary" 
                    :class="{'is-disabled':!(codeValue)}"
                    @click="goSave(2)"
                >下一步</button>
                <button v-if="!step1" class="cl-button cl-button--primary_notbg" @click="closeAddTemplate">取消</button>
                <button v-if="step1" class="cl-button cl-button--primary" @click="saveAddTemplate">保存</button>
                <button v-if="step1" class="cl-button cl-button--primary_notbg" @click="goSave(1)">上一步</button>
            </div>
        </div>
    </div>
</template>

<script>
    import * as dashboardApi from "@/api/request/dashboardApi";
    export default {
        props: {},
        data() {
            return {
                description: '',
                step1: false,
                siteId: this.$store.state.dashboard.siteId,
                codeValue: '',
                templateData: {
                    tempCode: '',
                    tempName:'',
                    siteId: '',
                    tempContent: ''
                }
            }
        },
        created() {
            
        },
        methods: {
            closeAddTemplate() {
                this.$emit('closeAddTemplate')
            },
            async saveAddTemplate() {
                let { data } = await dashboardApi.addCustomTemplate(this.codeValue);
                if(data) {
                    this.$emit('saveAddTemplate')
                }
            },
            async goSave(val){
                
                if(val === 2) {
                    let { data, status } = await dashboardApi.getTemplateDetail(this.codeValue);
                    if(data) {
                        this.templateData = data
                        this.step1 = true
                    }
                } else {
                    this.step1 = false 
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
.add-template {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background: rgba(38, 38, 38, 0.8);
    z-index: 2000;
    .template {
        position: relative;
        margin: 0 0 0 auto;
        height: 100%;
        min-height: 600px;
        width: 400px;
        padding: 10px 24px 16px;
        box-sizing: border-box;
        background: #ffffff;
        .header {
            display: flex;
            justify-content: space-between;
            border-bottom: $--border-base;
            span {
                font-size:$--font-size-base;
                color: $--color-text-primary;
                line-height:44px;
            }
            i {
                line-height: 14px;
                height: 14px;
                width: 14px;
            }
        }
        .content {
            .input {
                display: flex;
                justify-content: space-between;
                margin-top: 24px;
                span {
                    width: 80px;
                    line-height: 32px;
                }
            }
            a {
                cursor: pointer;
                display: inline-block;
                margin: 12px 0 0 80px;
                color: $--color-primary;
                font-size: $--font-size-small;

            }
        }
        .save {
            padding-top: 24px;
            div {
                font-size:$--font-size-small;
                color:$--color-text-primary;
                line-height:18px;
                margin-bottom: 16px;
                span {
                    float: left;
                    width: 80px;
                    text-align: right;
                }
                p {
                    margin-left: 80px;
                    line-height:18px;
                }
            }
        }
        .footer {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 64px;
            padding: 16px 0;
            border-top: $--border-base;
            box-sizing: border-box;
            width: calc(100% - 48px);
            margin: 0 24px;
        }
    }
}
</style>