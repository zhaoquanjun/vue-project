<template>
    <div>
        <member-info 
       v-model="value"
        v-if="memberInfo && Object.keys(memberInfo).length>0" 
        :memberInfo="memberInfo"
        ></member-info>
        <div class="panel-main">
            <div class="pannel-right-item">
                <h5 class="auth-title">选择权限</h5>
                <div class="search-auth">
                    <input
                        class="auth-input input-hover"
                        v-model="input"
                        placeholder="请输入权限名称"
                        @input="changeInput"
                        
                    >
                    <button class="auth-btn" @click="searchAuth">搜索</button>
                </div>
                <div class="auth-name">
                    <auth-list @chooseAuth="chooseAuth" :authList="userPermission" @removeSelected="removeSelected" :isSelect="true"></auth-list>
                </div>
            </div>
            <div class="pannel-left-item">
                <h5 class="auth-title">已选权限</h5>
                <div class="selected-auth">
                    <auth-list
                        @emptySelected="emptySelected"
                        @removeSelected="removeSelected"
                        :authList="memberPolicy"
                    ></auth-list>
                </div>
            </div>
        </div>
        <div class="footer">
            <button class="confirm footer-btn" @click="primary">确认</button>
            <button class="cancel footer-btn">取消</button>
        </div>
    </div>
</template>
<script>
import AuthList from "./AuthList";
import MemberInfo from "./MemberInfo";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
    name: "right-pannel",
    props: {
        isBatch: {
            type: Boolean,
            default: false
        },
        userIds: {
            type: Array,
            default: () => []
        }
    },
    components: { AuthList, MemberInfo },
    created() {},
    data() {
        return {
            input: "",
            value:""
        };
    },
    methods: {
        ...mapMutations([
            "CHOOSEAUTH",
            "REMOVESELECTEDAUTH",
            "EMPTYSELECTEDAUTH",
            "ISRIGHTPANNELSHOW"
        ]),
        ...mapActions(["_updateUserPolicy", "_batchUpdateUserPolicy"]),
        /**
         * 点击权限配置 "确认" 按钮
         */
        primary() {
           
           return
            //let ids = this.getSelectedAuthId;
            if (this.isBatch) {
                console.log("1");
                this._batchUpdateUserPolicy(this.userIds);
            } else {
                console.log("2");
                this._updateUserPolicy();
            }
        },
        chooseAuth(obj) {
            this.CHOOSEAUTH(obj);
        },
        removeSelected(item) {
            console.log(item,'itemitemitemitem')
            this.REMOVESELECTEDAUTH(item);
        },
        emptySelected() {
            this.EMPTYSELECTEDAUTH();
        },
        closePanel() {
            this.ISRIGHTPANNELSHOW(!this.isRightPanelShow);
        },
        searchAuth() {
            this.oldUserPermission = JSON.stringify(this.userPermission);
            let ary = [];
            this.userPermission.forEach(item => {
                if (item.description.includes(this.input)) ary.push(item);
            });
            this.$store.commit("USERPERMISSION", ary);
        },
        changeInput() {
            if (this.input === "" && this.oldUserPermission) {
                this.$store.commit(
                    "USERPERMISSION",
                    JSON.parse(this.oldUserPermission)
                );
            }
        }
    },
    mounted() {},
    computed: {
        ...mapState({
            userPermission: state => state.memberManager.userPermission,
            memberInfo: state => state.memberManager.memberInfo,
            memberPolicy: state => state.memberManager.memberPolicy
        }),
        ...mapState(["authList", "selectedAuth", "isRightPanelShow"]),
        ...mapGetters(["getSelectedAuthNames"])
    }
};
</script>
<style lang="scss" scoped>
.auth-title {
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
}
.right-pannel {
    background: #ffffff;
    position: absolute;
    z-index: 1;
    right: 0;
    top: 0;
    bottom: 0;
    width: 534px;
    color: #262626;
    .pannel-head {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        overflow: hidden;
        border-bottom: 1px solid #efefef;
        span {
            padding: 0 10px;
        }
        .auth-title {
            margin-right: 10px;
        }
        .close-pannel {
            float: right;
            cursor: pointer;
        }
    }
}
.panel-main {
    padding: 20px 16px;
    overflow: hidden;
    .search-auth {
        display: flex;
        height: 32px;
        box-sizing: border-box;
        position: relative;
        input,
        button {
            height: 100%;
            border: none;
            background: #fff;
        }
        .auth-input {
            text-indent: 10px;
            box-sizing: border-box;
            width: 100%;
            border: 1px solid #E5E5E5;
            &:hover{
                border: 1px solid #00C1DE;
            }
        }
        .auth-btn {
            // position: absolute;
            // right: 0;
            // top: 0;
            width: 58px;
            background: #00c1de;
            color: #fff;
        }
    }
    .auth-name {
        border: 1px solid #efefef;
        border-top: none;
        padding: 0 10px;
    }
}
.pannel-right-item {
    float: left;
    width: 275px;
}
.pannel-left-item {
    width: 199px;
    float: right;
    .selected-auth {
        border: 1px solid #efefef;
        padding: 0 10px;
    }
}

.footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 15px 17px;
    border-top: 1px solid #efefef;
    .footer-btn {
        width: 63px;
        height: 32px;
        background: rgba(0, 193, 222, 1);
        color: #fff;
    }
    .cancel {
        margin-left: 20px;
        background: #fff;
        border: 1px solid rgba(0, 193, 222, 1);
        color: rgba(0, 193, 222, 1);
    }
}

</style>

