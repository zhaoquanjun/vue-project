<template>
    <el-container class="member-container">
        <el-aside style="width:100px">
            <page-submenu>
                <template v-slot:title>网站会员</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content" style="padding:32px">
            <el-row class="user-list">
                <h4 class="member-title">
                    会员列表
                    <a>导出</a>
                </h4>
                <div class="member-body">
                    <div class="b-header">
                        <template style="margin-right: 16px;">
                            <el-select v-model="value" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </template>

                        <span class="times" >注册时间</span>
                        <div class="el-input-content">
                            <el-date-picker
                                v-model="timeState"
                                type="date"
                                placeholder="请选择时间">
                            </el-date-picker>
                        </div>
                        <div class="line">
                        </div>
                        <div class="el-input-content">
                            <el-date-picker
                                v-model="timeEnd"
                                @change="timeChange"
                                type="date"
                                placeholder="请选择时间">
                            </el-date-picker>
                        </div>
                        <div class="search">
                            <el-input placeholder="请输入内容" v-model="search">
                                <template slot="append" @click="timeChange">
                                    <i class="icon iconfont iconbianzu" @click="timeChange"></i>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="b-content">
                        <template>
                            <el-table
                            :data="list"
                            :header-cell-style="{color:'#A1A8B1',fontWeight: '400',lineHeight: '36px',paddingLeft: '40px'}"
                            :cell-style="{color:'#262626',lineHeight: '36px',paddingLeft: '40px'}"
                            style="width: 100%">
                            <el-table-column
                                prop="pageTitle"
                                label="注册账号">
                            </el-table-column>
                            <el-table-column
                                prop="shareTitle"
                                label="来源">
                            </el-table-column>
                            <el-table-column
                                prop="shareTitle"
                                label="注册时间">
                            </el-table-column> 
                            <el-table-column
                                prop="description"
                                label="最后登录时间">
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="220">
                                <template slot-scope="scope">
                                <i class="icon iconfont iconicon-dash-details" @click="edit(scope.row)"></i>
                                <i class="icon iconfont iconshanchu" @click="remove(scope.row)"></i>
                                </template>
                            </el-table-column>
                            </el-table>
                        </template>
                    </div>
                     <div class="paging">
                        <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="total, sizes, prev, pager, next"
                        :total="TotalRecord"
                        :page-sizes="[10,20,50]"
                        ></el-pagination>
                    </div>
                    <edit v-show="isEdit" @closeEdit='closeEdit'></edit>
                </div>
            </el-row>
        </el-main>
    </el-container>
</template>
<script>
import PageSubmenu from "@/components/common/PageSubmenu";
import Edit from "@/components/sitevip/edit.vue";
import { removeMember,getMemberList } from "@/api/request/siteMemberApi";
export default {
    name: "members-site",
    components: {
        PageSubmenu,
        Edit
    },
    data() {
        return {
            timeState: '',
            timeEnd: '',
            search:'',
            value: '',
            list: [{
               pageTitle: 'pageTitle' 
            }],
            options: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            PageSize: 10, //每页数
            PageIndex: 1, //当前页面
            TotalPage: 0, //总页数
            TotalRecord: 0, //总数量
            isEdit: false, //编辑会员
        }
    },
    methods: {
        //删除会员
        async remove(){
            this.$confirm("提示", {
                title: "提示",
                iconClass: "icon-warning",
                message:  `您确认要删除该会员吗？删除后不可恢复。`,
                callback: async action => {
                    if (action === "confirm") {
                        //let data = await removeMember(this.siteId, this.menuDetail.id);
                        if(data && data.status == 200 ) {
                            notify(this, '菜单删除成功', "success");
                            this._getMenuTree()
                        } else {
                            notify(this, '菜单删除失败', "error");
                        }
                    }
                }
            });
        },
        //编辑会员
        edit(){
            this.isEdit = true
        },
        //关闭编辑
        closeEdit(){
            this.isEdit = false
        },
        timeChange(){
            console.log('00')
        },
        //分页 每页条数
        handleSizeChange(val) {
            this.PageSize = val
            this.getInfo()
        },
        //分页 当前页数
        handleCurrentChange(val){
            this.PageIndex = val
            this.getInfo()
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
</style>
<style lang="scss" scoped>
.member-content {
    font-family:"PingFangSC-Regular,PingFangSC";
    .member-title {
        font-size:14px;
        font-weight:400;
        color:rgba(38,38,38,1);
        margin: 5px 0 17px;
        padding-left: 10px;
        border-left: 2px solid #09CCEB;
        a {
            float: right;
            width:76px;
            height:32px;
            margin-top: -14px;
            border-radius:2px;
            border:1px solid rgba(9,204,235,1);
            font-size:14px;
            font-weight:400;
            color:rgba(9,204,235,1);
            line-height:32px;
            text-align: center;
            cursor: pointer;
        }
    }
    .member-body {
        border-top: 1px solid #e5e5e5;
        .b-header {
            position: relative;
            padding: 24px 0 22px;
            height: 40px;
            line-height: 40px;
            .iconbianzu {
                padding: 10px 8px;
                cursor: pointer;
            }
            .times {
                margin: 0 16px;
            }
            .el-input-content {

            }

            .el-input-content {
                display: inline-block;
                margin-right: 50px;
            }
            .line {
                position: absolute;
                top: 44px;
                left: 519px;
                width: 16px;
                height: 1px;
                background: #e5e5e5;
            }
            .search {
                float: right;
                width: 320px;
            }
        }
        .b-content {
            border:1px solid rgba(229,229,229,1);
            min-height: 600px;
           .iconfont {
               margin-right: 20%;
           }
        }
         .paging {
                margin-top: 40px;
                text-align: right;
            }
    }
}
</style>