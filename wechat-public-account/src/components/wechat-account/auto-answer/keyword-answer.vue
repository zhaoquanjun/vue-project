<template>
    <div class="keyword-answer">
        <span>状态</span>
        <span class="select-item">
            <el-select size="small" v-model="matchValue" placeholder="请选择" @change="changeStatus">
                <el-option
                    v-for="item in matchOption"
                    :key="item.matchValue"
                    :label="item.matchLabel"
                    :value="item.matchValue"
                ></el-option>
            </el-select>
        </span>
    </div>
</template>
<script>
export default {
    data:{
         statusOptions: [
                {
                    matchValue: "true",
                    matchLabel: "半匹配"
                },
                {
                    matchValue: "false",
                    matchLabel: "全匹配"
                }
            ],
             matchValue: "true",
    }
}
</script>
<style scoped>

</style>