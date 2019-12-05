<template>
    <el-header class="content-header">
        <template v-if="!isBatchHeaderShow">
            <div class="seachInput head-item">
                <el-input
                    size="medium"
                    v-model="articleSearchOptions.keyword"
                    placeholder="输入名称搜索"
                    @keyup.enter.native="searchEnterFun"
                    class="input-with-select"
                >
                    <i
                        class="el-icon-search el-input__icon"
                        style="cursor: pointer;"
                        slot="suffix"
                        @click="getArticleList"
                    ></i>
                </el-input>
            </div>

            <div class="head-item head-right">
                <div class="head-item head-handle-right">
                    <span>状态</span>
                    <span class="select-item">
                        <el-select
                            size="small"
                            v-model="statusValue"
                            placeholder="请选择"
                            @change="changeStatus"
                        >
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.statusValue"
                                :label="item.statusLabel"
                                :value="item.statusValue"
                            ></el-option>
                        </el-select>
                    </span>
                    <span>置顶</span>
                    <span class="select-item">
                        <el-select
                            size="small"
                            v-model="topValue"
                            placeholder="请选择"
                            @change="changeStickStatus"
                        >
                            <el-option
                                v-for="item in topOptions"
                                :key="item.orderValue"
                                :label="item.orderLabel"
                                :value="item.orderValue"
                            ></el-option>
                        </el-select>
                    </span>
                    <!-- <span>排序</span>
                    <span class="select-sort select-item">
                        <el-select
                            size="small"
                            v-model="orderValue"
                            placeholder="请选择"
                            @change="changeOrderCondition"
                        >
                            <el-option
                                v-for="item in orderOptions"
                                :key="item.orderValue"
                                :label="item.orderLabel"
                                :value="item.orderValue"
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
                    </button> -->
                </div>
                <div class="head-item head-handle-btn">
                    <!-- <button class="btn-lightblue btn-small" @click="importArticle">导入产品</button> -->
                    <button class="cl-button cl-button--primary" @click="addArticle">新增产品</button>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="bach-header">
                <span>
                    已选
                    <i style="color:#fe9837;">{{count}}</i> 个产品
                </span>
                <div class="bach-hanlder">
                    <button class="cl-button cl-button--text_info" @click="batchPublish(3, false)">上架</button>
                    <button class="cl-button cl-button--text_info" @click="batchPublish(3, true)">下架</button>
                    <button class="cl-button cl-button--text_info" @click="batchCopy">复制</button>
                    <button class="cl-button cl-button--text_info" @click="handleCommand('move')">移动</button>
                    <button class="cl-button cl-button--text_info" @click="handleCommand('top')">置顶</button>
                    <button class="cl-button cl-button--text_info" @click="handleCommand('cancelTop')">取消置顶</button>
                    <button class="cl-button cl-button--text_danger" @click="batchRemove(1,true)">删除</button>
                    <!-- <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <button class="btn-small btn-notboard btn-black-notboard">
                                <i class="iconfont iconsangedian"></i>
                            </button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="move">移动</el-dropdown-item>
                            <el-dropdown-item command="top">置顶</el-dropdown-item>
                            <el-dropdown-item command="cancelTop">取消置顶</el-dropdown-item>
                            
                        </el-dropdown-menu>
                    </el-dropdown> -->
                </div>
            </div>
        </template>
    </el-header>
</template>
<script>
export default {
    props: ["articleSearchOptions", "isBatchHeaderShow", "count", "idsList"],
    data() {
        return {
            ascSort: false,
            descSort: true,
            statusOptions: [
                {
                    statusValue: "",
                    statusLabel: "全部"
                },
                {
                    statusValue: "true",
                    statusLabel: "上架"
                },
                {
                    statusValue: "false",
                    statusLabel: "下架"
                }
            ],
            statusValue: "",
            orderOptions: [
                {
                    orderValue: "CreateTime",
                    orderLabel: "创建时间"
                }
            ],
            orderValue: "CreateTime",
            topOptions: [
                {
                    orderValue: "",
                    orderLabel: "全部"
                },
                {
                    orderValue: 1,
                    orderLabel: "是"
                },
                {
                    orderValue: 0,
                    orderLabel: "否"
                }
            ],
            topValue: ""
        };
    },
    methods: {
        getArticleList() {
            this.$emit("contentTableList");
        },
        searchEnterFun() {
            this.getArticleList();
        },
        changeStatus(value) {
            this.articleSearchOptions.isOnSell = value;
            this.getArticleList();
        },
        changeOrderCondition(value) {
            this.articleSearchOptions.orderByType = value;
            this.getArticleList();
        },
        changeStickStatus(value) {
            if (isNaN(parseInt(value))) {
                value = null;
            } else {
                value = !!value;
            }
            this.articleSearchOptions.isTop = value;
            this.getArticleList();
        },
        switchIsDesc(flag) {
            if (flag === "asc") {
                this.ascSort = true;
                this.descSort = !this.ascSort;
                console.log(this.ascSort);
                this.articleSearchOptions.isDescending = false;
            } else {
                this.descSort = true;
                this.ascSort = !this.descSort;
                this.articleSearchOptions.isDescending = true;
            }

            this.getArticleList();
        },
        importArticle() {
            // this.push({
            //     path:''
            // })
        },
        addArticle() {
            this.$emit("addArticle");
        },
        //////批量操作
        // 批量 上下架
        batchPublish(type, flag) {
            let options = {
                switchType: type,
                flag: flag,
                idList: this.idsList
            };
            this.$emit("batchSwitchStatus", options);
        },
        //批量删除
        batchRemove(type, flag) {
            let options = {
                switchType: type,
                flag: flag,
                idList: this.idsList
            };
            this.$emit("batchSwitchStatus", options);
        },

        // 批量置顶 or 取消置顶
        batchTop(type, flag) {
            let options = {
                switchType: type,
                flag: flag,
                idList: this.idsList
            };
            this.$emit("batchSwitchStatus", options);
        },

        // 批量分类设置 移动  ok
        batchclassifySet() {
            this.$emit("batchMove", "batchmove");
        },
        // 批量设置访问权限
        batchViewAuth() {
            this.$emit("batchMove", "permission");
        },
        // 批量复制
        batchCopy() {
            this.$emit("batchMove", "batchCopy");
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


<style <style lang="scss" scoped>
@import "@/styles/content-manage/manage-head.scss";

.btn-black-notboard {
    padding: 6px;
    &:hover {
        background: rgba(240, 243, 247, 1);
        border-radius: 4px;
    }
}
.select-item {
    display: inline-block;
    width: 80px;
    box-sizing: border-box;
    height: 32px;
    margin: 0 16px 0 7px;
}
.select-sort {
    width: 117px;
}
.head-item {
    display: inline-block;
    flex: none;
}
.head-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 200px);
    .head-handle-right {
        margin-left: 24px;
    }
}
.head-handle-btn {
    padding-left: 30px;
}
.bach-hanlder button {
    padding: 9px 16px;
    margin: 0;
    min-width: 60px;
}
</style>
