<template>
    <el-container class="member-container">
        <el-aside style="width:100px">
            <page-submenu>
                <template v-slot:title>网站会员</template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content" style="padding:32px">
            <el-row class="user-list">
                <h4 class="member-title">成员列表</h4>
                <div class="member-body">
                    <div class="b-header">
                        <span class="times" >注册时间</span>
                         <el-date-picker
                            v-model="timeState"
                            type="date"
                            placeholder="请选择时间">
                        </el-date-picker>
                        <div class="one"></div>
                        <el-date-picker
                            v-model="timeEnd"
                            type="date"
                            placeholder="请选择时间">
                        </el-date-picker>
                        <div class="search">
                            <el-input placeholder="请输入内容" v-model="search">
                                <template slot="append">
                                    <i class="icon iconfont iconbianzu"></i>
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
                                label="归属站点">
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
export default {
    name: "members-manage",
    components: {
        PageSubmenu,
        Edit
    },
    data() {
        return {
            timeState: '',
            timeEnd: '',
            search:'',
            list: [{
               pageTitle: 'pageTitle' 
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
        remove(){

        },
        //编辑会员
        edit(){
            this.isEdit = true
        },
        //关闭编辑
        closeEdit(){
            this.isEdit = false
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
     padding: 0 8px;
 }
</style>
<style lang="scss" scoped>
.member-content {
    font-family:"PingFangSC-Regular,PingFangSC";
    .member-title {
        font-size:14px;
        font-weight:400;
        color:rgba(38,38,38,1);
        margin: 3px 0 17px;
        padding-left: 10px;
        border-left: 2px solid #09CCEB;
    }
    .member-body {
        border-top: 1px solid #e5e5e5;
        .b-header {
            padding: 24px 0 22px;
            height: 40px;
            line-height: 40px;
            .times {
                margin-right: 16px;
            }
            .one {
                display: inline-block;
                width: 16px;
                height: 1px;
                background: #e5e5e5;
                margin: 1px 16px 0;
            }
            .search {
                float: right;
                width: 420px;
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