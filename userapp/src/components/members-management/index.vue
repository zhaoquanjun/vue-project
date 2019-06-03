<template>
    <div class="container">
        <el-main>
            <el-row class="user-list">
                <span>成员列表</span>
            </el-row>
            <div class="user-set">
                <el-col :span="15">
                    <span class="user-count">成员 (12人)</span>
                    <button class="btn-item" :disabled="disabled" @click="authorization">权限配置</button>
                    <button class="btn-item" :disabled="disabled" @click="_batchDeletMember">删除</button>
                    <div class="seachInput">
                        <el-input
                            size="medium"
                            placeholder="收入成员手机号搜索"
                            v-model="input5"
                            class="input-with-select"
                        >
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="3" :offset="6">
                    <button class="btn-item invite-member" @click="invitation">邀请成员</button>
                </el-col>
            </div>
            <m-table
                @tabSelection="tabSelection"
                @deleteCurMember="_deleteCurMember"
                @authEdit="authEdit"
                :member-list="memberList"
            ></m-table>
            <el-dialog
                width="0"
                :visible.sync="$store.state.isRightPanelShow || $store.state.isInvitationPanelShow"
                :before-close="handleClose"
            ></el-dialog>
            <right-pannel :style="{width:pannelWidth+'px'}">
                <span slot="title-text">权限配置</span>
                <auth-config :is-batch="isBatch"/>
            </right-pannel>
            <right-pannel :style="{width:isInvitationlWidth+'px'}">
                <span slot="title-text">邀请成员</span>
                <InvitationLink></InvitationLink>
            </right-pannel>
        </el-main>
        <!-- <div class="svg-container">
            <svg-icon  icon-class="arrow-down"></svg-icon>
        </div> -->
    </div>
</template>
<script>
import MTable from "./MTable";
import RightPannel from "../RightPannel";
import AuthConfig from "./AuthConfig";
import InvitationLink from "./InvitationLink";
import { mapMutations, mapState, mapActions } from "vuex";
import {
    testLogin,
    getUserCurrentAppPolicy,
    deleteCurMember,
    batchDeletMember
} from "@/api/index";
export default {
    name: "homeMain",
    components: {
        MTable,
        RightPannel,
        AuthConfig,
        InvitationLink,
    },
    data() {
        return {
            input5: "",
            dialogVisible: true,
            memberList: [],
            multipleSelection: [],
            isBatch: false,
            svg:"arrow-down"
        };
    },
    created() {
        // this._getUserCurrentAppPolicy();
        this._getAuth();
        //this._getBeInvitedUsers()
    },
    mounted() {
        this._getBeInvitedUsers().then(jsonData => {
            this.memberList = jsonData.data;
        });
    },
    methods: {
        ...mapActions([
            "_getAppPolicies",
            "_getUserInfo",
            "_getBeInvitedUsers"
        ]),
        ...mapMutations([
            "ISRIGHTPANNELSHOW",
            "ISINVITATIONPANELSHOW",
            "CURMEMBVERINFO"
        ]),
        /**
         * 删除成员列表中其中一项
         */
        async _deleteCurMember() {
            await deleteCurMember(1);
        },
        async _batchDeletMember() {
            await batchDeletMember();
        },
        /**
         * 权限配置展开
         * 多人权限配置
         */
        authorization() {
            this.ISRIGHTPANNELSHOW(true);
            this.isBatch = true;
            this._getAppPolicies(this.isBatch);
        },
        /**
         * 邀请成员面板-链接
         */
        invitation() {
            this.ISINVITATIONPANELSHOW(true);
        },
        /**
         * dialog 关闭
         */
        handleClose() {
            this.ISRIGHTPANNELSHOW(false);
            this.ISINVITATIONPANELSHOW(false);
        },
        /**
         * table组件 点击编辑后触发此方法
         */
        authEdit(data) {
            this.ISRIGHTPANNELSHOW(true);
            this._getAppPolicies();
            this._getUserInfo();
        },
        /**
         * table组件点击多选框触发此方法
         */
        tabSelection(val) {
            console.log(val, "val");
            this.multipleSelection = val;
        },
        /**
         * test
         */
        async _getUserCurrentAppPolicy() {
            await getUserCurrentAppPolicy();
        },
        /**
         * test
         */
        async _getAuth() {
            await testLogin();
        }
    },
    computed: {
        ...mapState(["isRightPanelShow", "isInvitationPanelShow", ""]),

        pannelWidth() {
            return this.$store.state.isRightPanelShow === true ? 500 : 0;
        },
        isInvitationlWidth() {
            return this.isInvitationPanelShow === true ? 500 : 0;
        },
        disabled() {
            return this.multipleSelection.length > 0 ? false : true;
        }
    }
};
</script>
<style lang="scss" scoped>

.container {
    width: 90%;
    margin-left: 50px;
    margin: 0 auto;
    box-sizing: 100%;
}
.user-list {
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}
.user-count {
    margin-right: 10px;
}
.user-set {
    padding: 15px 0;
    overflow: hidden;
    .btn-item {
        cursor: pointer;
        height: 34px;
        line-height: 34px;
        padding: 0 10px;
        background: #fff;
        border: none;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin-right: 10px;
    }
    .invite-member {
        margin: 0;
        float: right;
        cursor: pointer;
    }
}
.seachInput {
    display: inline-block;
    width: 200px;
    height: 36px;
    box-sizing: border-box;
    .el-button {
    }
}

.pannel-enter-active,
.pannel-leave-active {
    transition: all 1s ease;
}
.pannel-enter,
.pannel-leave-to {
    width: 0;
}
</style>

