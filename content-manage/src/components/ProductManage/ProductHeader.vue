<template>
    <el-header class="content-header">
        <template v-if="!isBatchHeaderShow">
            <div class="seachInput head-item">
              
                      <el-input
                    size="medium"
                    v-model="articleSearchOptions.keyword"
                    placeholder="输入图片名称搜索"
                    @keyup.enter.native="searchEnterFun"
                    class="input-with-select"
                    
                >
                    <i class="el-icon-search el-input__icon" style="cursor: pointer;" slot="suffix" @click="getArticleList"></i>
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
                                :key="item.orderValue"
                                :label="item.orderLabel"
                                :value="item.orderValue"
                            ></el-option>
                        </el-select>
                    </span>
                    <!-- <span @click="switchIsDesc">
                        <svg-icon v-if="articleSearchOptions.isDescending" icon-class="off-arrow"></svg-icon>
                        <svg-icon v-else icon-class="top-arrow"></svg-icon>
                    </span>-->
                    <span @click="switchIsDesc('asc')">
                        <i class="sort-icon asc" :class="{'asc-icon-on ':ascSort}"></i>
                    </span>
                    <span @click="switchIsDesc('dec')">
                        <i class="sort-icon dec" :class="{'dec-icon-on ':descSort}"></i>
                    </span>
                </div>
                <div class="head-item head-handle-btn">
                    <button class="btn-lightblue btn-small" @click="importArticle">导入产品</button>
                    <button class="add-article btn-lightblue btn-small" @click="addArticle">新增产品</button>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="bach-header">
                <span>
                    已选
                    <i>{{count}}</i> 个产品
                </span>
                <div class="bach-hanlder">
                    <button class="btn-small  btn-lightblue-notboard" @click="batchPublish(3, false)">上架</button>
                    <button class="btn-small  btn-lightblue-notboard" @click="batchPublish(3, true)">下架</button>
                    <button class="btn-small  btn-lightblue-notboard" @click="batchCopy">复制</button>
                    <button class="btn-small  btn-red-notboard" 
                        @click="batchRemove(1,true)"
                    >删除</button>
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

                <!-- <el-button type="danger" @click="batchRemove(null)">批量删除</el-button>
        <el-button type="danger" @click="batchTop(null, false)">批量置顶</el-button>
        <el-button type="danger" @click="batchTop(null, true)">批量取消置顶</el-button>
        <el-button type="danger" @click="batchPublish(null,false)">批量上线</el-button>
        <el-button type="danger" @click="batchPublish(null,true)">批量下线</el-button>
                <el-button type="danger" @click="batchMove(null)">批量移动</el-button>-->
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
                },
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
<style>
.seachInput .el-input__inner {
    font-size: 12px;
}
</style>

<style <style lang="scss" scoped>
@import "@/styles/manage-head.scss";


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
      
    }
    .add-article {
        background: rgba(9, 204, 235, 1 );
        color: #fff;
        margin-left: 16px;
    }
}
</style>
