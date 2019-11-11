<template>
    <el-container class="member-container">
        <el-aside style="width:150px">
            <page-submenu>
                <template v-slot:title>
                    网站会员
                </template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content" style="padding:32px">
            <el-row class="user-list">
                <h4 class="member-title">
                    会员列表
                    <a @click="exportMemberList">导出</a>
                </h4>
                <div class="member-body">
                    <div class="b-header">
                        <div style="float: left;">
                            <template>
                                <el-select v-model="searchOptions.siteId" placeholder="全部来源"
                                            @change="changeSite">
                                    <el-option v-for="item in siteOptions"
                                            :key="item.siteId"
                                            :label="item.siteName"
                                            :value="item.siteId"></el-option>
                                </el-select>
                            </template>
                        </div>
                        

                        <span class="times">注册时间</span>
                        <div class="el-input-content">
                            <el-date-picker v-model="registerStartTime"
                                            @change="getMemberList"
                                            type="date"
                                            :editable=false
                                            placeholder="请选择时间">
                            </el-date-picker>
                        </div>
                        <div class="line">
                        </div>
                        <div class="el-input-content">
                            <el-date-picker v-model="registerEndTime"
                                            @change="getMemberList"
                                            type="date"
                                            :editable=false
                                            placeholder="请选择时间">
                            </el-date-picker>
                        </div>
                        <div class="search">
                            <el-input placeholder="请输入内容" v-model="searchOptions.mobile"
                    @keyup.enter.native="getMemberList">
                                <template slot="append" @click="timeChange">
                                    <i class="icon iconfont iconbianzu" @click="getMemberList"></i>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="b-content">
                        <template>
                            <el-table :data="memberPageResult.list"
                                      :header-cell-style="{color:'#A1A8B1',fontWeight: '400',lineHeight: '40px',paddingLeft: '40px'}"
                                      :cell-style="{color:'#262626',lineHeight: '40px',paddingLeft: '40px'}"
                                      style="width: 100%">
                                <el-table-column prop="mobile"
                                                 label="注册账号">
                                </el-table-column>
                                <el-table-column prop="siteName"
                                                 label="来源">
                                </el-table-column>
                                <el-table-column prop="userLevelPrt"
                                                 label="会员类型">
                                </el-table-column>
                                <el-table-column prop="createTimePrt"
                                                 label="注册时间">
                                </el-table-column>
                                <el-table-column prop="lastLoginTimePrt"
                                                 label="最后登录时间">
                                </el-table-column>
                                <el-table-column fixed="right"
                                                 label="操作"
                                                 width="220">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                            <i class="icon iconfont iconicon-dash-details" @click="edit(scope.row.id)"></i>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                            <i class="icon iconfont iconshanchu" @click="remove(scope.row.id)"></i>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </div>
                    <div class="paging">
                        <el-pagination background
                                       @size-change="handleSizeChange"
                                       @current-change="handleCurrentChange"
                                       layout="total, sizes, prev, pager, next"
                                       :total="memberPageResult.totalPage"
                                       :page-size="memberPageResult.pageSize"
                                       :page-sizes="[10,20,50]"></el-pagination>
                    </div>
                    <edit v-if="isEdit"
                          @closeEdit='closeEdit' 
                          :memberDetail="memberDetail"></edit>
                </div>
            </el-row>
        </el-main>
    </el-container>
