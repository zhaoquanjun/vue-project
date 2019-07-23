<template>
    <div class="selected-auth">
        <div class="auth-name-title">
            <span class="item-left" v-if="authList">已选{{authList.length}}项</span>
            <span class="item-left" v-else>已选0项</span>
            <span class="item-right empty" @click="empty">清空</span>
        </div>
        <ul class="auth-list">
            <template v-if="authList&&authList.length>0">
                <li
                    class="list-item"
                    v-for="(item,index) in authList"
                    :key="item"
                >
                    <span class="item-left auth-name ellipsis">{{item}}</span>
                    <span class="item-right auth-icon" @click.stop="removeAuth(item,index)">
                        <i class="icon-size clear-icon"></i>
                    </span>
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
        name: "AuthList",
        data() {
            return {
                permissionCount: 0
            }
        },
       
    props: {
        isSelect: {
            type: Boolean
        },
        authList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        curAuth(item, index) {
            let cur = this.authList[index];
            this.permissionCount = authList.length;
            if (cur.show) {
                this.$set(this.authList[index], "show", false);
                this.$emit("removeSelected", item);               
            } else {
                this.$set(this.authList[index], "show", true);
                this.$emit("chooseAuth", item);
            }
        },
        removeAuth(curitem, index) {
            this.$emit("removeSelected", curitem,index);
        },
        empty() {
            this.$emit("emptySelected");
        }
    },
    mounted() {
   
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
.selected-auth{
    font-size: 12px;
}
.choose-bg {
    background: #e8f8fb;
}

.auth-name-title {
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
    border-bottom: 1px solid #efefef;
}
.auth-list {
    min-height: 242px;
}
.right-authname {
    min-height: 274px;
}
.auth-list .list-item {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    width: 100%;
    padding: 0 5px;
    box-sizing: border-box;
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
.auth-name{
    width: 60%;
}
.item-right {
    width: 40%;
    padding-left: 10px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    color: #8c8c8c;
}
.empty {
    cursor: pointer;
    width: 30%;
    color: #00c1de;
    text-align: right;
    float: right;
}
.auth-icon {
    text-align: right;
}
.clear-icon{
   background: url("~img/memberManage/clear-icon.png") no-repeat center;
   background-size:contain; 
}
</style>