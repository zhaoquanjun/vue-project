<template>
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
                    <i>{{countData}}</i> {{recycleTempData.batchText}}
                </span>
                <div>
                    <button class="btn-small btn-lightblue-notboard" @click="batchRecovery">恢复</button>
               
                </div>
            </div>
        </template>
    </el-header>
</template>
<script>
export default {
    props: ["recycleSearchOptions", "isBatchHeaderShow", "countData","displayName", "recycleTempData"],
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
            orderByLabel: "deletetime",
            
        };
    },
    computed: {
        title : {
            get: function() {
                return this.recycleSearchOptions[this.recycleTempData.keyword];
            },
            set: function(newVal) {
                this.recycleSearchOptions[this.recycleTempData.keyword] = newVal;
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
@import "@/styles/manage-head.scss";
.head-middle{
    padding-right: 0;
}
</style>
