<template>
     <div class="siteBox">
                    <div class="siteInfo">
                        <div class="siteImg"> <img :src="siteInfo.siteInfoImg" alt="" class="siteImg"></div>
                       

                        <span class="siteName">{{siteInfo.siteName}}</span>
                        <span class="secondDomain">{{siteInfo.secondDomain}}</span>
                        <button class="changeSite">切换站点</button>
                    </div>
                </div>
</template>
<script>
export default {
    props:["siteInfo"]
}
</script>

<style lang="scss" scoped>
    .siteBox{
    height: 116px;
    margin-top: 12px;
    background: rgba(245,246,250,1);
    padding-top: 11px;
    padding-bottom: 11px;
    padding-left: 9px
}
.siteBox .siteInfo{
    width: 473px;
    height: 116px;
    background: #fff;
    position: relative;
}
.siteImg{
    display: inline-block;
    width: 200px;
    height: 115px;
    margin-right: 24px;
    vertical-align: top;
}
.siteName{
    position: absolute;
    top: 12px;
    display: inline-block;
    font-size:16px;
    font-weight:400;
    color:rgba(38,38,38,1);
}
.secondDomain{
    position: absolute;
    top: 40px;
    display: inline-block;
    font-size:14px;
    font-weight:400;
    color:rgba(38,38,38,1);
    line-height:20px;
}
.changeSite{
    position: absolute;
    top: 71px;
    width:80px;
    height:32px;
    background:rgba(0,193,222,1);
    font-size:12px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:32px;
}
</style>


