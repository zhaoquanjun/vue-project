<template>
    <el-header class="content-header">
        <div class="seachInput head-item">
            <el-input
                size="small"
                v-model="articleSearchOptions.title"
                placeholder="输入文章标题搜索"
                class="input-with-select"
            >
                <el-button slot="append" @click="getArticleList">
                    <svg-icon icon-class="search-icon"></svg-icon>
                </el-button>
            </el-input>
        </div>
        <div class="head-item head-middle">
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
            <span class="list-mode mode-item">
                <svg-icon icon-class="list-mode "></svg-icon>
            </span>
            <span class="grid-mode mode-item">
                <svg-icon icon-class="grid-mode"></svg-icon>
            </span>
        </div>
        <div class="head-item head-right">
            <button @click="importArticle">导入文章</button>
            <button class="add-article" @click="addArticle">新增文章</button>
            <!-- <span class="upload-wrap">
                <svg-icon icon-class="upload-img"></svg-icon>
            </span>-->
        </div>
    </el-header>
</template>
<script>
export default {
    props: ["articleSearchOptions"],
    data() {
        return {
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
            orderOptions: [
                {
                    orderValue: "0",
                    orderLabel: "创建时间"
                },
                {
                    orderValue: "1",
                    orderLabel: "标题"
                }
            ],
            orderValue: "0"
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
            this.articleSearchOptions.orderCondition = value;
            this.getArticleList();
        },
        switchIsDesc() {
            this.articleSearchOptions.isDescending = !this.articleSearchOptions
                .isDescending;
            this.getArticleList();
        },
        importArticle(){
            // this.push({
            //     path:''
            // })
        },
        addArticle(){
            this.$emit("addArticle")
        }
    }
};
</script>
<style <style lang="scss" scoped>
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
    border: 1px solid #ccc;
}
.list-mode {
    border-right: none;
}
.head-right,
.head-middle {
    float: right;
}
.head-right {
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
