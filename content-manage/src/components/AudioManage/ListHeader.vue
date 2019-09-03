<template>
    <el-header class="content-header">
        <template v-if="!isBatchHeaderShow">
            <div class="seachInput head-item">
                <el-input
                    size="small"
                    v-model="picSearchOptions.keyword"
                    placeholder="输入视频名称搜索"
                    class="input-with-select"
                >
                    <el-button slot="append" @click="getPicList">
                        <svg-icon icon-class="search-icon"></svg-icon>
                    </el-button>
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
                <button @click="switchIsDesc('asc')">
                    <i class="sort-icon asc"  :class="{'asc-icon-on ':ascSort}"></i>
                    <!-- <svg-icon v-if="picSearchOptions.isDescending" icon-class="off-arrow"></svg-icon>
                    <svg-icon v-else icon-class="top-arrow"></svg-icon>-->
                </button>
                <button @click="switchIsDesc('dec')">
                    <i class="sort-icon dec"  :class="{'dec-icon-on ':descSort}"></i>
                    <!-- <svg-icon v-if="picSearchOptions.isDescending" icon-class="off-arrow"></svg-icon>
                    <svg-icon v-else icon-class="top-arrow"></svg-icon>-->
                </button>

                <bu class="list-mode mode-item" @click="showType('list')">
                    <!-- <svg-icon icon-class="list-mode "></svg-icon> -->
                    <i class="list-icon mode-icon" :class="{'list-iconOn':modeSelecte}"></i>
                </bu>
                <span class="grid-mode mode-item" @click="showType('grid')">
                    <!-- <svg-icon icon-class="grid-mode"></svg-icon> -->
                    <i class="list-icon mode-icon" :class="{'mode-iconOn':!modeSelecte}"></i>
                </span>
            </div>
            <div class="head-item head-right">
                <el-button class="upload-wrap" @click="switchUploadBoxShowStatus">
                    <!-- <svg-icon icon-class="upload-img"></svg-icon> -->
                    上传{{displayName}}
                </el-button>
            </div>
        </template>
        <template v-else>
            <div style="padding:0 21px;width:100%">
                <span>
                    已选
                    <i>{{countPic}}</i> 张图片
                </span>
                <div style="float:right">
                    <el-button class="deleteActive" style="margin:0 16px" size="small" @click="batchMove">
                        <!-- <svg-icon icon-class="tab-moved"></svg-icon> -->
                        移动
                    </el-button>
                    <el-button class="deleteActive" size="small" @click="batchDelete">
                        <!-- <svg-icon icon-class="l-recyclebin"></svg-icon> -->
                        删除
                    </el-button>
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
            ascSort:false,
            descSort:false,
          
            modeSelecte: true,
            options: [
                {
                    value: "CreateTime",
                    label: "创建时间"
                },
                {
                    value: "FileSize",
                    label: "文件大小"
                },
                {
                    value: "FileName",
                    label: "文件名"
                }
            ],
            orderByLabel: ""
        };
    },
    methods: {
        changeSelected(value) {
            this.picSearchOptions.orderByType = value;
            this.getPicList();
        },
        getPicList() {
            this.$emit("getPicList");
        },
        switchUploadBoxShowStatus() {
            this.$emit("switchUploadBoxShowStatus");
        },
        switchIsDesc(flag) {
            if(flag==="asc"){
                this.ascSort = true;
                 this.descSort = !this.ascSort
            }else{
                this.descSort = true;
                this.ascSort = !this.descSort
            }
            this.picSearchOptions.isDescending = !this.picSearchOptions
                .isDescending;
            this.getPicList();
        },
        batchMove() {
            this.$emit("batchMove");
        },
        batchDelete() {
            this.$emit("batchDelete");
        },
        showType(value) {
            if (value === "list") {
                this.modeSelecte = true;
            }
            if (value === "grid") {
                this.modeSelecte = false;
            }
            this.$emit("showType", value);
        }
    }
};
</script>
<style  lang="scss" scoped>
@import "@/styles/manage-head.scss"
</style>
