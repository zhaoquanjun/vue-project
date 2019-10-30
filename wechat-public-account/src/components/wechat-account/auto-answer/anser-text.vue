<template>
    <div>
        <el-input
            class="textarea"
            type="textarea"
            placeholder="请输入回复内容"
            v-model="textarea"
            maxlength="600"
            :show-word-limit="isLimitShow"
            resize="none"
            @focus="focus"
            @blur="blur"
            @change="handlerChange"
        ></el-input>
    </div>
</template>
<script>
export default {
    props: ["serveText"],
    data() {
        return {
            textarea: "",
            isLimitShow: false
        };
    },
    mounted() {
        this.textarea = this.serveText;
    },
    methods: {
        focus() {
            this.isLimitShow = true;
        },
        blur() {
            this.isLimitShow = false;
        },
        handlerChange() {
            this.$emit("handlerText", this.textarea);
        }
    },
    watch: {
        serveText() {
            this.textarea = this.serveText;
        }
    }
};
</script>
<style scoped>
.textarea /deep/ .el-textarea__inner {
    height: 306px;
    border: none;
    padding: 16px 16px;
}
.el-textarea /deep/ .el-input__count {
    right: 20px;
}
</style>