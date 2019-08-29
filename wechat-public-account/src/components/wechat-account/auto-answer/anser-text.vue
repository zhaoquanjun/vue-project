<template>
    <div>
        <el-input
            class="textarea"
            type="textarea"
            placeholder="请输入内容"
            v-model="textarea"
            maxlength="600"
            show-word-limit
            resize="none"
        ></el-input>
    </div>
</template>
<script>
export default {
    data() {
        return {
            textarea: ""
        };
    }
};
</script>
<style scoped>
.textarea /deep/ .el-textarea__inner {
    height: 373px;
    min-height: 373px;
    max-height: 373px;
    border: none;
}
</style>