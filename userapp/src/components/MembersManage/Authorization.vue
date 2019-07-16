<template>
    <div class="panel-main">
        <div class="pannel-right-item">
            <h5 class="auth-title">选择权限</h5>
            <div class="search-auth">
                <input class="auth-input" v-model="input" placeholder="请输入权限名称" @input="changeInput" :clearable="true">
                <button class="auth-btn" @click="searchAuth">搜索</button>
            </div>
            <div class="auth-name">
                <auth-list @chooseAuth="chooseAuth"  @removeSelected="removeSelected" :authList="userPermission" :isSelect="true"></auth-list>
            </div>
        </div>
        <div class="pannel-left-item">
            <h5 class="auth-title">已选权限</h5>
            <div class="selected-auth">
                <selected-auth
                    @emptySelected="emptySelected"
                    @removeSelected="removeSelected"
                    :authList="memberPolicy"
                ></selected-auth>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import AuthList from "./AuthList";
import SelectedAuth from "./SelectedAuth"
export default {
    components: {
        AuthList,SelectedAuth
    },
    data() {
        return {
            input: ""
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
            console.log(obj)
            this.CHOOSEAUTH(obj);
        },
        removeSelected(item) {
            console.log(item,'ooooooooo')
            this.REMOVESELECTEDAUTH(item);
        },
        emptySelected() {
            this.EMPTYSELECTEDAUTH();
        },
        searchAuth() {
            this.oldUserPermission = JSON.stringify(this.userPermission);
            console.log(this.oldUserPermission,'----0000000')
            let ary = [];
            this.userPermission.forEach(item => {
                 if (item.description.includes(this.input)){
                   ary.push(item);
                 }
            });

            this.$store.commit("USERPERMISSION", ary);
        },
        changeInput() {
            if (this.input == "" && this.oldUserPermission ) {
                this.$store.commit(
                    "USERPERMISSION",
                    JSON.parse(this.oldUserPermission)
                );
            }
        }
    },
    computed: {
        ...mapState({
            userPermission: state => state.memberManager.userPermission,
            memberPolicy: state => state.memberManager.memberPolicy
        })
        }, mounted() {
        this.input = "";
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
    padding: 20px 10px;
    overflow: hidden;
    .search-auth {
        height: 32px;
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
            position: absolute;
            right: 0;
            top: 0;
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
    width: 50%;
}
.pannel-left-item {
    width: 40%;
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
    padding: 10px;
    border-top: 1px solid #ccc;
    .footer-btn {
        font-weight: 400;
        font-size: 12px;
    }
    .confirm {
        margin-right: 20px;
    }
}
</style>
