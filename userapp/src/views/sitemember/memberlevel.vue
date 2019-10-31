<template>
    <el-container class="member-container">
        <el-aside style="width:150px">
            <page-submenu>
                <template v-slot:title>
                    会员等级
                </template>
            </page-submenu>
        </el-aside>
        <el-main class="member-content" style="padding:32px">
            <el-row class="user-list">
                <h4 class="member-title">
                    会员等级
                </h4>
                <div class="b-content">
                    <template>
                        <el-table :data="memberPageResult.list"
                                    :header-cell-style="{color:'#A1A8B1',fontWeight: '400',lineHeight: '36px',paddingLeft: '40px'}"
                                    :cell-style="{color:'#262626',lineHeight: '36px',paddingLeft: '40px'}"
                                    style="width: 100%">
                            <el-table-column prop="mobile"
                                                label="会员等级">
                            </el-table-column>
                            <el-table-column prop="siteName"
                                                label="状态">
                            </el-table-column>
                            
                            <el-table-column fixed="right"
                                                label="操作"
                                                width="220">
                                <!-- <template slot-scope="scope">
                                    <i class="icon iconfont iconicon-dash-details" @click="edit(scope.row.id)"></i>
                                    <i class="icon iconfont iconshanchu" @click="remove(scope.row.id)"></i>
                                </template> -->
                            </el-table-column>
                        </el-table>
                    </template>
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
        data() {
            return {
                memberPageResult: {
                    list: [
                        {
                           mobile: '注册会员',
                           siteName: '正常'
                        }
                    ]
                }
            }
        },
        components: {
            PageSubmenu
        },
        methods: {
            //删除会员
            remove() {
            },
            //编辑会员
            edit() {
            }
        }
    };
</script>
<style lang="scss" scoped>
    .member-content {
        font-family: "PingFangSC-Regular,PingFangSC";
        .member-title{
            font-size: 14px;
            font-weight: 400;
            color: rgba(38,38,38,1);
            margin: 5px 0 17px;
            padding-left: 10px;
            border-left: 2px solid #09CCEB;
        }
    }
</style>