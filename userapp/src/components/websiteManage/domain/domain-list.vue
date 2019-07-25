<template>
    <div class="table-list" id="table-list">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" class="content-table">
            <el-table-column prop="domain" label="域名"></el-table-column>
            <el-table-column prop="httpsStatusDesc" label="HTTPS状态">
                <template slot-scope="scope">
                    <template v-if="scope.row.cdnDomainResolveStatus===3">
                        <el-switch
                        v-model="scope.row.httpsStatus"
                        @change="swichChange(scope.row.httpsStatus,scope.row)"
                    ></el-switch>
                    </template>
                    <span v-else>—</span>
                </template>
            </el-table-column>
            <el-table-column prop="cdnDomainResolveStatusDesc" label="解析状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div class="handle-btn-wrap">
                        <button class="resolve-set">解析设置</button>
                        <button class="handle-btn delete-btn" @click="handleDelete(scope.row,scope.$index)"></button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: ["tableData"],
    data() {
        return {
            value: true
        };
    },
    methods: {
        swichChange(status,row) {
            let domainId = row.id;
            if(!!status){
                this.$emit("oneKeyEnableHttps",domainId)
            }else{
                this.$emit("disableHttps",domainId)
            }
        },
        handleDelete(row,index){
            console.log(row,index,'0----')
            let domainId = row.id;
            this.$emit("_deleteCdnDomain",domainId,index)
        }
    }
};
</script>
<style scoped>
@import "../../../styles/table.css";
</style>
<style lang="scss" scoped>
@import "../../../styles/table1.scss";
.handle-btn-wrap {
    .resolve-set {
        color: #00c1de;
    }
}
</style>

