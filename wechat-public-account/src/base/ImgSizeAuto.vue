<template>
    <div class="imgsLi" ref="imgsLi">
        <img 
            :src="item"
            :class="imgsViewWay?'heightLong':'widthLong'"
        />
        <img id="galleryImg" class="imgHide" :src="item"  ref="imgHide" @load="handleImgsSize">
    </div>
</template>
<script>
export default {
    props:["item"],
    data(){
        return {
            imgsViewWay:false
        }
    },
    methods:{
        handleImgsSize(){
            this.$nextTick(() => {
                let imgsLi=this.$refs.imgsLi;
                let imgHide=this.$refs.imgHide;
                if (imgHide.offsetHeight > imgsLi.offsetHeight) {
                    this.imgsViewWay = true
                } else {
                    this.imgsViewWay = false
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.imgsLi{
     position: relative;
     width:100%;
     height:100%;
     overflow: hidden;
     .imgHide {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width:100%;
        height:auto;
     }
    .heightLong{
        position: absolute;
        width:100%;
        height:auto;
        top:50%;
        transform: translateY(-50%);
    }
    .widthLong{
        position: absolute;
        height:100%;
        width:auto;
        left:50%;
        transform: translateX(-50%);
    }
}
</style>