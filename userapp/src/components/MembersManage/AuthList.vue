<template>
    <div>
        <div class="auth-name-title">
            <span class="item-left">权限名称</span>
            <span v-if="isSelect" class="item-right color-black">说明</span>
            <span v-else class="item-right empty" @click="empty()">清空</span>
        </div>
        <ul class="auth-list" :class="{'right-authname':!isSelect}">
            <template v-if="authList.length>0">
                <li
                    class="list-item"
                    v-for="(item,index) in authList"
                    :key="item.id"
                    @click="curAuth(item,index)"
                    :class="{'choose-bg':item.show == true && isSelect}"
                >
                    <span class="item-left">{{item.description}}</span>
                    <span class="item-right" v-if="isSelect">{{item.mark}}</span>
                    <span class="item-right auth-icon" v-else @click.stop="removeAuth(item,index)">
                        <i class="iconfont icon-weibiaoti-"></i>
                    </span>
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { stat } from 'fs';
export default {
    name: "AuthList",
    props: {
        isSelect: {
            type: Boolean
        },
        authList: {
            type: Array,
            default: () => []
        }
    },
    created(){
        console.log(JSON.stringify(this.userPermission))
        /**
         * [{"pluginId":1,"name":"BoardRead","description":"面板读权限","mark":"这是策略描述的文字","nameSpace":"board","isDeleted":false,"id":10000,"show":false},{"pluginId":2,"name":"BoardWrite","description":"面板写权限","mark":"这是策略描述的文字","nameSpace":"board","isDeleted":false,"id":10001,"show":false},{"pluginId":3,"name":"ContainerRead","description":"容器读权限","mark":"这是策略描述的文字","nameSpace":"container","isDeleted":false,"id":10002,"show":false},{"pluginId":4,"name":"ContainerWrite","description":"容器写权限","mark":"这是策略描述的文字","nameSpace":"container","isDeleted":false,"id":10005,"show":false}]
         */
    },
    data() {
        return {};
    },

    methods: {
        curAuth(item, index) {
            let cur = this.authList[index];
            if (cur.show) {
                this.$set(this.authList[index], "show", false);
                this.$emit("removeSelected", item);
            } else {
                this.$set(this.authList[index], "show", true);
                this.$emit("chooseAuth", item);
            }
        },
        removeAuth(curitem, index) {
            this.$set(this.authList[index], "show", false);
            this.$emit("removeSelected", curitem);
        },
        empty() {
            this.authList.forEach((item, index) => {
                this.$set(this.authList[index], "show", false);
            });
            this.$emit("emptySelected");
        }
    },
    mounted() {
   
    },
    watch:{
         
        // if (this.memberPolicy.length > 0) {
        //      console.log(this.memberPolicy);
        //     for (let i = 0; i < this.userPermission.length; i++) {
        //         for (let j = 0; j < this.memberPolicy.length; j++) {
        //             if (this.userPermission[i] == this.memberPolicy[i]) {
        //                 console.log("真的吗");
        //             }
        //         }
        //     }
        // }
    },
    computed: {
         ...mapState({
            userPermission: state => state.memberManager.userPermission,
            memberPolicy: state => state.memberManager.memberPolicy
        }),
        
    }
};
</script>

<style lang="scss" scoped>
.choose-bg {
    background: #e8f8fb;
}

.auth-name-title {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #efefef;
}
.auth-list {
    min-height: 242px;
}
.right-authname {
    min-height: 274px;
}
.auth-list .list-item {
    height: 40px;
    line-height: 40px;
    width: 100%;
    padding: 0 5px;
    span {
        display: inline-block;
    }
    &:hover {
        background: #e5f8fa;
        color: #fff;
    }
}
.item-left {
    width: 40%;
    float: left;
    color: #262626;
}
.item-right {
    width: 60%;
    padding-left: 10px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    color: #8c8c8c;
}
.empty {
    width: 30%;
    color: #00c1de;
    text-align: right;
    float: right;
}
.auth-icon {
    text-align: right;
}
.icon-weibiaoti- {
    color: #f4542b;
}
</style>
