<template>
    <div class="keyword-answer">
        <div v-if="!addAnswer" class="keyword-answer-content">
            <div v-for="(item,index) in keywordList" :key="index" class="keyword-list">
                <span>
                    <span class="title">回复设置</span>
                    <span class="select-item">
                        <el-select
                            size="small"
                            :value="item.matchType=='1'?'半匹配':'全匹配'"
                            placeholder="请选择"
                            @change="changeStatus($event,index)"
                            :popper-append-to-body="false"
                        >
                            <el-option
                                v-for="item in matchOption"
                                :key="item.matchType"
                                :label="item.matchLabel"
                                :value="item.matchType"
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
                        @blur="checkKeyword(index)"
                    ></el-input>
                    <div
                        class="ym-form-item__error"
                        v-show="error[index].onerrorTip"
                    >{{error[index].onerrorText}}</div>
                </span>
                <div style="display:inline-block">
                    <button
                        class="keyword-btn addKeyword"
                        @click="removeKeyword(index)"
                        v-if="keywordList &&keywordList.length>1"
                    >
                        <i class="iconfont iconjianhao"></i>
                    </button>
                    <button
                        class="keyword-btn addKeyword"
                        @click="addKeyword"
                        v-if="keywordList.length-1==index&&keywordList.length!=10"
                    >
                        <i class="iconfont iconjiahao"></i>
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="table-list">
            <div class="handler-menu">
                <el-input
                    size="medium"
                    v-model="serchTitle"
                    placeholder="请输入内容"
                    @keyup.enter.native="searchEnterFun"
                    class="input-with-select"
                >
                    <i
                        class="el-icon-search el-input__icon"
                        style="cursor: pointer;"
                        slot="suffix"
                        @click="searchEnterFun"
                    ></i>
                </el-input>
                <button class="answer-btn" @click="handlerAdd">添加回复</button>
            </div>

            <ul class="advance-list__area">
                <li class="title">
                    <p class="list-columns__1">关键词</p>
                    <p class="list-columns__2">回复内容</p>
                    <p class="list-columns__3">操作</p>
                </li>
               <div>
                    <li v-for="(item, index) in keywordData.list" :key="index">
                    <p class="list-columns__1 ellipsis">
                        <span v-for="(child,index) in item.keywordList" :key="index">
                            {{child.keyword}}
                            <i
                                v-if="item.keywordList.length-1 !=index && index ==0"
                            >，</i>
                        </span>
                    </p>
                    <p class="list-columns__2 ellipsis">{{magTypeFn(item.msgType)}}</p>
                    <div class="list-columns__3 handler-btn">
                        <button>
                            <i class="iconfont iconbianji" @click="handlerAdd(item)"></i>
                        </button>
                        <button @click="handlerDelete(item.id)">
                            <i class="iconfont iconshanchu"></i>
                        </button>
                    </div>
                </li>
            </div>
                <div class="empty-table" v-if="keywordData.list && keywordData.list.length===0">
                    <img src="~img/table-empty.png" />
                    <span>无数据</span>
                </div>
            </ul>
            <div class="paging">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :total="keywordData.totalRecord"
                    :page-count="keywordData.totalPage"
                    :page-size="keywordData.pageSize"
                    :page-sizes="[10,20,50]"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { trim } from "@/utlis/index.js";
export default {
    props: ["addAnswer", "keywordData", "searchOption", "propKeywordList"],
    data() {
        return {
            keywordCount: 2,
            serchTitle: "",
            keyword: "",
            error: [
                {
                    onerrorTip: false,
                    onerrorText: ""
                }
            ],

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
                    matchType: "1",
                    matchLabel: "半匹配"
                },
                {
                    matchType: "2",
                    matchLabel: "全匹配"
                }
            ],
            matchLabel: "1",
            keywordList: [
                {
                    matchType: "1",
                    keyword: ""
                }
            ]
        };
    },
    mounted() {
        if (this.propKeywordList && this.propKeywordList.length > 0) {
            this.keywordList = this.propKeywordList;
            this.error = [];
        }
        this.propKeywordList &&
            this.propKeywordList.forEach(index => {
                this.error.push({
                    onerrorTip: false,
                    onerrorText: ""
                });
            });
    },
    methods: {
        changeStatus(value, index) {
            this.keywordList[index].matchType = value;
        },
        //校验关键词
        checkKeyword(index) {
            if (!trim(this.keywordList[index].keyword)) {
                this.error[index].onerrorTip = true;
                this.error[index].onerrorText = "关键词不能为空";
                return false;
            } else {
                this.error[index].onerrorTip = false;
                this.error[index].onerrorText = "";
                return true;
            }
        },
        // 回车搜索
        searchEnterFun() {
            this.searchOption.Keyword = this.serchTitle;
            this.$emit("getKeywordReplyList");
        },
        // 添加回复
        handlerAdd(item) {
            this.$emit("handlerAddAnswer", false, JSON.stringify(item));
        },
        addKeyword() {
            if (this.keywordList.length >= 10) {
                return;
            }
            this.keywordList.push({
                matchType: 2,
                keyword: ""
            });
            this.error.push({
                onerrorTip: false,
                onerrorText: ""
            });
        },
        removeKeyword(index) {
            this.keywordList.splice(index, 1);
        },
        handlerDelete(id) {
            this.$emit("removeKeywordReply", id);
        },
        magTypeFn(type) {
            switch (type) {
                case 1:
                    return "图片";
                case 2:
                    return "文字";
                case 3:
                    return "图文";
            }
        }
    },
    watch: {
        propKeywordList() {
            this.keywordList = this.propKeywordList;
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
.el-input /deep/ .el-input__inner {
    border: 1px solid #E5E5E5;
    width: 360px;
}
.handler-menu .el-input /deep/ .el-input__inner {
    border: 1px solid #E5E5E5;
    width: 600px;
}
.el-input /deep/ .el-input__inner:hover {
    border: 1px solid #E5E5E5;
}
.el-input /deep/ .el-input__inner:focus {
    border: 1px solid #E5E5E5;
}
.el-input /deep/ .el-input__inner {
    border: 1px solid #E5E5E5;
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
        // padding: 24px 0 0 0;
        // border-top: 1px solid #e5e5e5;
        .keyword-list {
            padding-bottom: 32px;
            .title{
                color: #B9CBCF
            }
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
            width: 30%;
        }
    }
    .table-list {
        .advance-list__area {
            border: 1px solid #e5e5e5;
            li {
                display: flex;
                align-items: center;
                padding: 24px 32px;
                border-bottom: 1px solid #e5e5e5;

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
                    width: 7%;
                    color: #0595e6;
                    cursor: pointer;
                }
            }
            div {
                li:hover {
                    background-color: #f0fcfe;
                }
            }
            .title {
                p {
                    color: #a1a8b1;
                }
            }
            
            .handler-btn {
                display: flex;
                justify-content: space-between;
                .iconfont {
                    color: #262626;
                    &:hover{
                           color: #09cceb
                    }
                }
            }
        }
        .paging {
            float: right;
            padding-top: 33px;
        }
        .handler-menu {
            padding: 8px 0 24px;
            .answer-btn {
                float: right;
                width: 90px;
                height: 40px;
                border-radius: 2px;
                color: rgba(9, 204, 235, 1);
            }
            .input-with-select {
                width: 600px;
            }
        }
    }
}
.keyword-btn {
    .iconfont {
        font-size: 32px;
        color: #09cceb;
        vertical-align: middle;
    }
}
</style>