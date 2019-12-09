<template>
    <div class="imgsLi" ref="imgParEl">
        <img 
            :src="item" 
            ref="imgs"
            :class="imgsViewWay?'heightLong':'widthLong'"
        />
    </div>
</template>
<script>
export default {
    props:["item","itemContent"],
    data(){
        return {
            imgsViewWay:false
        }
    },
    methods:{
        handleImgsSize(){
            let imgEl=this.$refs.imgs;
            let imgParEl=this.$refs.imgs;
            let itemContent=itemContent || 1;
            if(imgEl){
                this.imgsViewWay = itemContent > imgEl.offsetHeight/imgParEl.offsetWidth ? true:false
            }
        }
    },
    watch:{
        item(){
            this.handleImgsSize();
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