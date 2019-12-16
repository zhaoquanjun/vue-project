<template>
    <div>
        <div class="recycle-count">{{recycleTempData.batchText.slice(1)}}({{totalRecord}})</div>
        <el-header class="content-header">
            <template v-if="!isBatchHeaderShow">
                <div class="seachInput head-item">
                    <el-input
                        size="medium"
                        v-model="title"
                        :placeholder="recycleTempData.placeholder"
                        @keyup.enter.native="searchEnterFun"
                        class="input-with-select"
                    >
                        <i
                            class="el-icon-search el-input__icon"
                            style="cursor: pointer;"
                            slot="suffix"
                            @click="getRecycleDataList"
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
                     <button @click="switchIsDesc('dec')" class="desBtn">
                        <i
                            class="iconfont iconxiayi"
                            :class=" descSort ? 'desc-active-color': 'desc-regular-color' "
                        ></i>
                    </button>
                    <button @click="switchIsDesc('asc')" class="desBtn" style="margin-left:8px">
                        <i
                            class="iconfont iconshangyi"
                            :class=" ascSort ? 'desc-active-color': 'desc-regular-color' "
                        ></i>
                    </button>
                </div>
            </template>
            <template v-else>
                <div class="handle-batch">
                    <span>
                        已选
                        <i style="color:#fe9837;">{{countData}}</i>
                        {{recycleTempData.batchText}}
                    </span>
                    <div>
                        <button class="cl-button cl-button--text_primary" @click="batchRecovery">恢复</button>
                    </div>
                </div>
            </template>
        </el-header>
    </div>
</template>
<script>
export default {
    props: [
        "recycleSearchOptions",
        "isBatchHeaderShow",
        "countData",
        "displayName",
        "recycleTempData",
        "totalRecord"
    ],
    data() {
        return {
            ascSort: false,
            descSort: true,
            modeSelecte: true,
            options: [
                {
                    value: "deletetime",
                    label: "删除时间"
                }
            ],
            orderByLabel: "deletetime"
        };
    },
    computed: {
        title: {
            get: function() {
                return this.recycleSearchOptions[this.recycleTempData.keyword];
            },
            set: function(newVal) {
                this.recycleSearchOptions[
                    this.recycleTempData.keyword
                ] = newVal;
            }
        }
    },
    methods: {
        changeSelected(value) {
            this.recycleSearchOptions.orderByType = value;
            this.getRecycleDataList();
        },
        getRecycleDataList() {
            this.$emit("getRecycleDataList");
        },
        searchEnterFun() {
            this.getRecycleDataList();
        },
        switchIsDesc(flag) {
            if (flag === "asc") {
                this.ascSort = true;
                this.descSort = !this.ascSort;
                this.recycleSearchOptions.isDescending = false.isDescending;
            } else {
                this.descSort = true;
                this.ascSort = !this.descSort;
                this.recycleSearchOptions.isDescending = true;
            }

            this.getRecycleDataList();
        },
        batchRecovery() {
            this.$emit("batchRecovery");
        }
    }
};
</script>


<style  lang="scss" scoped>
@import "@/styles/content-manage/manage-head.scss";
.head-middle {
    padding-right: 0;
}
.recycle-count{
    font-size: $--font-size-small;
    font-weight:600;
    padding-bottom: 24px;
}
.handle-batch button {
    margin: 0;
    min-width: 60px;
}
</style>
