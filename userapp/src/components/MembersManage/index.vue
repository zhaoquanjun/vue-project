<template>
    <el-container class="member-container">
        <el-aside style="width:120px">
            <page-submenu :submenu-list="submenuList">
                <template v-slot:title>系统设置</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content">
            <el-row class="user-list">
                <span class="member-list-title fs14">成员列表</span>
            </el-row>
            <div class="user-set">
                <el-col :span="15">
                    <span class="user-count">成员 ({{memberCount}}人)</span>
                    <button class="btn-item" :disabled="disabled" @click="authorization">权限配置</button>
                    <button class="btn-item" :disabled="disabled" @click="batchDeletMember">删除</button>
                    <div class="seachInput">
                        <el-input
                            size="medium"
                            placeholder="输入成员手机号搜索"
                            v-model="memberPhone"
                            class="input-with-select"
                        >
                            <el-button slot="append" @click="memberSearch">
                                <svg-icon icon-class="search-icon"></svg-icon>
                            </el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="3" :offset="6">
                    <button class="btn-item invite-member" @click="invitation">邀请成员</button>
                </el-col>
            </div>
            <m-table
                @tabSelection="tabSelection"
                @deleteCurMember="deleteCurMember"
                @authEdit="authEdit"
                @changePageNum="changePageNum"
                :member-info="memberInfo"
                :member-list="memberList"
            ></m-table>
            <el-dialog
                width="0"
                style="z-index:10"
                :close-on-click-modal="false"
                :show-close="false"
                :visible.sync="$store.state.isRightPanelShow || $store.state.isInvitationPanelShow"
                :before-close="handleClose"

            ></el-dialog>
            <right-pannel :style="{width:pannelWidth+'px'}">
                <span slot="title-text">权限配置</span>
                <i slot="icon-tip">
                    <svg-icon icon-class="tip-icon"></svg-icon>
                </i>
                <auth-config :userIds="userIds" :is-batch="isBatch"/>
            </right-pannel>
            <right-pannel :style="{width:isInvitationlWidth+'px'}">
                <span slot="title-text" id="title-text">邀请成员</span>
                <invitation-link></invitation-link>
            </right-pannel>
        </el-main>
    </el-container>
</template>
<script>
import MTable from "./MTable";
import RightPannel from "../RightPannel";
import AuthConfig from "./AuthConfig";
import InvitationLink from "./InvitationLink";
import PageSubmenu from "@/components/common/PageSubmenu";
import { mapMutations, mapState, mapActions } from "vuex";
export default {
    name: "homeMain",
    components: {
        MTable,
        RightPannel,
        AuthConfig,
        InvitationLink,
        PageSubmenu
    },
    data() {
        return {
            submenuList: [
                { name: "企业信息", url: "enterprise" },
                { name: "显示设置", url: "url" },
                { name: "成员列表", url: "url" }
            ],
            memberPhone: "",
            dialogVisible: true,
            memberInfo: {},
            memberList: [],
            multipleSelection: [],
            isBatch: false,
            svg: "arrow-down",
            isInvite: 1
        };
    },
    mounted() {
        this._getBeInvitedUsers().then(jsonData => {
            this.memberInfo = jsonData;
            this.memberList = jsonData.items;
        });
    },
    methods: {
        ...mapActions([
            "_getAppPolicies",
            "_getUserInfo",
            "_getBeInvitedUsers",
            "_deleteCurMember",
            "_batchDeletMember"
        ]),
        ...mapMutations([
            "ISRIGHTPANNELSHOW",
            "ISINVITATIONPANELSHOW",
            "CURMEMBVERINFO"
        ]),

        /**
         * 删除成员列表中其中一项
         */
        async deleteCurMember(curItem) {
            this.$confirm(
                "删除后,成员将不再管理您的站点, 确定要删除吗?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let { status } = await this._deleteCurMember(
                                curItem
                            );
                            if (status === 200) {
                                this.memberList = this.memberList.filter(
                                    item => item !== curItem
                                );
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                            }
                        } else {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        }
                    }
                }
            );
        },
        /**
         * 批量删除成员
         */
        async batchDeletMember() {
            console.log(this.multipleSelection, "批量删除");
            let ids = [];
            this.multipleSelection.forEach(item => ids.push(item.id));
            let data = await this._batchDeletMember(ids);
            console.log(data);
        },
        /**
         * 搜索成员
         */
        memberSearch() {
            let options = { phone: this.memberPhone };
            this._getBeInvitedUsers(options).then(jsonData => {
                this.memberInfo = jsonData;
                this.memberList = jsonData.items;
            });
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
            this._getAppPolicies();
            this.ISINVITATIONPANELSHOW(true);
            this.CURMEMBVERINFO(this.isInvite);
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
         * 改变table页码
         */
        changePageNum(page) {
            let options = { page: page };
            this._getBeInvitedUsers(options).then(jsonData => {
                this.memberList = jsonData.items;
                this.memberInfo = jsonData;
            });
        }
    },
    computed: {
        ...mapState(["isRightPanelShow", "isInvitationPanelShow"]),

        pannelWidth() {
            return this.isRightPanelShow === true ? 543 : 0;
        },
        isInvitationlWidth() {
            return this.isInvitationPanelShow === true ? 543 : 0;
        },
        disabled() {
            return this.multipleSelection.length > 0 ? false : true;
        },
        memberCount() {
            return this.memberList.length;
        },
        /**
         * 批量配置权限的成员userid集合
         */
        userIds() {
            let ids = [];
            this.multipleSelection.forEach(item => ids.push(item.userId));
            return ids;
        }
    }
};
</script>
<style lang="scss" scoped>
.member-container {
    .member-content {
        padding: 21px 14px;
    }
    .user-list {
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        .member-list-title {
            border-left: 2px solid #01c0de;
            padding-left: 10px;
        }
    }
}

.user-count {
    margin-right: 20px;
}
.user-set {
    padding: 15px 0;
    overflow: hidden;
    .btn-item {
        height: 34px;
        line-height: 34px;
        width: 90px;
        background: #eeeeee;
        border-radius: 3px;
        margin-right: 10px;
    }
    .invite-member {
        color: #fff;
        background: rgba(1, 192, 222, 1);
        margin: 0;
        float: right;
    }
}
.seachInput {
    display: inline-block;
    width: 248px;
    height: 36px;
    box-sizing: border-box;
}
</style>

