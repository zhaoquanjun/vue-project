<template>
    <el-header class="content-header">
        <template v-if="!isBatchHeaderShow">
            <div class="seachInput head-item">
                <el-input
                    size="medium"
                    v-model="picSearchOptions.keyword"
                    placeholder="输入名称搜索"
                    @keyup.enter.native="searchEnterFun"
                    class="input-with-select"
                >
                    <i
                        class="el-icon-search el-input__icon"
                        style="cursor: pointer;"
                        slot="suffix"
                        @click="getPicList"
                    ></i>
                </el-input>
            </div>
            <div class="head-item head-middle">
              
                <span>排序</span>
                <span class="select-sort">
                    <el-select
                        size="small"
                        v-model="orderByLabel"
                        placeholder="请选择"
                        @change="changeSelected"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </span>
                <span @click="switchIsDesc('asc')">
                    <i class="sort-icon asc" :class="{'asc-icon-on ':ascSort}"></i>
                </span>
                <span @click="switchIsDesc('dec')">
                    <i class="sort-icon dec" :class="{'dec-icon-on ':descSort}"></i>
                </span>
            </div>
        </template>
        <template v-else>
            <div class="handle-batch">
                <span>
                    已选
                    <i>{{countPic}}</i> 个文件
                </span>
                <div>
                    <button class="btn-small btn-lightblue-notboard" @click="batchMove">恢复</button>
               
                </div>
            </div>
        </template>
    </el-header>
</template>
<script>
export default {
    props: ["picSearchOptions", "isBatchHeaderShow", "countPic","displayName"],
    data() {
        return {
            ascSort: false,
            descSort: true,
            modeSelecte: true,
            options: [
                {
                    value: "CreateTime",
                    label: "上传时间"
                },
                {
                    value: "FileName",
                    label: "文件名称"
                },
                {
                    value: "DownloadCount",
                    label: "下载次数"
                },
                {
                    value: "FileSize",
                    label: "文件大小"
                }
            ],
            orderByLabel: "CreateTime",
            
        };
    },
    methods: {
        changeSelected(value) {
            
            this.picSearchOptions.orderByType = value;
            this.getPicList();
        },
        changeType(value){
            this.picSearchOptions.fileExtensionType = value;
            this.getPicList();
        },
        getPicList() {
            this.$emit("getPicList");
        },
        searchEnterFun() {
            this.getPicList();
        },
        switchUploadBoxShowStatus() {
            this.$emit("switchUploadBoxShowStatus");
        },
        changeStickStatus(value) {
            if (isNaN(parseInt(value))) {
                value = null;
            } else {
                value = !!value;
            }
            this.picSearchOptions.isTop = value;
            this.getPicList();
        },
        switchIsDesc(flag) {
            if (flag === "asc") {
                this.ascSort = true;
                this.descSort = !this.ascSort;
                this.picSearchOptions.isDescending = false.isDescending;
            } else {
                this.descSort = true;
                this.ascSort = !this.descSort;
                this.picSearchOptions.isDescending = true;
            }

            this.getPicList();
        },
        batchMove() {
            this.$emit("batchMove");
        },
        batchDelete() {
            this.$emit("batchDelete");
        },
        batchDownLoad() {
            this.$emit("batchDownLoad");
        },
        handleCommand(command) {
            switch (command) {
                case "top":
                    this.$emit("batchTop", true);
                    break;
                case "cancelTop":
                    this.$emit("batchTop", false);
                    break;
                case "delete":
                    this.batchDelete();
                    break;
            }
        }
    }
};
</script>


<style  lang="scss" scoped>
@import "@/styles/manage-head.scss";
.head-middle{
    padding-right: 0;
}
</style>
