<template>
    <el-header class="content-header">
        <template v-if="!isBatchHeaderShow">
            <div class="seachInput head-item">
                <el-input
                    size="small"
                    v-model="articleSearchOptions.title"
                    placeholder="请输入文章标题搜索"
                    class="input-with-select"
                >
                    <el-button slot="append" @click="getArticleList">
                        <svg-icon icon-class="search-icon"></svg-icon>
                    </el-button>
                </el-input>
            </div>

            <div class="head-item head-right">
                <div class="head-item">
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
                    <span>排序</span>
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
                                :key="item.topValue"
                                :label="item.topLabel"
                                :value="item.topValue"
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
                </div>
                <div class="head-item head-handle-btn">
                    <!-- <button @click="importArticle">导入文章</button> -->
                    <button class="add-article" @click="addArticle">新增文章</button>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="bach-header">
                <span>
                    已选
                    <i>{{count}}</i> 个文章
                </span>
                <div style="float:right">
                    <el-button class="deleteActive" size="small" @click="batchPublish(false)">上线</el-button>
                    <el-button class="deleteActive" size="small" @click="batchPublish(true)">下线</el-button>
                    <el-button size="small" @click="batchCopy">复制</el-button>
                    <el-button class="deleteActive" style="margin-right: 10px;" size="small" @click="batchRemove">删除</el-button>
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <el-button size="small">
                                <svg-icon icon-class="across-dot"></svg-icon>
                            </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <!-- <span size="small" @click="batchclassifySet">移动</span> -->
                            <el-dropdown-item command="move">移动</el-dropdown-item>
                            <!--  <el-button size="small" @click="batchTop(2, false)">置顶</el-button> -->
                            <el-dropdown-item command="top">置顶</el-dropdown-item>
                            <!--  <el-button size="small" @click="batchTop(2, true)">取消置顶</el-button> -->
                            <el-dropdown-item command="cancelTop">取消置顶</el-dropdown-item>
                            <!-- <el-button size="small" @click="batchViewAuth">访问权限</el-button> -->
                            <!-- <el-dropdown-item command="permission">访问权限</el-dropdown-item> -->
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </template>
    </el-header>
</template>
<script>
export default {
    props: ["articleSearchOptions", "isBatchHeaderShow", "count"],
    data() {
        return {
            ascSort: false,
            descSort: false,

            statusOptions: [
                {
                    statusValue: "",
                    statusLabel: "全部"
                },
                {
                    statusValue: "true",
                    statusLabel: "上线"
                },
                {
                    statusValue: "false",
                    statusLabel: "下线"
                }
            ],
            statusValue: "",
            topOptions: [
                {
                    topValue: "",
                    topLabel: "全部"
                },
                {
                    topValue: "true",
                    topLabel: "是"
                },
                {
                    topValue: "false",
                    topLabel: "否"
                }
            ],
            topValue: "",
            orderOptions: [
                {
                    orderValue: "createtime",
                    orderLabel: "创建时间"
                }
            ],
            orderValue: "createtime"
        };
    },
    methods: {
        getArticleList() {
            this.$emit("getArticleList");
        },
        changeStatus(value) {
            this.articleSearchOptions.publishStatus = value;
            this.getArticleList();
        },
        changeOrderCondition(value) {
            this.articleSearchOptions.newsOrderColumns = value;
            this.getArticleList();
        },
        changeStickStatus(value) {
            this.articleSearchOptions.topStatus = value;
            this.getArticleList();
        },

        switchIsDesc(flag) {
            if (flag === "asc") {
                this.ascSort = true;
                this.descSort = !this.ascSort;
                this.articleSearchOptions.isDescending  = true;
            } else {
                this.descSort = true;
                this.ascSort = !this.descSort;
                this.articleSearchOptions.isDescending = false;
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
        batchPublish(flag) {
            this.$emit("batchPublish", null, flag);
        },
        //批量删除
        batchRemove() {
            this.$emit("batchRemove");
        },

        // 批量置顶 or 取消置顶
        batchTop(flag) {
            this.$emit("batchTop", null, flag);
        },

        // 批量分类设置 移动  ok
        batchclassifySet() {
            this.$emit("changeOperateName", "移动");
            this.$emit("batchMove");
        },
        // 批量设置访问权限
        batchViewAuth() {
            this.$emit("batchMove", "permission");
        },
        // 批量复制
        batchCopy() {
            this.$emit("changeOperateName", "复制");
            this.$emit("batchCopy");
        },
        handleCommand(command) {
            switch (command) {
                case "move":
                    this.batchclassifySet();
                    break;
                case "top":
                    this.batchTop(false);
                    break;
                case "cancelTop":
                    this.batchTop(true);
                    break;
                case "permission":
                    this.batchViewAuth();
                    break;
            }
        }
    }
};
</script>
<style>

.seachInput .el-input__inner {
    font-size: 12px;
}
</style>

<style <style lang="scss" scoped>
.content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8eaf3;
    background: #fff;
    margin-bottom: 24px;
    padding: 0 24px;
}
.seachInput {
    display: inline-block;
    width: 248px;
    /* height: 36px; */
    box-sizing: border-box;
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
.head-handle-btn {
    padding-left: 40px;
}

.head-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-left: 42px;
    button {
        width: 70px;
        height: 32px;
        border: 1px solid rgba(1, 192, 222, 1);
        margin-right: 8px;
        box-sizing: border-box;
        color: #01c0de;
    }
    .add-article {
        background: rgba(1, 192, 222, 1);
        color: #fff;
    }
}

.bach-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding:0 21px;
    width: 100%;
}

.head-right {
    .sort-icon {
        display: inline-block;
        width: 16px;
        height: 14px;
    }
    .asc {
        background: url("~img/content-icon/asc.png") no-repeat center;
        background-size: contain;
    }
    .asc-icon-on {
        background: url("~img/content-icon/asc-on.png") no-repeat center;
        background-size: contain;
    }
    .dec {
        background: url("~img/content-icon/desc.png") no-repeat center;
        background-size: contain;
    }
    .dec-icon-on {
        background: url("~img/content-icon/desc-on.png") no-repeat center;
        background-size: contain;
    }
}
</style>
