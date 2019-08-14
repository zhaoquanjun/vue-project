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
                <span>文件类型</span>
                <span class="select-sort">
                    <el-select
                        size="small"
                        v-model="fileTypeLabel"
                        placeholder="请选择"
                        @change="changeSelected"
                    >
                        <el-option
                            v-for="item in fileTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </span>
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
            <div class="head-item head-right">
                <button
                    class="btn-lightblue btn-small upload-wrap"
                    @click="switchUploadBoxShowStatus"
                >上传文件</button>
            </div>
        </template>
        <template v-else>
            <div class="handle-batch">
                <span>
                    已选
                    <i>{{countPic}}</i> 个文件
                </span>
                <div>
                    <button class="btn-small btn-lightblue-notboard" @click="batchMove">移动</button>
                    <button class="btn-small btn-lightblue-notboard" @click="batchDownLoad">下载</button>
                    <button class="btn-small btn-red-notboard" @click="batchDelete">删除</button>
                      <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <button class="btn-small btn-notboard">
                                <svg-icon icon-class="across-dot"></svg-icon>
                            </button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <!-- <span size="small" @click="batchclassifySet">移动</span> -->
                            <el-dropdown-item command="move">移动</el-dropdown-item>
                            <!--  <el-button size="small" @click="batchTop(2, false)">置顶</el-button> -->
                            <el-dropdown-item command="top">置顶</el-dropdown-item>
                            <!--  <el-button size="small" @click="batchTop(2, true)">取消置顶</el-button> -->
                            <el-dropdown-item command="cancelTop">取消置顶</el-dropdown-item>
                            <!-- <el-button size="small" @click="batchViewAuth">访问权限</el-button> -->
                            <el-dropdown-item command="permission">访问权限</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
            orderByLabel: "CreateTime",
            fileTypeOptions: [
                {
                    value: "CreateTime",
                    label: "全部"
                },
                {
                    value: "FileSize",
                    label: "文档"
                },
                {
                    value: "FileName",
                    label: "图片"
                },
                {
                    value: "1",
                    label: "视频"
                },
                {
                    value: "2",
                    label: "音乐"
                },
                {
                    value: "22",
                    label: "压缩包"
                },
                {
                    value: "File3Name",
                    label: "其他"
                }
            ],
            fileTypeLabel: "CreateTime"
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
        batchDownLoad(){
            this.$emit("batchDownLoad");
        },
         handleCommand(command) {
            switch (command) {
                case "move":
                    this.batchclassifySet();
                    break;
                case "top":
                    this.batchTop(2, false);
                    break;
                case "cancelTop":
                    this.batchTop(2, true);
                    break;
                case "permission":
                    this.batchViewAuth();
                    break;
            }
        }
    }
};
</script>


<style  lang="scss" scoped>
@import "@/styles/manage-head.scss";
</style>
