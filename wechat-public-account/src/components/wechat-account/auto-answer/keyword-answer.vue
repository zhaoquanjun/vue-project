<template>
    <div class="keyword-answer">
        <div v-if="!addAnswer" class="keyword-answer-content">
            <div v-for="(item,index) in keywordList" :key="index" class="keyword-list">
                <span>
                    <span class="title">关键词</span>
                    <span class="select-item">
                        <el-select
                            size="small"
                            :value="item.matchType=='1'?'半匹配':'全匹配'"
                            placeholder="请选择"
                            @change="changeStatus($event,index)"
                            :popper-append-to-body="false"
                        >
                            <template slot = "prefix">
                                <i class = 'icon iconfont prefixIcon' :class="item.matchType=='1'?'iconicon-banpipei':'iconicon-quanpipei'" />
                            </template>
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
                <button class="answer-btn cl-button cl-button--primary" @click="handlerAdd">添加回复</button>
            </div>

            <ul class="advance-list__area">
                <li class="title">
                    <p class="list-columns__1">回复内容</p>
                    <p class="list-columns__2">关键词</p>
                    <p class="list-columns__3">操作</p>
                </li>
               <div>
                    <li v-for="(item, index) in keywordData.list" :key="index">
                    <p v-if="item.msgType == 1" class="list-columns__1 ellipsis">
                        <img :src="item.data.imageMsg.picUrl" />
                    </p>
                    <p v-if="item.msgType == 2" class="list-columns__1 ellipsis">
                        {{magTypeFn(item.msgType)}}:{{item.data.textMsg.text}}
                    </p>
                    <p v-if="item.msgType == 3" class="list-columns__1 ellipsis">
                        {{magTypeFn(item.msgType)}}
                    </p>
                    <el-tooltip placement="top-start">
                        <div slot="content" style="max-width:400px;">
                             <span v-if="keywordListFn(item.keywordList,2)" class="keyword">全匹配：{{keywordListFn(item.keywordList,2)}}；</span>
                             <span v-if="keywordListFn(item.keywordList,1)" >半匹配：{{keywordListFn(item.keywordList,1)}}</span>
                        </div>
                        <p class="list-columns__2 ellipsis pointer">
                            <i v-if="keywordListFn(item.keywordList,2)" class="icon iconfont iconicon-quanpipei"></i>
                            <span v-if="keywordListFn(item.keywordList,2)" class="keyword">{{keywordListFn(item.keywordList,2)}}</span>
                            <i v-if="keywordListFn(item.keywordList,1)" class="icon iconfont iconicon-banpipei"></i>
                            <span>{{keywordListFn(item.keywordList,1)}}</span>
                        </p>
                    </el-tooltip>
                    <div class="list-columns__3 handler-btn">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <button>
                                <i class="iconfont iconbianji" @click="handlerAdd(item)"></i>
                            </button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <button @click="handlerDelete(item.id)">
                                <i class="iconfont iconshanchu"></i>
                            </button>
                        </el-tooltip>
                    </div>
                </li>
            </div>
                <div class="empty-table" v-if="keywordData.list && keywordData.list.length===0">
                    <img src="~img/table-empty.png" />
                    <p>暂无数据</p>
                </div>
            </ul>
            <div class="cl-pagination paging">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :total="keywordData.totalRecord"
                    :page-count="keywordData.totalPage"
                    :page-size="keywordData.pageSize"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
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
        //分页 每页条数
        handleSizeChange(val) {
            this.searchOption.pageSize = val;
            this.$emit("getKeywordReplyList");
        },
        //分页 当前页数
        handleCurrentChange(val){
            this.searchOption.pageIndex = val;
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
            this.error.splice(index, 1);
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
        },
        keywordListFn(list,type){
            let text = ''
            list.map((item,index)=> {
                if(item.matchType == type) {
                    text = text + item.keyword + ','
                }
            })
            text=(text.substring(text.length-1)==',')?text.substring(0,text.length-1):text;
            return text
        }
    },
    watch: {
        propKeywordList() {
            this.keywordList = this.propKeywordList;
        }
    }
};
</script>
<style lang="scss"  scoped>
.el-select /deep/ .el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
    border: $--border-base;
}
.el-input /deep/ .el-input__inner {
    border: $--border-base;
    width: 100%;
}
.handler-menu  /deep/ .input-with-select {
    width: 400px !important;
}
.handler-menu /deep/ .el-input__inner {
    border: $--border-base;
    width: 400px;
}
.el-input /deep/ .el-input__inner:hover {
    border: $--border-base;
}
.el-input /deep/ .el-input__inner:focus {
    border: $--border-base;
}
.el-input /deep/ .el-input__inner {
    border: $--border-base;
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
    padding: 16px 0px;
    border-radius: $--border-radius-base;
    .keyword-answer-content {
        .keyword-list {
            display: inline-block;
            z-index: 1;
            top: 50px;
            left: 0;
            width: 100%;
            padding-bottom: 24px;
            margin-left: 24px;
            padding: 5px;
            display: flex;
            justify-content: flex-start;
            box-sizing: border-box;
            .title{
                color: #B9CBCF
            }
        }
        .keyword-list:last-child{
            padding-bottom: 8px;
        }
        .select-item {
            padding-left: 16px;
            .prefixIcon {
                padding: 10px 6px;
                line-height: 14px;
                margin-left: 0px;
            }
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
            border-top: $--border-base;
            li {
                display: flex;
                align-items: center;
                padding: 10px 24px;
                border-bottom: $--border-base;
                min-width: 1020px;

                p {
                    display: inline-block;
                    box-sizing: border-box;
                    font-size: $--font-size-small;
                    line-height: 40px;
                    padding-right: 16px;
                    cursor: pointer;
                }
                p.list-columns__1 {
                    width: 40%;
                    img {
                        float: left;
                        width: 40px;
                        height: 40px;
                    }
                }
                p.list-columns__2 {
                    width: 50%;
                    i {
                        color: #A1A8B1;
                        margin-right: 4px;
                    }
                    .keyword {
                        margin-right: 8px;
                    }
                }
                .list-columns__3 {
                    width: 10%;
                    color: #0595e6;
                    cursor: pointer;
                }
            }
            div {
                li:hover {
                    background:rgba(248,250,252,1);
                }
            }
            .title {
                p {
                    color: #a1a8b1;
                }
            }
            
            .handler-btn {
                .iconfont {
                    color: #262626;
                    padding: 8px;
                    &:hover{
                           background: #F0F3F7;
                    }
                }
                .iconshanchu {
                    margin: 0 32px;
                }
            }
        }
        .paging {
            text-align: right;
            padding-top: 24px;
        }
        .handler-menu {
            margin: 0 0 16px;
            padding: 0 24px;
            .answer-btn {
                float: right;
                height: 32px;
                font-size: 12px;
                border-radius: $--border-radius-base;
                background: $--color-primary;
                color: #ffffff;
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
        color: $--color-primary;
        vertical-align: middle;
    }
}
</style>