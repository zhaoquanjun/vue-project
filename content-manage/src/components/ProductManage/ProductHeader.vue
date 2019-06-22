<template>
    <el-header class="content-header">
        <template v-if="!isBatchHeaderShow">
            <div class="seachInput head-item">
                <el-input
                    size="small"
                    v-model="articleSearchOptions.title"
                    placeholder="请输入名称或ID进行精准查询"
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
                    <span class="select-sort">
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
                    <span class="select-sort">
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
                    <span @click="switchIsDesc">
                        <svg-icon v-if="articleSearchOptions.isDescending" icon-class="off-arrow"></svg-icon>
                        <svg-icon v-else icon-class="top-arrow"></svg-icon>
                    </span>
                    <!-- <span class="list-mode mode-item">
                    <svg-icon icon-class="list-mode "></svg-icon>
                </span>
                <span class="grid-mode mode-item">
                    <svg-icon icon-class="grid-mode"></svg-icon>
                    </span>-->
                </div>
                <div class="head-item head-right">
                    <button @click="importArticle">导入产品</button>
                    <button class="add-article" @click="addArticle">新增产品</button>
                    <!-- <span class="upload-wrap">
                <svg-icon icon-class="upload-img"></svg-icon>
                    </span>-->
                </div>
            </div>
        </template>

        <template v-else>
            <div style="padding:0 21px">
                <span>
                    已选
                    <i>{{count}}</i> 个产品
                </span>
                <el-button size="small" @click="batchPublish(3, false)">上架</el-button>
                <el-button size="small" @click="batchPublish(3, true)">下架</el-button>
                <el-button size="small" @click="batchCopy">复制</el-button>
                <el-button size="small" @click="batchRemove(1,true)">删除</el-button>
                <el-button size="small" @click="batchclassifySet">移动</el-button>
                <el-button size="small" @click="batchTop(2, false)">置顶</el-button>
                <el-button size="small" @click="batchTop(2, true)">取消置顶</el-button>
                <el-button size="small" @click="batchViewAuth">访问权限</el-button>

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
                    orderValue: "1",
                    orderLabel: "创建时间"
                },
                {
                    orderValue: "2",
                    orderLabel: "标题"
                }
            ],
            orderValue: "1"
        };
    },
    methods: {
        getArticleList() {
            this.$emit("contentTableList");
        },
        changeStatus(value) {
            this.articleSearchOptions.isOnSell = value;
            this.getArticleList();
        },
        changeOrderCondition(value) {
            this.articleSearchOptions.orderByType = value;
            this.getArticleList();
        },
        switchIsDesc() {
            this.articleSearchOptions.isDescending = !this.articleSearchOptions
                .isDescending;
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
        batchPublish(type,flag) {
            let options = {
                switchType: type,
                flag: flag,
                idList: this.idsList
            };
            this.$emit("batchSwitchStatus", options);
        },
        //批量删除
        batchRemove(type,flag) {
            let options = {
                switchType: type,
                flag: flag,
                idList: this.idsList
            };
            this.$emit("batchSwitchStatus", options);
        },
      
        // 批量置顶 or 取消置顶
        batchTop(type,flag) {
            let options = {
                switchType: type,
                flag: flag,
                idList: this.idsList
            };
            this.$emit("batchSwitchStatus", options);
        },

          // 批量分类设置 移动  ok
        batchclassifySet() {
            this.$emit("batchMove",'batchmove');
        },
        // 批量设置访问权限
        batchViewAuth() {
            this.$emit("batchMove","permission");
        },
        // 批量复制
        batchCopy() {
            this.$emit("batchMove",'batchCopy');
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
    border: 1px solid #ccc;
}
.list-mode {
    border-right: none;
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
</style>
