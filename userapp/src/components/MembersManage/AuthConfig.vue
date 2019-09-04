<template>
    <div class="auth-config">
        <div class="auth-tip" v-if="authtipShow">请至少选择一项权限</div>
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
                    />
                    <button class="auth-btn" @click="searchAuth">搜索</button>
                </div>
                <div class="auth-name">
                    <auth-list
                        @chooseAuth="chooseAuth"
                        :authList="userPermission"
                        @removeSelected="removeSelected"
                        :isSelect="true"
                    ></auth-list>
                </div>
            </div>
            <div class="pannel-left-item">
                <h5 class="auth-title">已选权限</h5>
                <selected-auth
                    :authList="memberPolicy"
                    @removeSelected="removeSelected"
                    @emptySelected="emptySelected"
                ></selected-auth>
                <!-- <auth-list
                        @emptySelected="emptySelected"
                        @removeSelected="removeSelected"
                        :authList="memberPolicy"
                ></auth-list>-->
            </div>
        </div>
        <div class="footer pannel-footer">
            <button class="confirm footer-btn" @click="primary">确认</button>
            <button class="cancel footer-btn" @click="cancel">取消</button>
        </div>
    </div>
</template>
<script>
import AuthList from "./AuthList";
import SelectedAuth from "./SelectedAuth";
import MemberInfo from "./MemberInfo";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
    name: "authority-config", // 权限配置
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
    components: { AuthList, SelectedAuth, MemberInfo },
    created() {},
    data() {
        return {
            value: "",
            authtipShow: false,
            flag:false
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
        async primary() {
            if (this.isBatch) {
                let { status } = await this._batchUpdateUserPolicy(
                    this.userIds
                );
                if (status === 200) {
                    this.$notify({
                        customClass: "notify-success",
                        message: `保存成功`,
                        duration: 2000,
                        showClose: false
                    });
                    this.$emit("getMemberList");
                    this.ISRIGHTPANNELSHOW(!this.isRightPanelShow);
                } else {
                     this.$notify({
                        customClass: "notify-error", // error success
                        message: `保存失败`,
                        duration: 1500,
                        showClose: false
                    });
                }
            } else {
                if (this.getSelectedAuthNames.length < 1) {
                    this.authtipShow = true;
                    return false;
                }
                this.authtipShow = false;
                if (this.value != null && this.value.length > 100) {
                    this.$notify({
                        customClass: "notify-error", // error success
                        message: `备注长度不能超过100个字符!`,
                        duration: 1500,
                        showClose: false
                    });
                    return false;
                }
                let params = {
                    remark: this.value,
                    userId: this.memberInfo.id
                };
                let { status } = await this._updateUserPolicy(params);
                if (status === 200) {
                     this.$notify({
                        customClass: "notify-success", // error success
                        message: `保存成功`,
                        duration: 1500,
                        showClose: false
                    });
                    this.$emit("getMemberList");
                    this.ISRIGHTPANNELSHOW(!this.isRightPanelShow);
                } else {
                     this.$notify({
                        customClass: "notify-error", // error success
                        message: `保存失败`,
                        duration: 1500,
                        showClose: false
                    });
                }
            }
            this.input = "";
        },
        cancel() {
            this.ISRIGHTPANNELSHOW(!this.isRightPanelShow);
            this.input = "";
        },
        chooseAuth(obj) {
            this.CHOOSEAUTH(obj);
        },
        removeSelected(item) {
            this.REMOVESELECTEDAUTH(item);
        },
        emptySelected() {
            this.EMPTYSELECTEDAUTH();
        },
        closePanel() {
            this.ISRIGHTPANNELSHOW(!this.isRightPanelShow);
        },
        searchAuth() {
           if(!this.flag){
                this.oldUserPermission = JSON.stringify(this.userPermission);
                this.flag = true;
           }
            let ary = [];
            this.userPermission.forEach(item => {
                if (item.name.includes(this.input)) ary.push(item);
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
            invitationValue: state => state.invitationValue,
            userPermission: state => state.memberManager.userPermission,
            memberInfo: state => state.memberManager.memberInfo,
            memberPolicy: state => state.memberManager.memberPolicy
        }),
        ...mapState(["authList", "selectedAuth", "isRightPanelShow"]),
        ...mapGetters(["getSelectedAuthNames"]),
        input: {
            get: function() {
                return this.invitationValue;
            },
            set: function(newVal) {
                console.log(newVal);
                this.$store.commit("SETINVITATIONVALUE", newVal);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.auth-config {
    font-size: 12px;
    .auth-tip {
        box-sizing: border-box;
        margin: 10px 16px 0;
        height: 32px;
        line-height: 32px;
        padding: 0 16px;
        color: #ff451d;
        background: rgba(253, 240, 237, 1);
        border: 1px solid rgba(253, 171, 153, 1);
    }
    .auth-title {
        height: 40px;
        line-height: 40px;
        margin-right: 10px;
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
                font-size: 12px;
                text-indent: 10px;
                box-sizing: border-box;
                width: 100%;
                border: 1px solid #e5e5e5;
                &:hover {
                    border: 1px solid #00c1de;
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
}
</style>

