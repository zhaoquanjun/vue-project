<template>
    <div class="add-autograph">
        <div class="autograph">
            <div class="header">
                <span class="title">添加签名</span>
                <i @click="closeAddAutograph" class="icon iconfont iconguanbi cl-iconfont is-circle"></i>
            </div>
            <div class="content">
                <div class="input">
                    <span>短信签名</span>
                    <el-input v-model="codeValue" maxlength="20" placeholder="请输入内容"></el-input>
                </div>
                <a href="">申请签名</a>
            </div>
            <div class="footer">
                <button class="cl-button cl-button--primary" @click="saveAddAutograph" :class="{'is-disabled':!(codeValue)}">保存</button>
                <button class="cl-button cl-button--primary_notbg" @click="closeAddAutograph">取消</button>
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
                siteId: this.$store.state.dashboard.siteId,
                codeValue: ''
            }
        },
        created() {
            
        },
        methods: {
            closeAddAutograph() {
                this.codeValue= ''
                this.$emit('closeAddAutograph')
            },
            async saveAddAutograph() {
                let { data } = await dashboardApi.createSiteSMSSign(this.siteId,this.codeValue);
                    if(data){
                        this.$notify({
                            customClass: "notify-success", // error success
                            message: `添加成功`,
                            duration: 1500,
                            showClose: false
                        });
                        this.$emit('saveAddAutograph')
                    }else {
                        this.$notify({
                            customClass: "error", // error success
                            message: `添加失败`,
                            duration: 1500,
                            showClose: false
                        });
                        this.$emit('saveAddAutograph')
                    }
            }
        }
    };
</script>

<style lang="scss" scoped>
.add-autograph {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background: rgba(38, 38, 38, 0.8);
    z-index: 2000;
    .autograph {
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
                display: inline-block;
                margin: 12px 0 0 80px;
                color: $--color-primary;
                font-size: $--font-size-small;

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