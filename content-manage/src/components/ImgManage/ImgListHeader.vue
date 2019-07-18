<template>
    <el-header class="content-header">
        <template v-if="!isBatchHeaderShow">
            <div class="seachInput head-item">
                <el-input
                    size="small"
                    v-model="picSearchOptions.keyword"
                    placeholder="输入图片名称搜索"
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
                <span @click="switchIsDesc('asc')">
                    <i class="sort-icon asc"  :class="{'asc-icon-on ':ascSort}"></i>
                    <!-- <svg-icon v-if="picSearchOptions.isDescending" icon-class="off-arrow"></svg-icon>
                    <svg-icon v-else icon-class="top-arrow"></svg-icon>-->
                </span>
                <span @click="switchIsDesc('dec')">
                    <i class="sort-icon dec"  :class="{'dec-icon-on ':descSort}"></i>
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
    props: ["picSearchOptions", "isBatchHeaderShow", "countPic"],
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
.content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8eaf3;
    background: #fff;
    margin-bottom: 24px;
}
.seachInput {
    display: inline-block;
    width: 248px;
    /* height: 36px; */
    box-sizing: border-box;
    margin-left: 22px;
}
.select-sort {
    display: inline-block;
    width: 117px;
    box-sizing: border-box;
    height: 32px;
    margin: 0 16px 0 7px;
}
.head-item {
    display: inline-block;
    flex: none;
}
.mode-item {
    display: inline-block;
    width: 45px;
    padding: 8px 0;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    .mode-icon {
        display: inline-block;
        width: 16px;
        height: 14px;
    }
}
.list-mode {
    border-right: none;
    margin-left: 16px;

    .list-icon {
        background: url("~img/list-mode.png") no-repeat center;
        background-size: 100%;
    }
    .list-iconOn {
        background: url("~img/list-modeOn.png") no-repeat center;
        background-size: 100%;
    }
}

.grid-mode {
    .mode-icon {
        background: url("~img/grid-mode.png") no-repeat center;
        background-size: 100%;
    }
    .mode-iconOn {
        background: url("~img/grid-modeOn.png") no-repeat center;
        background-size: 100%;
    }
}
.head-right,
.head-middle {
    float: right;
    display: flex;
    align-items: center;
}
.head-middle {
    .sort-icon {
        display: inline-block;
        width: 16px;
        height: 14px;
    }
    .asc{
        background: url("~img/content-icon/asc.png") no-repeat center;
        background-size: contain;
    }
    .asc-icon-on {
        background: url("~img/content-icon/asc-on.png") no-repeat center;
        background-size: contain;
    }
    .dec{
         background: url("~img/content-icon/desc.png") no-repeat center;
        background-size: contain;
    }
     .dec-icon-on{
         background: url("~img/content-icon/desc-on.png") no-repeat center;
        background-size: contain;
    }
}
.upload-wrap {
    border: none;
    font-size: 12px;
    border-radius: 3px;
    margin-right: 25px;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    background: #00c1de;
    color: #fff;
    font-weight: 400;
}
</style>
