<template>
    <div class="memenber-auth">
        <div class="auth-name-title">
            <span class="item-left">权限名称</span>
            <span v-if="isSelect" class="item-right color-black">说明</span>
            <span v-else class="item-right empty" @click="empty()">清空</span>
        </div>
        <ul class="auth-list" :class="{'right-authname':!isSelect}" >
            <template v-if="authList.length>0">
                <li
                    class="list-item"
                    v-for="(item,index) in authList"
                    :key="item.id"
                    @click="curAuth(item,index)"
                    :class="{'choose-bg':item.isChoosed == true && isSelect}"
                >
                    <span class="item-left">{{item.name}}</span>
                    <span class="item-right" v-if="isSelect">{{item.mark}}</span>
                    <span class="item-right auth-icon" v-else @click.stop="removeAuth(item,index)">
                        <i class="iconfont clear-icon"></i>
                    </span>
                </li>
            </template>
            <template v-else>
                <p style="text-align: center; line-height: 242px;">没有匹配的结果</p>
            </template>
        </ul>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    name: "AuthList", // 权限配置左侧管理员拥有的权限。。
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
            if (cur.isChoosed) {
                this.$set(this.authList[index], "isChoosed", false);
                this.$emit("removeSelected", item);
            } else {
                this.$set(this.authList[index], "isChoosed", true);
                this.$emit("chooseAuth", item);
            }
        },
        removeAuth(curitem, index) {
            this.$set(this.authList[index], "isChoosed", false);
            this.$emit("removeSelected", curitem);
        },
        empty() {
            this.$emit("emptySelected");
        }
    },
    computed: {
        ...mapState({
            userPermission: state => state.memberManager.userPermission,
            memberPolicy: state => state.memberManager.memberPolicy
        })
    }
};
</script>

<style lang="scss" scoped>
.memenber-auth {
    font-size: 12px;
    .choose-bg {
        background: #e8f8fb;
        position: relative;
        &::before{
            position: absolute;
            content: "";
            // background: url("~img/close.png") no-repeat center
        }
    }
   
    .auth-name-title {
        display: flex;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #efefef;
        padding: 0 18px;
        

    }
    .auth-list {
        position: relative;
        min-height: 242px;
    }
    .right-authname {
        min-height: 274px;
    }
    .auth-list .list-item {
        cursor: pointer;
        width: 100%;
        height: 58px;
        padding: 0 18px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        line-height: 25px;
        border-bottom: 1px solid #E5E5E5;
        overflow: hidden;
        &
        span {
            display: inline-block;
        }
        &:hover  {
            background: #F0F3F7;
        }   
    }
    .item-left {
        display: flex;
        align-items: center;
        width: 159px;
        float: left;
        color: #262626;
    }
    .item-right {
        display: flex;
        align-items: center;
        width: 210px;
        padding-left: 15px;

        color: #a1a8b1;
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
    .clear-icon {
        background: url("~img/memberManage/clear-icon.png") no-repeat center;
        background-size: contain;
    }
}
</style>
