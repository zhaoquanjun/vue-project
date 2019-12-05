<template>
    <div class="reply">
        <div>
            <slot name="keyword"></slot>
        </div>
            <section class="reply-content clear">
            <ul class="radio-tabs">
                <li @click="changeHandler(1)" :class="{active: radio == 1}">
                <i class="icon iconfont iconicon-tupian"></i>
                <span>图片</span>
                </li>
                <li @click="changeHandler(2)" :class="{active: radio == 2}">
                <i class="icon iconfont iconicon-wenzi"></i>
                <span>文字</span>
                </li>
                <li @click="changeHandler(3)" :class="{active: radio == 3}">
                <i class="icon iconfont iconicon-tuwen"></i>
                <span>图文</span>
                </li>
            </ul>
            <div class="slot-content" :class="picture">
                <div class="slot-item">
                    <slot></slot>
                </div>
            </div>
        </section>
        <footer class="footer-btn">
            <button class="cl-button cl-button--primary cl-button--small" @click="handlerSave">保存</button>
            <button v-if="replyType == '3'" class="cl-button cl-button--small cl-button--primary_notbg" @click="handlerCancel">取消</button>
            <button v-else class="cl-button cl-button--primary_notbg" :class="{'is-disabled':!isSet}" @click="handlerDelete" :disabled="!isSet">删除回复</button>
        </footer>
    </div>
</template>
<script>
export default {
    props: ["isPicture","isSet","msgType","replyType"],
    data() {
        return {
            radio: 1
        };
    },
    mounted(){
        this.radio = this.msgType
    },
    methods: {
        changeHandler(value) {
            this.$emit("changeAnswerMode", value);
        },
        handlerSave(){
            this.$emit("handlerSave")
        },
        handlerCancel(){
            console.log('quxiao')
            this.$emit("handlerCancel")
        },
        handlerDelete(){
            this.$emit("handlerDelete")
        }
    },
    computed: {
        picture() {
            console.log(this.isPicture)
            return !!this.isPicture && "picture";
        }
    },
    watch:{
        msgType(){
            this.radio = this.msgType
        }
    }
};
</script>
<style scoped>
.textarea /deep/ .el-textarea__inner {
    height: 400px !important;
    border: none;
    padding: 16px 16px;
}
</style>
<style scoped>
.el-radio-group .el-radio {
    margin-right: 119px;
}
</style>
<style lang="scss" scoped>
.reply {
    .reply-content {
        height: 372px;
        border: 1px solid #e5e5e5;
        border-radius: $--border-radius-base;
        .radio-tabs {
            height: 40px;
            background:rgba(240,243,247,1);
            border-radius:1px 1px 0px 0px;
            li {
                float: left;
                font-size:$--font-size-small;
                font-weight:400;
                color:rgba(38,38,38,1);
                line-height:40px;
                padding: 0 15px 0 24px;
                cursor: pointer;
                i {
                    font-size: 12px;
                    margin-right: 8px;
                }
                &.active {
                    color:  $--color-primary;
                    i {
                        color:  $--color-primary;
                    }
                }
            }
        }
        .slot-content {
            float: left;
            height: 330px;
            width: 100%;
            background: #fff;
            overflow: auto;
        }
        .picture {
            display: flex;
            justify-content: center;
        }
    }
}
.footer-btn {
    padding: 16px 24px;
    // button {
    //     width: 90px;
    //     height: 32px;
    //     background: rgba(9, 204, 235, 1);
    //     color: #fff;
    // }
    .handler-delete {
        border: 1px solid rgba(9, 204, 235, 1);
        background: #fff;
        color: #09cceb;
    }
    .disabled-btn{
        border: 1px solid transparent;
        background: rgba(9, 204, 235, 0.5);
        color: #fff;

    }
}
</style>