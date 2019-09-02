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
    height: 370px;
    min-height: 373px;
    max-height: 373px;
    border: none;
    padding: 24px 45px;
}
</style>