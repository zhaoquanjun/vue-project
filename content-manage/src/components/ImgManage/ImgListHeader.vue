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
                    <i class="el-icon-search el-input__icon" style="cursor: pointer;" slot="suffix" @click="getList"></i>
               
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
                    <i class="sort-icon asc" :class="{'asc-icon-on ':ascSort}"></i>
                  
                </button>
                <button @click="switchIsDesc('dec')">
                    <i class="sort-icon dec" :class="{'dec-icon-on ':descSort}"></i>
                   
                </button>

                <button class="list-mode mode-item" @click="showType('list')">
                   
                    <i class="list-icon mode-icon" :class="{'list-iconOn':modeSelecte}"></i>
                </button>
                <button class="grid-mode mode-item" @click="showType('grid')">
                    
                    <i class="list-icon mode-icon"  :class="{'mode-iconOn':!modeSelecte}"></i>
                </button>
            </div>
            <div class="head-item head-right">
                <button
                    class="btn-lightblue btn-small upload-wrap"
                    @click="switchUploadBoxShowStatus"
                >
                   
                    上传图片
                </button>
            </div>
        </template>
        <template v-else>
            <div class="handle-batch">
                <span>
                    已选
                    <i>{{countPic}}</i> 张图片
                </span>
                <div>
                    <button class="btn-small btn-lightblue-notboard" @click="batchMove">移动</button>
                    <button class="btn-small btn-red-notboard" @click="batchDelete">删除</button>
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
            this.getList();
        },
        getList() {
            this.$emit("getList");
        },
        searchEnterFun() {
            this.getList();
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

            this.getList();
        },
        batchMove() {
            this.$emit("batchMove", true);
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
@import "@/styles/manage-head.scss";
</style>
