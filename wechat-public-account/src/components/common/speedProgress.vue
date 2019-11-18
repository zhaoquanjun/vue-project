<template>
    <div class="speed-progress">
        <ul>
            <li v-for="(item,index) in list" :key="index" :class="{ active: index <step }">
                <!-- <span>{{item.title}}</span> -->
                <span><i v-if="index <step" class="icon iconfont iconduihao"></i></span>
                <p>{{item.text}}</p>
                <div :class="{ lineActive: index <step-1 }" v-if="index < list.length -1" class="line"></div>
            </li>
        </ul>
        
    </div>
</template>
<script>
export default {
    props: {
        steps: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            step: this.steps,
            list:[
                {
                    title: '1',
                    text: '绑定微信公众号'
                },
                {
                    title: '2',
                    text: '设置推广域名'
                },
                {
                    title: '3',
                    text: '设置成功'
                }
            ]
        };
    },
    watch: {
        steps() {
          this.step= this.steps
        }
    }
};
</script>

<style lang="scss" scoped>
.speed-progress {
    position: relative;
    height: 72px;
    width: 100%;
    margin: 32px 0;
    ul {
        z-index: 2;
        width: 700px;
        display: flex;
        margin: 0 auto;
        justify-content: space-between;
        li {
            position: relative;
            width: 100px;
            text-align: center;
            span {
                position: relative;
                display: inline-block;
                width:32px;
                height:32px;
                margin-bottom: 20px;
                line-height: 32px;
                z-index: 10;
                background: #E5E5E5;
                color: #FFFFFF;
                background:rgba(245,246,250,1);
                border: 2px solid rgba(223,226,233,1);
                border-radius: 50%;
                text-align: center;
                i {
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 32px;
                }
            }
            p {
                font-size:14px;
                font-family:"PingFangSC";
                font-weight:400;
                color: #A1A8B1;
                line-height: 20px;
            }
            .line {
                box-shadow: border-box;
                border: $--border-base;
                width: 300px;
                position: absolute;
                top: 16px;
                left: 50%;
                z-index: 1;
            }
            .lineActive {
                border: 1px solid #01c0de;
            }
        }
        .active {
            span {
                background: #01c0de;
                border: 2px solid #01c0de;
            }
            p {
              color:rgba(38,38,38,1);  
            }
        }
    }
}
</style>