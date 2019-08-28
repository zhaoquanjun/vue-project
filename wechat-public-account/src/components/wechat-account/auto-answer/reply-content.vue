<template>
    <div class="reply">
        <header class="reply-title">回复内容</header>
        <div>
            <slot name="keyword"></slot>
        </div>
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
            <button class="handler-item">保存</button>
            <button class="handler-item">删除</button>
        </footer>
    </div>
</template>
<script>
export default {
    props: ["isPicture"],
    data() {
        return {
            radio: 1
        };
    },
    methods: {
        changeHandler(value) {
            console.log(value);
            this.$emit("changeAnswerMode", value);
        }
    },
    computed: {
        picture() {
            return !!this.isPicture && "picture";
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
        line-height: 22px;
        padding-bottom: 24px;
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
    :first-child{
        margin-right: 24px;
    }
}
</style>