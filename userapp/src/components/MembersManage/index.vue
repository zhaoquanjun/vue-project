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
                    <button
                        class="btn-item"
                        :disabled="disabled"
                        @click="authorization"
                        :class="[disabled?'noselected-btn-item':'selected-btn-item']"
                    >权限配置</button>
                    <button
                        class="btn-item"
                        :class="[disabled?'noselected-btn-item':'selected-btn-item']"
                        style="width:66px"
                        :disabled="disabled"
                        @click="batchDeletMember"
                    >删除</button>
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
                @changePageSize="changePageSize"
                @updateUserRemark="updateUserRemark"
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
                :modal-append-to-body="false"
            >
                <right-pannel :style="{width:pannelWidth+'px'}">
                    <span style="vertical-align: middle;" slot="title-text" >
                    {{rightPanelTitle}}
                    </span>
                    <i slot="icon-tip" class="icon-size icon-explain"></i>
                    <auth-config
                        ref="authConfig"
                        :userIds="userIds"
                        :is-batch="isBatch"
                        @getMemberList="getMemberList"
                    />
                </right-pannel>
                <right-pannel :style="{width:isInvitationlWidth+'px'}">
                    <span slot="title-text" id="title-text">邀请成员</span>
                    <invitation-link></invitation-link>
                </right-pannel>
            </el-dialog>
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
import { updateUserLastAppIdAndCookie } from "@/api/index.js";
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
                // { name: "企业信息", url: "/system/role" },
                // { name: "显示设置", url: "/system/role" },
                { name: "成员列表", url: "/system/role" }
            ],
            rightPanelTitle: "权限配置",
            memberPhone: "",
            dialogVisible: true,
            memberInfo: {},
            memberList: [],
            multipleSelection: [],
            isBatch: false,
            svg: "arrow-down",
            isInvite: 1,
            memberListParams: {
                phone: "",
                pageNum: "",
                pageSize: 9
            }
        };
    },
    mounted() {
        this._getBeInvitedUsers().then(jsonData => {
            this.memberInfo = jsonData;
            this.memberList = jsonData.items;
        });
        // this._getUserDashboard()
    },
    methods: {
        ...mapActions([
            "_getAppPolicies",
            "_getUserPolicy",
            "_getBeInvitedUsers",
            "_deleteCurMember",
            "_batchDeletMember",
            "_updateUserRemark",
            "_getUserDashboard"
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
            console.log(curItem);
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
                            console.log(status);
                            console.log(status === 200);
                            if (status === 200) {
                                this.memberList = this.memberList.filter(
                                    item => item !== curItem
                                );
                                this.getMemberList();
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                            }
                        }
                    }
                }
            );
        },
        /**
         * 批量删除成员
         */
        async batchDeletMember() {
            let appId = this.multipleSelection[0].appId;
            let ids = [];
            this.multipleSelection.forEach(item => ids.push(item.userId));
            let params = {
                ids: ids,
                appId: appId
            };
            this.$confirm(
                "删除后,成员将不再管理您的站点, 确定要删除吗?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        if (action === "confirm") {
                            let { status } = await this._batchDeletMember(
                                params
                            );
                            if (status === 200) {
                                this.getMemberList();
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
        getMemberList() {
            let options = { phone: this.memberPhone };
            this._getBeInvitedUsers(options).then(jsonData => {
                this.memberInfo = jsonData;
                this.memberList = jsonData.items;
            });
        },
        /**
         * 搜索成员
         */
        async memberSearch() {
            let options = { phone: this.memberPhone };
            this._getBeInvitedUsers(options).then(jsonData => {
                console.log(jsonData, "jsondata");
                this.memberInfo = jsonData;
                this.memberList = jsonData.items;
            });
        },
        /**
         * 权限配置展开
         * 多人权限配置
         */
        authorization() {
            this.rightPanelTitle = "权限配置";
            this.ISRIGHTPANNELSHOW(true);
            this.CURMEMBVERINFO(this.isInvite);
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
            console.log(data);
            this.rightPanelTitle = "权限配置";
            this.ISRIGHTPANNELSHOW(true);
            this._getAppPolicies();
            this._getUserPolicy(data.userId);
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
            this.memberListParams.pageNum = page;
            let options = { page: page };
            this._getBeInvitedUsers(options).then(jsonData => {
                this.memberList = jsonData.items;
                this.memberInfo = jsonData;
            });
        },
        changePageSize(size){
           this.memberListParams.pageNum = size;
            let options = { size: size };
            this._getBeInvitedUsers(options).then(jsonData => {
                this.memberList = jsonData.items;
                this.memberInfo = jsonData;
            });
        },
        updateUserRemark(options) {
            console.log(options);
            this._updateUserRemark(options);
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
            return this.memberInfo.totalCount;
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
<style scoped>
.seachInput /deep/ .el-input__inner,
.seachInput /deep/ .el-input-group__append .el-button,
.seachInput /deep/ .el-input-group__append {
    border-radius: 0 !important;
    font-size: 12px;
}
.seachInput /deep/ .el-input-group__append {
    /* border: none; */
    background: #eeeeee;
}
</style>

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
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #333333;
    margin-right: 20px;
}
.user-set {
    padding: 15px 0;
    overflow: hidden;
    .btn-item {
        height: 34px;
        line-height: 34px;
        width: 90px;

        margin-right: 10px;
    }
    .selected-btn-item {
        background: #eeeeee;
        color: #262626;
    }
    .noselected-btn-item {
        background: #f2f2f2;
        color: #c3c3c3;
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
.icon-explain {
    margin: 0 5px;
    background: url("~img/memberManage/explain.png") no-repeat center;
    background-size: contain;
}
</style>

