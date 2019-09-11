<template>
    <div class="panel-main">
        <div class="pannel-right-item">
            <h5 class="auth-title">选择权限</h5>
            <div class="search-auth">
                <input
                    class="auth-input"
                    v-model="input"
                    placeholder="请输入权限名称"
                    @input="changeInput"
                    :clearable="true"
                />
                <button class="auth-btn" @click="searchAuth">
                    <i class="el-icon-search el-input__icon"></i>
                </button>
            </div>
            <div class="auth-name"  v-scrollBar>
                <auth-list
                    @chooseAuth="chooseAuth"
                    @removeSelected="removeSelected"
                    :authList="userPermission"
                    :isSelect="true"
                ></auth-list>
            </div>
        </div>
        <div class="pannel-left-item">
            <h5 class="auth-title">已选权限</h5>
            <selected-auth
               v-scrollBar
                @emptySelected="emptySelected"
                @removeSelected="removeSelected"
                :authList="memberPolicy"
            ></selected-auth>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import AuthList from "./AuthList";
import SelectedAuth from "./SelectedAuth";
export default {
    // 成员邀请的权限配置
    components: {
        AuthList,
        SelectedAuth
    },
    data() {
        return {
            flag: false
        };
    },
    methods: {
        ...mapMutations([
            "CHOOSEAUTH",
            "REMOVESELECTEDAUTH",
            "EMPTYSELECTEDAUTH",
            "ISRIGHTPANNELSHOW"
        ]),

        chooseAuth(obj) {
            this.CHOOSEAUTH(obj);
        },
        removeSelected(item) {
            this.REMOVESELECTEDAUTH(item);
        },
        emptySelected() {
            this.EMPTYSELECTEDAUTH();
        },
        searchAuth() {
            if (!this.flag) {
                this.oldUserPermission = JSON.stringify(this.userPermission);
                this.flag = true;
            }

            console.log(this.oldUserPermission, "this.oldUserPermission");
            let ary = [];
            this.userPermission.forEach(item => {
                if (item.name.includes(this.input)) {
                    ary.push(item);
                }
            });

            this.$store.commit("USERPERMISSION", ary);
        },
        changeInput() {
            if (this.input == "" && this.oldUserPermission) {
                console.log(
                    JSON.stringify(this.oldUserPermission),
                    "this.oldUserPermission"
                );
                this.$store.commit(
                    "USERPERMISSION",
                    JSON.parse(this.oldUserPermission)
                );
                console.log(this.userPermission);
            }
        }
    },
    computed: {
        ...mapState({
            invitationValue: state => state.invitationValue,
            userPermission: state => state.memberManager.userPermission,
            memberPolicy: state => state.memberManager.memberPolicy
        }),

        input: {
            get: function() {
                return this.invitationValue;
            },
            set: function(newVal) {
                this.$store.commit("SETINVITATIONVALUE", newVal);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.auth-title {
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
}

.panel-main {
    padding: 20px 25px;
    overflow: hidden;
    .search-auth {
        height: 40px;
        border: 1px solid #e5e5e5;
        box-sizing: border-box;
        position: relative;
        input,
        button {
            height: 100%;
            border: none;
            background: #fff;
        }
        .auth-input {
            font-size: 12px;
            width: 100%;
            text-indent: 10px;
        }
        .auth-btn {
            width: 58px;
            background: transparent;
            position: absolute;
            right: 0;
            font-size: 16px;
            color: #e5e5e5;
            i:hover {
                color: #00c1de;
            }
        }
    }
    .auth-name {
       position: relative;
        border: 1px solid #efefef;
        border-top: none;
         height: 54vh;
         overflow-y: auto;
       
    }
}
.pannel-right-item {
    float: left;
    width: 55%;
}
.pannel-left-item {
    width: 35%;
    float: right;
    .selected-auth {
      position: relative;
        border: 1px solid #efefef;
        height: calc(54vh + 40px);
            overflow-y: auto;
       
    }
}
</style>
