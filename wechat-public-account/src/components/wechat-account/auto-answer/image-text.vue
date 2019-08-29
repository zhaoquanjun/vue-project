<template>
    <div class="image-text">
        <ul class="list">
            <li :class="index===0?'fist-item':'list-item'" v-for="(item,index) in list" :key="index">
                <div class="imgwrap">
                    <img
                        src="http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/0dd7cc4ae2084997859e8691623716d4"
                    />
                </div>
                <div class="headline">{{item.title}}</div>
                <div class="mask">
                    <button @click="upward(item,index)">
                        <i class="iconfont iconshang"></i>
                    </button>
                    <button @click="downward(item,index)">
                        <i class="iconfont iconxia"></i>
                    </button>
                    <button>
                        <i class="iconfont iconcaozuo"></i>
                    </button>
                    <button>
                        <i class="iconfont iconhuishouzhan"></i>
                    </button>
                </div>
            </li>
            <!-- <li class="list-item">
                <div class="headline">我是标题</div>
                <div class="imgwrap">
                    <img
                        src="http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/0dd7cc4ae2084997859e8691623716d4"
                    />
                </div>
                <div class="mask">
                    <button>
                        <i class="iconfont iconshang"></i>
                    </button>
                    <button>
                        <i class="iconfont iconxia"></i>
                    </button>
                    <button>
                        <i class="iconfont iconcaozuo"></i>
                    </button>
                    <button>
                        <i class="iconfont iconhuishouzhan"></i>
                    </button>
                </div>
            </li> -->
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: [
                {
                    title: "1"
                },
                {
                    title: "2"
                },
                {
                    title: "3"
                }
            ]
        };
    },
    methods:{
        downward(item,index){
            this.list[index] = this.list[index]+1;
            this.list[index+1] = this.list[index];
        },
        upward(){
            
        }
    }
};
</script>
<style lang="scss" scoped>
.list {
    width: 279px;
    > li {
        position: relative;
        margin-bottom: 8px;
    }
    li.fist-item {
        height: 140px;
        overflow: hidden;
        border-radius: 2px;
        .imgwrap {
            width: 100%;
            height: 100%;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .headline {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 8px 16px;
            background: rgba(38, 38, 38, 0.5);
            color: #fff;
        }
    }
    li.list-item {
        height: 60px;
        padding: 0 10px 0 32px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 10px 0px rgba(224, 224, 224, 0.5);
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .imgwrap {
            width: 50px;
            height: 50px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .mask {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(38, 38, 38, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        button {
            padding: 10px;
            .iconfont {
                color: #fff;
            }
        }
    }
    li:hover .mask {
        opacity: 1;
    }
}
</style>