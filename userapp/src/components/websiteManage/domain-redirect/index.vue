<template>
    <div>
        <div class="tip" v-if="isWarmShow">
            <h5 class="title">温馨提示:</h5>
            <span class="content" >{{warmPromptText}}</span>
            <button class="handler-btn btn-darkblue-notboard" @click="toSet">立即配置</button>
            <button class="close-tip" @click="closeTip"><i class="iconfont iconguanbi"></i></button>
        </div>
        <RedirectDomainList
            :tableData="redirectDomainListData"
            @deleteCurDomain="_deleteCurDomain"
            @editor="editor"
           
        />
        <el-dialog
            width="0"
            :visible.sync="dialogShow"
            :show-close="false"
            :close-on-click-modal="false"
        >
            <AddRedirectDomain
                v-if="dialogShow"
                title="编辑"
                :source-domain="sourceDomain"
                :_targetDomain="targetDomain"
                :domain-list="activeAndNotInUseDomainList"
                :isEditor="isEditor"
                :id="id"
                @closeDialog="closeDialog"
                @get301List="_get301List"
            />
        </el-dialog>
    </div>
</template>
<script>
// 301重定向 begin
import RedirectDomainList from "_c/websiteManage/domain-redirect/redirect-list.vue";
import AddRedirectDomain from "_c/websiteManage/domain-redirect/add.vue";
import * as domainRedirectApi from "@/api/request/domainRedirectApi";
export default {
    components: {
        RedirectDomainList,
        AddRedirectDomain
    },
    data() {
        return {
            warmPromptText:
                "",
            isWarmShow:false,    
            isEditor: true,
            dialogShow: false,
            redirectDomainListData: [],
            activeAndNotInUseDomainList: [],
            sourceDomain: "",
            targetDomain: "",
            id: ""
        };
    },
    mounted() {
        this._get301List();
    },
    methods: {
        async _get301List() {
            let { data, status } = await domainRedirectApi.get301List();
            this.redirectDomainListData = data;
            if (status === 200) {
                if (data.handleType ===2) {
                  this.warmPromptText = "您解析成功的域名均已添加301，您可对列表301信息进行编辑或再进行域名解析";
                  this.isWarmShow=true;
                }else if (data.handleType===1){
                      this.warmPromptText =
                        "您还没有解析成功的域名，请进行域名解析";
                        this.isWarmShow=true;
                }else{
                   this.isWarmShow=false;
                }
            }
            if(JSON.parse(sessionStorage.getItem("isWarmShow"))){
                 this.isWarmShow=false;
                
            }
        },
        //// 301 ////
        async _getActiveAndNotInUseDomainList() {
            let {
                data
            } = await domainRedirectApi.getActiveAndNotInUseDomainList();
            this.activeAndNotInUseDomainList = data;
        },
        /**
         * 删除当前域名
         */
        async _deleteCurDomain(domainId) {
            this.$confirm("提示", {
                title: "提示",
                message: "确定要删除当前301重定向信息吗？",
                iconClass: "icon-warning",
                callback: async action => {
                    if (action === "confirm") {
                        let {
                            data,
                            status
                        } = await domainRedirectApi.deleteDomainRedirection(
                            domainId
                        );
                        if (status === 200) {
                            this._get301List();
                            this.$notify({
                                customClass: "notify-success",
                                message: `域名删除成功`,
                                duration: 1500,
                                showClose: false
                            });
                        }
                    }
                }
            });
        },
        closeTip(){
            this.isWarmShow =false;
              sessionStorage.setItem("isWarmShow",true)
        },
        editor(row) {
            this._getActiveAndNotInUseDomainList();
            this.sourceDomain = row.sourceDomain;
            this.targetDomain = row.targetDomain;
            this.id = row.id;
            this.dialogShow = true;
        },
        toSet(){
            this.$emit("toSet")  
        },
        closeDialog() {
            this.dialogShow = false;
          
        }
    }
};
</script>
<style lang="scss" scoped>
.tip {
    background: #f6fdfe;
    padding: 8px 16px;
    border: 1px solid #b9cbcf;
    border-radius: 2px;
    margin-bottom: 8px;
    .title {
        display: inline-block;
    }
    .content {
        font-size: 14px;
        padding-left: 8px;
    }
    .handler-btn {
        margin-left: 32px;
    }
    .close-tip{
        float: right;
        i{
            font-size: 14px;
            color: #8c8c8c;
        }
    }
}
</style>


