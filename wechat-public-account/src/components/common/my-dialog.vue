<template>
    <div class="my-dialog" v-if="isShow" @click.stop="handlerClick" @mouseenter="handlerClick"></div>
</template>
<script>
export default {
    data() {
        return {
            
        };
    },
    methods: {
        handlerClick() {
            this.$store.commit("SET_DIALOG",false)
        },
    },
    computed:{
        isShow(){
            return this.$store.state.isAsideDialogShow
        }
    }
};
</script>
<style lang="scss" scoped>
.my-dialog {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    z-index: 101;
    background: #000;
}
</style>