<template>
    <div class="keyword-answer">
        <span>
            <span>状态</span>
            <span class="select-item">
                <el-select
                    size="small"
                    v-model="matchValue"
                    placeholder="请选择"
                    @change="changeStatus"
                     :popper-append-to-body="false"
                >
                    <el-option
                        v-for="item in matchOption"
                        :key="item.matchValue"
                        :label="item.matchLabel"
                        :value="item.matchValue"
                    ></el-option>
                </el-select>
            </span>
        </span>
        <span class="keyword">
            <input class="keyword-input" placeholder="请输入关键词" type="text" />
        </span>
    </div>
</template>
<script>
export default {
    data() {
        return {
            matchOption: [
                {
                    matchValue: "true",
                    matchLabel: "半匹配"
                },
                {
                    matchValue: "false",
                    matchLabel: "全匹配"
                }
            ],
            matchValue: "true"
        };
    },
    methods: {
        changeStatus() {}
    }
};
</script>
<style  scoped>
.el-select /deep/ .el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
    border: 1px solid #b9cbcf;
}
.el-select /deep/ .el-input__inner::-webkit-input-placeholder {
    color: #262626;
}
.el-select /deep/ .selected {
    background-color: #e0faff;
}
.el-select /deep/ .selected span {
    color: #262626;
    font-weight: 400;
}
.el-select /deep/ .selected::after {
    content: "";
    width: 22px;
    height: 22px;
    background: url("~img/element-icon/dui.png") no-repeat center;
    background-size: contain;
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 6px;
}
</style>
<style lang="scss" scoped>
.keyword-answer {
    padding: 24px 0 44px 16px;
    border-top: 1px solid #e5e5e5;
    .select-item {
        padding-left: 16px;
    }
}
.keyword {
    padding-left: 16px;
    .keyword-input {
        text-indent: 14px;
        height: 40px;
        border: none;
        border: 1px solid #b9cbcf;
        box-sizing: border-box;
        width: 60%;
        border-radius: 2px;
        vertical-align: middle;
    }
}
</style>