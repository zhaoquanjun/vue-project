<template>
    <div class="edit">
        <div class="code">
            <div class="title">
                <span>会员详情</span>
                <i @click="close(flase)" class="icon iconfont iconguanbi cl-iconfont is-circle"></i>
            </div>
            <div class="header">
                <img :src="memberDetail.headImg" alt="">
                <p><span>用户名：</span><b>{{memberDetail.mobile}}</b></p>
                <p><span>注册时间：</span><b>{{memberDetail.createTimePrt}}</b></p>
                <p><span>注册来源：</span><b>{{memberDetail.siteName}}</b></p>
                <p><span>最近登录时间：</span><b>{{memberDetail.lastLoginTimePrt}}</b></p>
            </div>
            <div class="content">
                <h6>会员类型</h6>
                <span class="type">注册会员</span>
            </div>
            <div class="content">
                <h6>备注</h6>
                <el-input class="textarea"
                          type="textarea"
                          rows="5"
                          v-model="memberDetail.remark"
                          placeholder="请输入内容"
                          maxlength="100"
                          show-word-limit
                          resize="none"></el-input>
            </div>
            <div class="btn">
                <button class="cl-button cl-button--primary cl-button--small" @click="save">保存</button>
                <button class="cl-button cl-button--primary_notbg cl-button--small" @click="close">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
    import * as memberManageApi from "@/api/request/siteMemberApi";
    export default {
        props: {
            vipId: {
                type: String
            },
            memberDetail: {
                type: Object
            }
        },
        data() {
            return {
                description: '',
            }
        },
        components: {
        },
        created() {
            this.init()
        },
        watch: {
            vipId() {
                this.init()
            },
        },
        methods: {
            init() {

            },
            close() {
                this.$emit('closeEdit')
            },
            async save() {
                let { status, data } = await memberManageApi.editMemberDetail(this.memberDetail);
                if (status === 200) {
                    this.$notify({
                        customClass: "notify-success", //  notify-success ||  notify-error
                        message: `保存成功!`,
                        showClose: false,
                        duration: 1000
                    });
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .edit {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background: rgba(38,38,38,0.8);
        text-align: right;
        font-family: "PingFangSC-Regular,PingFangSC";
        z-index: 3000;
        .code

    {
        position: relative;
        display: inline-block;
        width: 400px;
        height: 100%;
        background: white;
        .title

    {
        font-size: 14px;
        font-weight: 400;
        color: rgba(38,38,38,1);
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        padding: 20px 0 12px;
        margin: 0 24px;
        border-bottom: 1px solid #e5e5e5;
        i

    {
        cursor: pointer;
    }

    }

    .header {
        margin: 24px;
        height: 270px;
        background: $--background-color-selected;
        border-radius: 2px;
        padding: 28px 18px;
        img

    {
        display: block;
        width: 70px;
        height: 70px;
        margin: 0 auto 24px;
        border-radius: 50%;
        background: url('~img/defualtAvater.png') no-repeat center center;
        background-size: 100% 100%;
    }

    p {
        font-size: 14px;
        font-weight: 400;
        color: rgba(161,168,177,1);
        line-height: 20px;
        margin-left: 70px;
        text-align: left;
        margin-bottom: 12px;
        b

    {
        font-weight: 400;
        color: #262626;
    }

    }
    }

    .content {
        margin: 24px;
        h6

    {
        font-size: 14px;
        font-weight: 400;
        color: rgba(161,168,177,1);
        line-height: 20px;
        margin-bottom: 8px;
        text-align: left;
    }

    .type {
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
        height: 32px;
        background: rgba(255,255,255,1);
        border: 1px solid rgba(229, 229, 229, 1);
        border-radius: 2px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(38,38,38,1);
        line-height: 32px;
        padding: 0 16px;
        text-align: left;
        background: #e5e5e5;
    }

    }

    .btn {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 40px;
        box-sizing: content-box;
        width: 352px;
        padding: 20px 0;
        margin: 0 24px;
        border-top: 1px solid #e5e5e5;
        text-align: left;
    }
    }
    }
</style>