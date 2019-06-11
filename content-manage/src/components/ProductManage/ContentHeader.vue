<template>
    <el-header class="content-header">
        <div class="seachInput head-item">
            <el-input size="small" placeholder="输入成员手机号搜索" class="input-with-select">
                <el-button slot="append">
                    <svg-icon icon-class="search-icon"></svg-icon>
                </el-button>
            </el-input>
        </div>
        <div class="head-item head-middle">
            <span>排序</span>
            <span class="select-sort">
                <el-select 
                size="small" 
                v-model="value"
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
            options: [
                {
                    value: "选项1",
                    label: "黄金糕"
                },
                {
                    value: "选项2",
                    label: "双皮奶"
                },
                {
                    value: "选项3",
                    label: "蚵仔煎"
                },
                {
                    value: "选项4",
                    label: "龙须面"
                },
                {
                    value: "选项5",
                    label: "北京烤鸭"
                }
            ],
            value: ""
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
