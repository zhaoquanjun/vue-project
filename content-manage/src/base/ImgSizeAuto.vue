<template>
    <div class="imgsLi">
        <img 
            :src="item" 
            ref="imgs"
            :class="imgsViewWay[index]?'heightLong':'widthLong'"
        />
    </div>
</template>
<script>
export default {
    props:["item","newFileList","index"],
    data(){
        return {
            imgsViewWay:[]
        }
    },
    methods:{
        handleImgsSize(imgs){
            let imgEl=this.$refs.imgs;
            let imgsViewWay=[];
            if(imgEl){
                imgEl.map(item=>{
                    if(item.offsetHeight>=item.offsetWidth){
                        imgsViewWay.push(true)
                    }else{
                        imgsViewWay.push(false);
                    }
                })
            }
            return imgsViewWay
        },
        _handleImgsSize(imgs){
            this.imgsViewWay=handleImgsSize(imgs);
        }
    },
    watch:{
        newFileList(){
            this._handleImgsSize(imgs);
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