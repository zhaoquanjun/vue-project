<template>
    <div class="imgsLi">
        <img 
            :src="item" 
            ref="img"
            :class="imgsViewWay[0]?'heightLong':'widthLong'"
        />
    </div>
</template>
<script>
export default {
    props:["item"],
    data(){
        return {
            imgsViewWay:[]
        }
    },
    methods:{
        handleImgsSize(){
            let imgEl=this.$refs.img;
            if(imgEl){
                imgEl.map(item=>{
                    if(item.offsetHeight>=item.offsetWidth){
                        this.imgsViewWay.push(true);
                    }else{
                        this.imgsViewWay.push(false);
                    }
                })
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