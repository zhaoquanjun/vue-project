<template>
    <div class="reply">
      
        <div>
            <slot name="keyword"></slot>
        </div>
          <header class="reply-title">
            <span>回复内容</span>
            <span>（内容三选一）</span>
        </header>
      
            <section class="reply-content">
            <div class="radio-tabs">
                <el-radio-group v-model="radio" @change="changeHandler">
                    <el-radio :label="1">图片</el-radio>
                    <el-radio :label="2">文字</el-radio>
                    <el-radio :label="3">图文</el-radio>
                </el-radio-group>
            </div>
            <div class="slot-content" :class="picture">
                <div class="slot-item">
                    <slot></slot>
                </div>
            </div>
        </section>
      
        <footer class="footer-btn">
            <button class="handler-item" @click="handlerSave">保存</button>
            <button class="handler-item handler-delete" :class="{'disabled-btn':!isSet}" @click="handlerDelete" :disabled="!isSet">删除回复</button>
        </footer>
    </div>
</template>
<script>
export default {
    props: ["isPicture","isSet","msgType"],
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
.el-radio-group .el-radio {
    margin-right: 119px;
}
</style>
<style lang="scss" scoped>
.reply {
    .reply-title {
        // font-size: 16px;
        // font-weight: 500;
        line-height: 22px;
        padding-bottom: 24px;
        :last-child{
            font-size: 14px;
            color: #B9CBCF;
            font-weight: 400;
            padding-left: 12px;
        }
    }
    .reply-content {
        min-height: 444px;
        border: 1px solid #e5e5e5;
        border-radius: 2px;
        .radio-tabs {
            padding: 26px 50px;
            border-bottom: 1px solid #e5e5e5;
        }
        .slot-content {
            min-height: 373px;
            overflow: auto;
            height: 373px;
        }
        .picture {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
.footer-btn {
    padding-top: 25px;
    button {
        width: 90px;
        height: 40px;
        background: rgba(9, 204, 235, 1);
        color: #fff;
    }
    :first-child {
        margin-right: 24px;
        border: 1px solid transparent;
    }
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