</template>
<script>
    import PageSubmenu from "@/components/common/PageSubmenu";
    import Edit from "@/components/sitevip/edit.vue";
    import * as memberManageApi from "@/api/request/siteMemberApi";
    import { formatDate } from "@/utlis/date.js";
    export default {
        name: "members-site",
        components: {
            PageSubmenu,
            Edit
        },
        data() {
            return {
                value: '全部来源',
                memberPageResult: '',
                siteOptions: null,
                searchOptions: {
                    siteId: null,
                    registerStartTime: null,
                    registerEndTime: null,
                    mobile: '',
                    pageIndex: 1,
                    pageSize: 10,
                    isDescending: true
                },
                isEdit: false, //编辑会员,
                memberDetail: null,
                idList: []
            }
        },
        mounted() {
            this.getMemberList();
            this.getSiteList();
        },
        computed: {
            registerStartTime: {
                get: function () {
                    return this.searchOptions.registerStartTime;
                },
                set: function (newVal) {
                    if(newVal == null){
                        this.searchOptions.registerStartTime = null;
                    }else{
                        this.searchOptions.registerStartTime = formatDate(newVal, "yyyy-MM-dd hh:mm:ss");
                    }
                }
            },
            registerEndTime: {
                get: function () {
                    return this.searchOptions.registerEndTime;
                },
                set: function (newVal) {
                    if(newVal == null){
                        this.searchOptions.registerEndTime = null;
                    }else{
                        this.searchOptions.registerEndTime = formatDate(newVal, "yyyy-MM-dd hh:mm:ss");
                    }
                }
            }
        },
        methods: {
            async getMemberList(options) {
                this.$Loading.show();
                let data = await memberManageApi.getMemberList(
                    (options = this.searchOptions)
                );
                this.$Loading.hide();
                this.memberPageResult = data.data;
            },
            async exportMemberList(options) {
                let { status, data } = await memberManageApi.exportMemberList(
                    (options = this.searchOptions)
                );
                if (status == 200) {
                    var a = document.createElement('a');
                    a.setAttribute('href', data);
                    var fileName = '会员_' + this.getDate();
                    a.setAttribute('download',fileName);
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } else {
                    this.$notify({
                        customClass: "notify-error", //  notify-success ||  notify-error
                        message: `导出失败!`,
                        showClose: false,
                        duration: 1000
                    });
                }
            },
            //获取app下所有站点
            async getSiteList() {
                let { data } = await memberManageApi.getSiteList();
                data.unshift({ siteId: null, siteName: '全部来源' });
                this.siteOptions = data;
            },
            //删除会员
            async remove(id) {
                this.$confirm("提示", {
                    title: "提示",
                    iconClass: "icon-warning",
                    message: `您确认要删除该会员吗？删除后不可恢复。`,
                    callback: async action => {
                        if (action === "confirm") {
                            this.idList.push(id);
                            let { status, data } = await memberManageApi.removeMember(this.idList);
                            if (status == 200) {
                                this.$notify({
                                    customClass: "notify-success", //  notify-success ||  notify-error
                                    message: `删除成功!`,
                                    showClose: false,
                                    duration: 1000
                                });
                                this.getMemberList();
                            } else {
                                this.$notify({
                                    customClass: "notify-error", //  notify-success ||  notify-error
                                    message: `删除失败!`,
                                    showClose: false,
                                    duration: 1000
                                });
                            }
                        }
                    }
                });
            },
            //编辑会员
            edit(id) {
                this.isEdit = true
                this.getMemberDetail(id); 
            },
            async getMemberDetail(id) {
                let { data } = await memberManageApi.getMemberDetail(id);
                this.memberDetail = data;
            },
            //关闭编辑
            closeEdit() {
                this.isEdit = false
            },
            timeChange() {
                console.log('00')
            },
            //分页 每页条数
            handleSizeChange(val) {
                this.memberPageResult.pageSize = val
                this.getMemberList()
            },
            //分页 当前页数
            handleCurrentChange(val) {
                this.memberPageResult.pageIndex = val
                this.getMemberList()
            },
            changeSite(value) {
                this.searchOptions.siteId = value;
                this.getMemberList();
            },
            getDate(){
                    var now = new Date();
                    var year = now.getFullYear(); //得到年份
                    var month = now.getMonth();//得到月份
                    var date = now.getDate();//得到日期
                    month = month + 1;
                    if (month < 10) month = "0" + month;
                    if (date < 10) date = "0" + date;
                    return year + "" + month + "" + date;
            }
        }
    };
</script>
<style scoped>
    .el-input /deep/ .el-input-group__append {
        padding: 0;
    }
    .el-input--suffix /deep/ .el-input__inner {
        padding-right: 10px;
    }
    .el-input /deep/ .el-input--suffix .el-input__inner {
        padding-right: 10px;
    }
    .el-tabs /deep/ .is-active {
        background: #F8FAFC;
        border-bottom: 2px solid #09cceb !important;
    }
    /* .el-table /deep/ tbody tr:hover>td { 
        background-color:#F8FAFC !important
    } */
</style>
<style lang="scss" scoped>
    .member-content {
        font-family: "PingFangSC-Regular,PingFangSC";
        min-width: 1150px;
        height: 100%;
        .member-title

    {
        font-size: 14px;
        font-weight: 400;
        color: rgba(38,38,38,1);
        margin: 5px 0 17px;
        padding-left: 10px;
        border-left: 2px solid #09CCEB;
        a

    {
        float: right;
        width: 76px;
        height: 32px;
        margin-top: -14px;
        border-radius: 2px;
        border: 1px solid rgba(9,204,235,1);
        font-size: 14px;
        font-weight: 400;
        color: rgba(9,204,235,1);
        line-height: 32px;
        text-align: center;
        cursor: pointer;
    }

    }

    .member-body {
        border-top: 1px solid #e5e5e5;
        .b-header

    {
        position: relative;
        padding: 24px 0 22px;
        height: 40px;
        line-height: 40px;
        .iconbianzu

    {
        padding: 10px 8px;
        cursor: pointer;
    }

    .times {
        float: left;
        margin: 0 8px 0 16px;
    }

    .el-input-content {
        float: left;
        margin-right: 0px;
    }

    .line {
        float: left;
        width: 16px;
        height: 1px;
        margin: 19px 8px;
        background: #e5e5e5;
    }

    .search {
        float: right;
        width: 320px;
    }

    }

    .b-content {
        border: 1px solid rgba(229,229,229,1);
        .iconfont

    {
        cursor: pointer;
        display: inline-block;
        margin-right: 20%;
        padding: 4px 8px;
        border-radius: 2px;
        &:hover {
            background: rgba(240, 243, 247, 1);
            border-radius: 4px;
        }
    }

    }

    .paging {
        margin-top: 40px;
        text-align: right;
    }

    }
    }
</style>