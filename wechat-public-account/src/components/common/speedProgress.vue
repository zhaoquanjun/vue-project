<template>
    <div class="speed-progress">
        <ul>
            <li v-for="(item,index) in list" :key="index" :class="{ active: index <step }">
                <span>{{item.title}}</span>
                <p>{{item.text}}</p>
            </li>
        </ul>
        <div class="line"></div>
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
    margin: 60px 0 50px;
    ul {
        position: relative;
        z-index: 2;
        width: 700px;
        display: flex;
        margin: 0 auto;
        justify-content: space-between;
        li {
            width: 100px;
            text-align: center;
            span {
                display: inline-block;
                width:32px;
                height:32px;
                margin-bottom: 20px;
                line-height: 32px;
                background:rgba(212,225,228,1);
                color: #FFFFFF;
                border:1px solid rgba(255,255,255,1);
                border-radius: 50%;
            }
            p {
                font-size:14px;
                font-family:"PingFangSC";
                font-weight:400;
                color: #A1A8B1;
                line-height: 20px;
            }
        }
        .active {
            span {
                background: #63DC8C;
            }
            p {
              color:rgba(38,38,38,1);  
            }
        }
    }
    .line {
        box-shadow: border-box;
        border: 1px dashed #E5E5E5;
        width: 600px;
        position: absolute;
        top: 16px;
        left: 50%;
        margin-left: -300px;
        z-index: 1;
    }
}
</style>