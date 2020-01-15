<template>
    <div class="imgsLi">
        <img 
            @load="handleImgSize"
            :src="item" 
            ref="img"
            :class="imgsViewWay?'heightLong':'widthLong'"
        />
    </div>
</template>
<script>
export default {
    props:["item"],
    data(){
        return {
            imgsViewWay:Boolean
        }
    },
    watch:{
        item(){
            this.handleImgSize();
        }
    },
    methods:{
        handleImgSize(){
            this.$nextTick(()=>{
                let imgEl=this.$refs.img;
                if(imgEl.offsetHeight >= imgEl.offsetWidth){
                    this.imgsViewWay=true;
                }else{
                    this.imgsViewWay=false;
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
    .heightLong{
        position: absolute;
        width:100%;
        height:auto;
        top:50%;
        left: 0;
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