<template>
    <div id="app">
        <el-container>
            <el-header style="height:50px;position:fixed;width: 100%;z-index:1000">
                <m-header></m-header>
            </el-header>
            <el-container style="padding-top: 50px;width: 100%;overflow: hidden;"
            >
                <el-aside width="80px">
                    <m-aside></m-aside>
                </el-aside>
                <el-main style=" overflow: hidden;">
                    <el-container>
                        <el-aside class="page-sub-aside" width="120px" v-show="isSub">
                            <page-submenu>
                                <i slot="title">内容管理</i>
                            </page-submenu>
                        </el-aside>
                        <el-main class="content-table-wrap" >
                            <router-view />
                        </el-main>
                    </el-container>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import MHeader from "@/components/common/MHeader";
import MAside from "@/components/common/MAside";
import PageSubmenu from "@/components/common/PageSubmenu.vue";
import MContainer from "@/components/common/MContainer";
export default {
    components: {
        MHeader,
        MAside,
        PageSubmenu,
        MContainer
    },
    computed: {
        isSub() {
            return this.$route.meta.isSub;
        }
    }
};
</script>
<style >
@import url("./assets/quill.css");
</style>
<style scoped>
</style>

<style lang="scss">
</style>
