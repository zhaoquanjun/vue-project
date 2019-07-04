<template>
    <div id="app">
        <el-container>
            <el-header style="height:50px;">
                <m-header></m-header>
            </el-header>
            <el-container>
                <el-aside width="50px">
                    <m-aside></m-aside>
                </el-aside>
                <el-main>
                    <el-container>
                        <el-aside width="120px"   v-show="isSub">
                            <page-submenu>
                                <i slot="title">内容管理</i>
                            </page-submenu>
                        </el-aside>
                        <el-main>
                            <router-view/>
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
     computed:{
        isSub(){
            return this.$route.meta.isSub
        }
    }
};
</script>
<style >
    @import url('./assets/quill.css');
</style>

<style lang="scss">

</style>
