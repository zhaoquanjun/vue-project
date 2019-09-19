<template>
    <div class="account-setting__section">
        <page-sub-nav :title="title"></page-sub-nav>
        <div class="account-setting__manage" :style="{height:scrollHeight+'px'}" v-scrollBar>
        </div>
    </div> 
</template>
<script>
import PageSubNav from "_c/common/WechatTitle";
export default {
    data() {
        return {
            title: "账号设置",
        }
    },
    components: {
        PageSubNav
    }
}
</script>