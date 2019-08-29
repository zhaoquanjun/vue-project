<template>
    <div class="keyword-answer">
        <div v-if="!addAnswer" class="keyword-answer-content">
            <div v-for="item in keywordList" :key="item" class="keyword-list">
                <span>
                    <span>状态</span>
                    <span class="select-item">
                        <el-select
                            size="small"
                            v-model="item.matchName"
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
                    <el-input
                        type="text"
                        placeholder="请输入关键词"
                        v-model="item.keyword"
                        maxlength="30"
                        show-word-limit
                        @blur="checkKeyword"
                    ></el-input>
                    <div class="ym-form-item__error" v-show="error.onerrorTip">{{error.onerrorText}}</div>
                </span>
                <button class="addKeyword">
                    <i class="iconfont iconX"></i>
                </button>
            </div>
        </div>
        <div v-else class="table-list">
            <header class="reply-title">回复内容</header>
            <div class="handler-menu">
                <el-input
                    size="medium"
                    v-model="serchTitle"
                    placeholder="输入名称搜索"
                    @keyup.enter.native="searchEnterFun"
                    class="input-with-select"
                >
                    <i class="el-icon-search el-input__icon" style="cursor: pointer;" slot="suffix"></i>
                </el-input>
                <button class="answer-btn" @click="handlerAdd">添加回复</button>
            </div>

            <ul class="advance-list__area">
                <li>
                    <p class="list-columns__1">功能</p>
                    <p class="list-columns__2">条件</p>
                    <p class="list-columns__3">操作</p>
                </li>
                <li v-for="(item, index) in data" :key="index">
                    <p class="list-columns__1 ellipsis">{{item.title}}</p>
                    <p class="list-columns__2 ellipsis">{{item.condition}}</p>
                    <div class="list-columns__3 handler-btn">
                        <button>
                            <i class="iconfont iconcaozuo"></i>
                        </button>
                        <button>
                            <i class="iconfont iconhuishouzhan"></i>
                        </button>
                    </div>
                </li>
            </ul>
            <div class="paging">
                <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { trim } from "@/utlis/index.js";
export default {
    props: ["addAnswer"],
    data() {
        return {
            keywordCount:2,
            serchTitle: "",
            keyword: "",
            error: {
                onerrorTip: false,
                onerrorText: ""
            },
          
            matchValue: "true",
            data: [
                {
                    title:
                        "微信推广（可自定义页面、文章、产品分享到微信时显示的封面、标题、描述）",
                    condition: "的服务号或订阅号,并且设置了JS接口安全域名"
                }
            ],
              matchOption: [
                {
                    matchValue: "2",
                    matchLabel: "半匹配"
                },
                {
                    matchValue: "1",
                    matchLabel: "全匹配"
                }
            ],
            keywordList:[
                {
                    matchType:2,
                    matchName:"半匹配",
                    keyword:"123"
                }
            ]
        };
    },
    methods: {
        changeStatus() {},
        //校验关键词
        checkKeyword() {
            if (!trim(this.keyword)) {
                this.error.onerrorTip = true;
                this.error.onerrorText = "关键词不能为空";
                return false;
            } else {
                this.error.onerrorTip = false;
                this.error.onerrorText = "";
                return true;
            }
        },
        // 回车搜索
        searchEnterFun() {},
        // 添加回复
        handlerAdd() {
            this.$emit("handlerAddAnswer", false);
        }
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
button {
    border: none;
    background: transparent;
}
.keyword-answer {
    .keyword-answer-content {
        padding: 24px 0 44px 16px;
        border-top: 1px solid #e5e5e5;
        .keyword-list{
            padding-bottom: 32px;
        }
        .select-item {
            padding-left: 16px;
        }
        .addKeyword {
            padding-left: 24px;
        }
        .keyword {
            padding-left: 16px;
            position: relative;
            display: inline-block;
            width: 60%;
        }
    }
    .table-list {
        .advance-list__area {
            border: 1px solid #e5e5e5;
            li {
                display: flex;
                align-items: center;
                padding: 24px 32px;
                p {
                    display: inline-block;
                    font-size: 14px;
                    line-height: 22px;
                    padding-right: 16px;
                }
                p.list-columns__1,
                p.list-columns__2 {
                    width: 45%;
                }
                .list-columns__3 {
                    width: 10%;
                    color: #0595e6;
                    cursor: pointer;
                }
            }
            li:first-of-type {
                border-bottom: 1px solid #e5e5e5;
                p {
                    color: #a1a8b1;
                }
            }
            .handler-btn {
                display: flex;
                justify-content: space-between;
                .iconfont {
                    color: #262626;
                }
            }
        }
        .paging {
            float: right;
            padding-top: 33px;
        }
        .handler-menu {
            padding: 32px 0;
            .answer-btn {
                float: right;
                width: 90px;
                height: 40px;
                background: rgba(9, 204, 235, 1);
                border-radius: 2px;
                color: #fff;
            }
            .input-with-select {
                width: 260px;
            }
        }
    }
}
</style>