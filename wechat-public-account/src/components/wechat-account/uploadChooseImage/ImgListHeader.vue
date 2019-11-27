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
                <button @click="switchIsDesc('dec')" class="desBtn">
                    <i class="iconfont iconxiayi" :style="{'color':(descSort?'#FF6B00':'#262626')}"></i>
                </button>
                <button @click="switchIsDesc('asc')" class="desBtn" style="margin-left:8px">
                    <i class="iconfont iconshangyi" :style="{'color':(ascSort?'#FF6B00':'#262626')}"></i>
                </button>

                <button class="list-mode mode-item" @click="showType('list')" v-show="!isPopup">
                   
                    <i class="list-icon mode-icon" :class="{'list-iconOn':modeSelecte}"></i>
                </button>
                <button class="grid-mode mode-item" @click="showType('grid')" v-show="!isPopup">
                    
                    <i class="list-icon mode-icon"  :class="{'mode-iconOn':!modeSelecte}"></i>
                </button>
            </div>
            <div class="head-item head-right">
                <button
                    class="cl-button cl-button--primary"
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
                    <button class="cl-button cl-button--text_primary" @click="batchMove">移动</button>
                    <button class="cl-button cl-button--text_danger" @click="batchDelete">删除</button>
                </div>
            </div>
        </template>
    </el-header>
</template>
<script>
export default {
    props: ["picSearchOptions", "isBatchHeaderShow", "countPic", "isPopup"],
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
@import "@/styles/content-manage/manage-head.scss";
.desBtn{
    width: 32px;
    height: 32px;
    border: 1px solid #e5e5e5;
    border-radius: $--border-radius-base;
    &:hover{
        opacity: 0.8;
    }
}
.handle-batch button {
    min-width: 60px;
    margin: 0px;
}
.upload-wrap{
    &:hover{
        opacity: 0.8;
    }
}
</style>
