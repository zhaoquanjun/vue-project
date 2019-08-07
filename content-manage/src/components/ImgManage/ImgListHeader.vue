<template>
    <el-header class="content-header">
        <template v-if="!isBatchHeaderShow">
            <div class="seachInput head-item">
                <el-input
                    size="small"
                    v-model="picSearchOptions.keyword"
                    placeholder="输入图片名称搜索"
                    @keyup.enter.native="searchEnterFun"
                    class="input-with-select"
                     clearable
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
                <span @click="switchIsDesc('asc')">
                    <i class="sort-icon asc" :class="{'asc-icon-on ':ascSort}"></i>
                    <!-- <svg-icon v-if="picSearchOptions.isDescending" icon-class="off-arrow"></svg-icon>
                    <svg-icon v-else icon-class="top-arrow"></svg-icon>-->
                </span>
                <span @click="switchIsDesc('dec')">
                    <i class="sort-icon dec" :class="{'dec-icon-on ':descSort}"></i>
                    <!-- <svg-icon v-if="picSearchOptions.isDescending" icon-class="off-arrow"></svg-icon>
                    <svg-icon v-else icon-class="top-arrow"></svg-icon>-->
                </span>

                <span class="list-mode mode-item" @click="showType('list')">
                    <!-- <svg-icon icon-class="list-mode "></svg-icon> -->
                    <i class="list-icon mode-icon" :class="{'list-iconOn':modeSelecte}"></i>
                </span>
                <span class="grid-mode mode-item" @click="showType('grid')">
                    <!-- <svg-icon icon-class="grid-mode"></svg-icon> -->
                    <i class="list-icon mode-icon" :class="{'mode-iconOn':!modeSelecte}"></i>
                </span>
            </div>
            <div class="head-item head-right">
                <el-button class="upload-wrap" @click="switchUploadBoxShowStatus">
                    <!-- <svg-icon icon-class="upload-img"></svg-icon> -->
                    上传图片
                </el-button>
            </div>
        </template>
        <template v-else>
            <div class="handle-batch">
                <span>
                    已选
                    <i>{{countPic}}</i> 张图片
                </span>
                <div>
                    <button class="btn-small  btn-lightblue-notboard" @click="batchMove">移动</button>
                    <button class="btn-small  btn-red-notboard"  @click="batchDelete">删除</button>
                </div>
            </div>
        </template>
    </el-header>
</template>
<script>
export default {
    props: ["picSearchOptions", "isBatchHeaderShow", "countPic"],
    data() {
        return {
            ascSort: false,
            descSort: true,

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
            orderByLabel: "CreateTime"
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
        searchEnterFun() {
            this.getPicList();
        },
        switchUploadBoxShowStatus() {
            this.$emit("switchUploadBoxShowStatus");
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
<style >
.seachInput .el-input /deep/ .el-input__inner{
   
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.seachInput /deep/ .el-input-group__append .el-button,.el-input-group__append {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>

<style  lang="scss" scoped>
@import "@/styles/manage-head.scss";
</style>
