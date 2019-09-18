<template>
    <div class="speed-progress">
        <ul>
            <li v-for="(item,index) in list" :key="index" :class="{ active: index <1 }">
                <span>{{item.title}}</span>
                <p>{{item.text}}</p>
            </li>
            <div class="line"></div>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
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
    created() {
    },
    methods: {
    }
};
</script>

<style lang="scss" scoped>
.speed-progress {
    width: 100%;
    ul {
        display: flex;
        margin: 0 10%;
        justify-content: space-between;
        li {
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
}
</style>