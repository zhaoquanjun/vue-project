<template>
    <el-container id="content-manage">
        <el-main>
            <list-header
            style="margin-left: 16px;    margin-bottom: 16px;"
                v-if="$store.state.dashboard.isContentwrite"
                :count-pic="countPic"
                :display-name="displayName"
                :pic-search-options="picSearchOptions"
                :is-batch-header-show="isBatchHeaderShow"
                @getPicList="getPicList"
                @batchDelete="batchDelete"
                
            ></list-header>
            <el-main>
                <div class="recycle-tip">回收站的内容可保存30天，30天之后将永久删除</div>
                <List
                    style="margin-left: 16px;"
                    :img-page-result="imgPageResult"
                    :pic-search-options="picSearchOptions"
                    @getPicList="getPicList"
                    @batchRemove="batchRemovePic"
                    @handleSelectionChange="handleSelectionChange"
                ></List>
            </el-main>
        </el-main>
    </el-container>
</template>
<script>
import ListHeader from "_c/Recycle/components/ListHeader";
import List from "_c/Recycle/components/List";
import * as fileManageApi from "@/api/request/fileManageApi";
import * as fileCategoryManageApi from "@/api/request/fileCategoryManageApi";
import environment from "@/environment/index.js";
import { trim } from "@/utlis/index.js";
export default {
    components: {
        ListHeader,
        List,
    },
    data() {
        return {
            displayName: "文件",
            isImgList: false,
            countPic: 0,
            idsList: [],
            selectedImg: [],
            isInvitationPanelShow: false,
            imgPageResult: {},
            dialogTableVisible: false,
            totalSum: 0,
            picSearchOptions: {
                pageSize: 10,
                pageIndex: 1,
                orderByType: 1,
                isTop: null,
                isDescending: true,
                categoryIdList: [],
                keyword: "",
                isDelete: false,
                fileExtensionType: null
            },
        };
    },
    mounted() {
        this.getPicList();
    },
    methods: {
     
        // 获取列表
        async getPicList(node) {
            const loading = this.$loading({
                lock: true,
                spinner: "loading-icon",
                background: "rgba(255, 255, 255, 0.75)"
            });
            let { data, status } = await fileManageApi.getPicList(
                this.picSearchOptions
            );
           loading.close();
            this.imgPageResult = data;
        },
        // 批量删除列表
        async batchRemovePic(idlist) {
            this.$confirm(
                `删除后，网站中引用的文件数据将同步删除，同时文件将被移动到回收站，是否确认删除？`,
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
                            } = await fileManageApi.batchRemove(true, idlist);
                            if (status === 200) {
                              
                                this.$notify({
                                    customClass: "notify-success", //  notify-success ||  notify-error
                                    message: `删除成功`,
                                    duration: 1500,
                                    showClose: false
                                });
                                this.getPicList();
                            }
                        } else {
                            // this.$message({
                            //     type: "info",
                            //     message: "已取消删除"
                            // });
                        }
                    }
                }
            );
        },

        // 批量更新的选中数量
        handleSelectionChange(list) {
            this.idsList = [];
            this.countPic = list.length;
            if (list.length < 1) return;
            list.forEach(item => {
                this.idsList.push(item.id);
            });
            this.selectedImg = list;
        },
       
        //批量删除
        batchDelete() {
            this.batchRemovePic(this.idsList);
        },
      
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
@import "../style/contentDetail";
.recycle-tip{
margin: 0 16px; 
height:32px;
background:rgba(255,248,242,1);
border-radius:2px;
border:1px solid rgba(250,223,197,1);
text-align: center;
line-height: 32px;
color: #FE9837;
margin-bottom: 16px;
}
</style>





