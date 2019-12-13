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
                    <button class="item-right auth-icon" @click.stop="removeAuth(item,index)">
                        <i class="icon iconfont iconcuowu cl-iconfont"></i>
                    </button>
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
    position: relative;
}
.choose-bg {
    background:rgba(255,107,0,0.2) !important;
}

.auth-name-title {
    height: 40px;
    line-height: 40px;
    padding: 0 18px;
    border-bottom: 1px solid #efefef;
}
.auth-list {
    min-height: 242px;
}
.right-authname {
    min-height: 274px;
}
.auth-list .list-item {
    float: left;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    span {
        display: inline-block;
    }
     &:hover  {
            background: #F0F3F7;
        }   
}
.item-left {
   width: 80%;
    float: left;
    color: #262626;
}

.item-right {
    float: left;
    width: 36px;
    margin-left: 10px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    color: #8c8c8c;
    .iconcuowu {
        color: $--color-danger;
        font-weight: 400;
        padding: 6px;
        &:hover {
            background-color: $--color-white;
            border-radius:$--border-radius-base;
        }
    }
}
.empty {
    cursor: pointer;
    width: 20%;
    height: 40px;
    color: $--color-primary;
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