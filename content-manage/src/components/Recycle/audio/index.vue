<template>
    <el-container id="content-manage">
        <el-main>
            <list-header
            style="margin-left: 16px;    margin-bottom: 16px;"
                v-if="$store.state.dashboard.isContentwrite"
                :count-data="countData"
                :totalRecord="recyclePageResult.totalRecord"
                :display-name="displayName"
                :recycle-search-options="audioSearchOptions"
                :is-batch-header-show="isBatchHeaderShow"
                :recycle-temp-data="recycleTempData"
                @getRecycleDataList="getAudioList"
                @batchRecovery="batchRecovery"
                
            ></list-header>
            <el-main>
                <div class="recycle-tip">回收站的内容可保存30天，30天之后将永久删除</div>
                <List
                    style="margin-left: 16px;"
                    :recycle-page-result="recyclePageResult"
                    :recycle-search-options="audioSearchOptions"
                    :recycle-temp-data="recycleTempData"
                    @getRecycleDataList="getAudioList"
                    @batchRecovery="batchRecovery"
                    @handleSelectionChange="handleSelectionChange"
                ></List>
            </el-main>
        </el-main>
    </el-container>
</template>
<script>
import ListHeader from "_c/Recycle/components/ListHeader";
import List from "_c/Recycle/components/List";
import * as recycleManageApi from "@/api/request/recycleManageApi";
import environment from "@/environment/index.js";
import { trim } from "@/utlis/index.js";
export default {
    components: {
        ListHeader,
        List,
    },
    data() {
        return {
            recycleTempData: {
                type:"audio",
                keyword:"keyword",
                batchText:"个音频",
                placeholder: '输入音频名称搜索',
                firstColumnName:"音频名称",
                secondColumnName:"分类",
                thirdColumnName:"删除时间",
                forthColumnName:"保留天数"
            },
            displayName: "音频",
            countData: 0,
            idsList: [],
            selectedData: [],
            isInvitationPanelShow: false,
            recyclePageResult: {},
            dialogTableVisible: false,
            totalSum: 0,
            audioSearchOptions: {
                pageSize: 10,
                pageIndex: 1,
                orderByType: 1,
                isDescending: true,
                categoryIdList: [],
                keyword: "",
                isDelete: true
            },
        };
    },
    mounted() {
        this.getAudioList();
    },
    methods: {
     
        // 获取列表
        async getAudioList(node) {
            this.$Loading.show();
            let { data, status } = await recycleManageApi.getAudioList(
                this.audioSearchOptions
            );
            this.$Loading.hide();
            this.recyclePageResult = data;
        },
        // 批量恢复音频
        async batchRecovery(idlist) {
            idlist = idlist == null ? this.idsList : idlist;
            this.$confirm(
                `音频将恢复到对应分类下，确定恢复吗？`,
                "提示",
                {
                    customClass: "medium",
                    iconClass: "icon-warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let {
                                status,
                                data
                            } = await recycleManageApi.audioBatchRecovery(false, idlist);
                            if (status === 200) {
                              
                                this.$notify({
                                    customClass: "notify-success", //  notify-success ||  notify-error
                                    message: `恢复成功`,
                                    duration: 1500,
                                    showClose: false
                                });
                                this.getAudioList();
                            }
                            else{
                                this.$notify({
                                    customClass: "notify-error", //  notify-success ||  notify-error
                                    message: `恢复失败，请重试`,
                                    duration: 1500,
                                    showClose: false
                                });
                            }
                        } else {
                           
                        }
                    }
                }
            );
        },

        // 批量更新的选中数量
        handleSelectionChange(list) {
            this.idsList = [];
            this.countData = list.length;
            if (list.length < 1) return;
            list.forEach(item => {
                this.idsList.push(item.id);
            });
            this.selectedData = list;
        }
      
    },
    computed: {
        isInvitationlWidth() {
            return this.isInvitationPanelShow === true ? 480 : 0;
        },
        isBatchHeaderShow() {
            console.log(this.idsList.length);
            return this.idsList.length > 0 ? true : false;
        }
    },
  
};
</script>
<style lang="scss" scoped>
@import "../../style/contentDetail";
</style>





