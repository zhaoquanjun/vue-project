<template>
    <el-container id="content-manage">
        <el-main>
            <list-header
            style="margin-left: 16px;    margin-bottom: 16px;"
                v-if="$store.state.dashboard.isContentwrite"
                :count-data="countData"
                :totalRecord="recyclePageResult.totalRecord"
                :display-name="displayName"
                :recycle-search-options="pageSearchOptions"
                :is-batch-header-show="isBatchHeaderShow"
                :recycle-temp-data="recycleTempData"
                @getRecycleDataList="getPageList"
                @batchRecovery="batchRecovery"
                
            ></list-header>
            <el-main>
                <div class="recycle-tip">回收站的内容可保存30天，30天之后将永久删除</div>
                <List
                    style="margin-left: 16px;"
                    :recycle-page-result="recyclePageResult"
                    :recycle-search-options="pageSearchOptions"
                    :recycle-temp-data="recycleTempData"
                    @getRecycleDataList="getPageList"
                    @batchRecovery="batchRecovery"
                    @handleSelectionChange="handleSelectionChange"
                ></List>
                <el-dialog
                    width="0"
                    style="z-index:10"
                    :close-on-click-modal="false"
                    :show-close="false"
                    :visible.sync="isInvitationPanelShow"
                ></el-dialog>
                <right-pannel
                    :style="{width:isInvitationlWidth+'px'}"
                    @closeRightPanel="closeCreateDialog"
                >
                    <span slot="title-text">恢复页面</span>
                    <div class="createSiteName">
                        <span class="createSiteTitle">页面标题</span>
                        <el-input
                            v-model="reconveryData.title"
                            placeholder="请输入内容"
                            class="createSiteNameInput"
                        ></el-input>
                    </div>
                    <div class="createSiteName">
                        <span class="createSiteTitle">页面地址</span>
                        <el-input
                            v-model="reconveryData.url"
                            placeholder="请输入内容"
                            class="createSiteNameInput"
                        ></el-input>
                    </div>

                    <div slot="footer" class="pannel-footer">
                        <button @click="recovery" class="cl-button cl-button--small cl-button--primary">恢复</button>
                        <button @click="closeCreateDialog" class="cl-button cl-button--small cl-button--primary_notbg">取消</button>
                    </div>
                </right-pannel>
            </el-main>
        </el-main>
    </el-container>
</template>
<script>
import ListHeader from "_c/Recycle/components/ListHeader";
import List from "_c/Recycle/components/List";
import * as recycleManageApi from "@/api/request/recycleManageApi";
import environment from "@/environment/index.js";
import RightPannel from "@/components/common/RightPannel";
import { trim } from "@/utlis/index.js";
export default {
    components: {
        ListHeader,
        List,
        RightPannel,
    },
    data() {
        return {
            recycleTempData: {
                type:"page",
                keyword:"title",
                batchText:"个页面",
                placeholder: '输入页面标题搜索',
                firstColumnName:"页面标题",
                secondColumnName:"所属网站",
                thirdColumnName:"删除时间",
                forthColumnName:"保留天数"
            },
            displayName: "文章",
            countData: 0,
            idsList: [],
            selectedData: [],
            isInvitationPanelShow: false,
            recyclePageResult: {},
            dialogTableVisible: false,
            totalSum: 0,
            pageSearchOptions: {
                title: "",
                orderColumns: "deletetime",
                pageIndex: 1,
                pageSize: 10,
                isDescending: true
            },
            reconveryData:{
                title:"",
                url:"",
                siteId: 0,
                pageId:0
            }
        };
    },
    mounted() {
        this.getPageList();
    },
    created(){
        this.keyupEnter();
    },  
    methods: {
        keyupEnter(){
            document.onkeydown = e =>{
                if (e.keyCode === 13) {
                this.isInvitationPanelShow && this.recovery()
                }
            }
        },
        // 获取列表
        async getPageList(node) {
            this.$Loading.show();            
            let { data, status } = await recycleManageApi.getPageList(
                this.pageSearchOptions
            );
            this.$Loading.hide();
            this.recyclePageResult = data;
            this.recyclePageResult.list.forEach((item, index) => {
                item.url = this.recyclePageResult.list[
                    index
                ].url.substr(1);
            });
        },
        // 恢复页面
        async batchRecovery(pageInfo) {
            console.log(pageInfo);
            
            this.isInvitationPanelShow = true;
            this.reconveryData.title = pageInfo.title;
            this.reconveryData.url = pageInfo.url;
            this.reconveryData.siteId = pageInfo.siteId;
            this.reconveryData.pageId = pageInfo.id;
        },
        // 关闭弹窗
        closeCreateDialog(){
            this.isInvitationPanelShow = false;
        },
        async recovery(){
            let {
                status,
                data
            } = await recycleManageApi.pageRecovery(this.reconveryData);
            if (status === 200) {
                this.isInvitationPanelShow = false;
                this.$notify({
                    customClass: "notify-success", //  notify-success ||  notify-error
                    message: `恢复成功`,
                    duration: 1500,
                    showClose: false
                });
                this.getPageList();
            }
            else{
                this.$notify({
                    customClass: "notify-error", //  notify-success ||  notify-error
                    message: `恢复失败，请重试`,
                    duration: 1500,
                    showClose: false
                });
            }
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
<style  scoped>

</style>
<style lang="scss" scoped>
@import "../../style/contentDetail";

.createSiteName{
    margin-top: 16px;
    .createSiteNameInput{
        margin-top:16px;
    }
}
</style>





