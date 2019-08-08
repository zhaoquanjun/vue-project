<template>
     <div class="loading-warp" >
            <div class="loading">
                <img src="./loading.gif" alt />
            </div>
        </div>
</template>
<style lang="scss" scoped>
  .loading-warp {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255,255,255,0.75);
        .loading {
            width: 50px;
            height: 52px;
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            margin: auto;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
