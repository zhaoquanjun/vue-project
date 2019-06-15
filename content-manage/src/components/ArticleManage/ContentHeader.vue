<template>
    <el-header class="content-header">
        <div class="seachInput head-item">
            <el-input size="small" placeholder="输入文章标题搜索" class="input-with-select">
                <el-button slot="append">
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
                 @change="changeSelected"
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
                 @change="changeSelected"
                 >
                    <el-option
                        v-for="item in orderOptions"
                        :key="item.orderValue"
                        :label="item.orderLabel"
                        :value="item.orderValue"
                    ></el-option>
                </el-select>
            </span>
            <svg-icon icon-class="top-arrow"></svg-icon>
            <svg-icon icon-class="off-arrow"></svg-icon>
            <span class="list-mode mode-item">
                <svg-icon icon-class="list-mode "></svg-icon>
            </span>
            <span class="grid-mode mode-item">
                <svg-icon icon-class="grid-mode"></svg-icon>
            </span>
        </div>
        <div class="head-item head-right">
            <span class="upload-wrap">
                <svg-icon icon-class="upload-img"></svg-icon>
            </span>
        </div>
    </el-header>
</template>
<script>
export default {
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
    methods:{
      changeSelected(value){
        console.log(value,'value=====')
      }
    },
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
.head-item{
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
.head-right,.head-middle{
  float: right;
}
.upload-wrap {
    margin-right: 25px;
    cursor: pointer;
    display: inline-block;
    width: 45px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: #00c1de;
}
</style>
