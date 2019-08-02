<template>
    <el-container>
        <el-aside style="width:120px">
            <slot name="sub-menu"></slot>
        </el-aside>
        <el-main>
            <slot name="container"></slot>
        </el-main>
    </el-container>
</template>
<style scoped>
    .el-main{
        padding: 0;
    }
    .el-aside{
        height: 100vh;
        background: #fff
    }
</style>

