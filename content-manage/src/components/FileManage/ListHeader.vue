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
                <template v-if="contentType==='File'">
                    <span>文件类型</span>
                    <span class="select-sort ">
                        <el-select
                            size="small"
                            v-model="fileTypeLabel"
                            placeholder="请选择"
                            @change="changeType"
                        >
                            <el-option
                                v-for="item in fileTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </span>
                    <span>置顶</span>
                    <span class="select-sort select-item">
                        <el-select
                            size="small"
                            v-model="topValue"
                            placeholder="请选择"
                            @change="changeStickStatus"
                        >
                            <el-option
                                v-for="item in topOptions"
                                :key="item.topValue"
                                :label="item.topLabel"
                                :value="item.topValue"
                            ></el-option>
                        </el-select>
                    </span>
                </template>
                <span>排序</span>
                <span class="select-sort ">
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
                >上传{{displayName}}</button>
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
                    <button
                        v-if="contentType!='Video'"
                        class="btn-small btn-lightblue-notboard"
                        @click="batchDownLoad"
                    >下载</button>
                    <button v-else class="btn-small btn-red-notboard" @click="batchDelete">删除</button>

                    <el-dropdown
                        trigger="click"
                        @command="handleCommand"
                        v-if="contentType!='Video'"
                    >
                        <span class="el-dropdown-link">
                            <button class="btn-small btn-notboard">
                                <svg-icon icon-class="across-dot"></svg-icon>
                            </button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="top">置顶</el-dropdown-item>
                            <el-dropdown-item command="cancelTop">取消置顶</el-dropdown-item>
                            <el-dropdown-item command="delete">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </template>
    </el-header>
</template>
<script>
export default {
    props: [
        "picSearchOptions",
        "isBatchHeaderShow",
        "countPic",
        "displayName",
        "contentType"
    ],
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
            topOptions: [
                {
                    topValue: "",
                    topLabel: "全部"
                },
                {
                    topValue: 1,
                    topLabel: "是"
                },
                {
                    topValue: 0,
                    topLabel: "否"
                }
            ],
            topValue: "",
            fileTypeOptions: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "Document",
                    label: "文档"
                },
                {
                    value: "Image",
                    label: "图片"
                },
                {
                    value: "Video",
                    label: "视频"
                },
                {
                    value: "Audio",
                    label: "音乐"
                },
                {
                    value: "Rar",
                    label: "压缩包"
                },
                {
                    value: "Others",
                    label: "其他"
                }
            ],
            fileTypeLabel: ""
        };
    },
    mounted() {
        this.sortType();
    },
    methods: {
        sortType() {
            if (this.contentType === "Video") {
                this.options = [
                    {
                        value: "CreateTime",
                        label: "上传时间"
                    },
                    {
                        value: "FileSize",
                        label: "视频大小"
                    }
                ];
            } else if (this.contentType === "") {
                this.options = [
                    {
                        value: "CreateTime",
                        label: "上传时间"
                    },
                    {
                        value: "FileSize",
                        label: "音频大小"
                    }
                ];
            }
        },
        changeSelected(value) {
            this.picSearchOptions.orderByType = value;
            this.getPicList();
        },
        changeType(value) {
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
             this.$confirm(`您确定要下载所选文件吗？`, "提示", {
                iconClass: "icon-warning",
                callback: async action => {
                     this.$emit("batchDownLoad");
                }
             })
           
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
</style>
