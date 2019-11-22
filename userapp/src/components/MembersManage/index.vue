<template>
    <el-container class="member-container">
        <!-- <el-aside style="width:150px">
            <page-submenu>
                <template v-slot:title>系统设置</template>
            </page-submenu>
        </el-aside> -->
        <el-main class="member-content" style="padding:32px">
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
                               <i class="iconfont iconbianzu"></i>
                            </el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="3" :offset="6">
                    <button class="cl-button cl-button--primary invite-member" @click="invitation">邀请成员</button>
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
                :close-on-click-modal="false"
                :show-close="false"
                :visible.sync="$store.state.isRightPanelShow"
                :before-close="handleClose"
                :modal-append-to-body="false"
            >
                <right-pannel :style="{width:pannelWidth+'px'}">
                    <span style="vertical-align: middle;" slot="title-text">{{rightPanelTitle}}</span>
                    <i slot="icon-tip" class="icon-size icon-explain"></i>
                    <auth-config
                        v-if="$store.state.isRightPanelShow"
                        ref="authConfig"
                        :userIds="userIds"
                        :is-batch="isBatch"
                        @getMemberList="getMemberList"
                    />
                </right-pannel>
               
            </el-dialog>
            <el-dialog
                width="0"
                :close-on-click-modal="false"
                :show-close="false"
                :append-to-body="false"
                :visible.sync=" $store.state.isInvitationPanelShow"
            >
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
                page: 1,
                size: 10
            }
        };
    },
    mounted() {
        // this._getBeInvitedUsers(this).then(jsonData => {
        //     this.memberInfo = jsonData;
        //     this.memberList = jsonData.items;
        // });
        // this._getUserDashboard()
        this.getMemberList();
    },
    methods: {
        ...mapActions([
            "_getAppPolicies",
            "_getEditUserAppPolicies",
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
                                this.$notify({
                                    customClass: "notify-success", // error success
                                    message: `删除成功`,
                                    duration: 1500,
                                    showClose: false
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
            this._getBeInvitedUsers(this.memberListParams).then(jsonData => {
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
         
            this.isBatch = false;
            this.rightPanelTitle = "编辑成员";
            this.ISRIGHTPANNELSHOW(true);
            this._getEditUserAppPolicies(data.userId);
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
            this.memberListParams.page = page;
            this.getMemberList();
            // let options = { page: page };
            // this._getBeInvitedUsers(options).then(jsonData => {
            //     this.memberList = jsonData.items;
            //     this.memberInfo = jsonData;
            // });
        },
        changePageSize(size) {
            this.memberListParams.size = size;
            this.getMemberList();
            // let options = { size: size };
            // this._getBeInvitedUsers(options).then(jsonData => {
            //     this.memberList = jsonData.items;
            //     this.memberInfo = jsonData;
            // });
        },
        updateUserRemark(options) {
            console.log(options);
            this._updateUserRemark(options);
        }
    },
    computed: {
        ...mapState(["isRightPanelShow", "isInvitationPanelShow"]),

        pannelWidth() {
            return this.isRightPanelShow === true ? 808 : 0;
        },
        isInvitationlWidth() {
            return this.isInvitationPanelShow === true ? 808 : 0;
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
  position: relative;
  .user-list {
    border-bottom: 1px solid #eee;
    padding-bottom: 24px;
    .member-list-title {
      border-left: 4px solid #01c0de;
      padding-left: 8px;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
.user-count {
    font-family: PingFangSC-Medium;
    font-weight: 600;
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

