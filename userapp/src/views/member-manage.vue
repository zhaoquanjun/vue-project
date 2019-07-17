<template>
<div>
    <MembersManage/>
    <router-view></router-view>
</div>
    
</template>
<script>
import MembersManage from "@/components/MembersManage/index.vue";
export default {
    name: "members-manage",
    components: {
        MembersManage
    }
};
</script>