<template>
    <div class="image-text">
        <ul class="list" ref="list">
            <li
                ref="listItem"
                :class="index===0?'fist-item':'list-item'"
                v-for="(item,index) in list"
                :key="index"
            >
                <div class="headline">{{item.title}}</div>
                <div class="imgwrap">
                    <img
                        src="http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/0dd7cc4ae2084997859e8691623716d4"
                    />
                </div>
                <div class="mask">
                    <button @click="upward(item,index)" v-if="index!==0">
                        <i class="iconfont iconshang"></i>
                    </button>
                    <button @click="downward(item,index)" v-if="index!==list.length-1">
                        <i class="iconfont iconxia"></i>
                    </button>
                    <button @click="editor(item,index)">
                        <i class="iconfont iconcaozuo"></i>
                    </button>
                    <button>
                        <i class="iconfont iconhuishouzhan"></i>
                    </button>
                </div>
            </li>
            <li class="fist-item editor" ref="editor">
                <div class="example">
                    <div class="headline">这里是标题</div>
                    <div class="imgwrap">
                        <img
                            src="http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/0dd7cc4ae2084997859e8691623716d4"
                        />
                    </div>
                </div>
                <div class="seting-info">
                    <div class="seting-item">
                        <div class="seting-title">设置链接</div>
                        <el-input size="small" placeholder="输入名称搜索" class="input-with-select">
                            <i
                                class="el-icon-link el-input__icon"
                                style="cursor: pointer;"
                                slot="suffix"
                            ></i>
                        </el-input>
                    </div>
                    <div class="seting-item">
                        <div class="seting-title">设置封面</div>
                        <div class="cover">
                            <div class="upload-icon" v-if="!isUploaded">
                                <span class="el-icon-plus "></span>
                            </div>
                            <img
                                v-else
                                src="http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/0dd7cc4ae2084997859e8691623716d4"
                            />
                        </div>
                    </div>
                    <div class="seting-item">
                        <div class="seting-title">图文标题</div>
                        <el-input size="small" placeholder="不超过64个字符"></el-input>
                    </div>
                    <div class="seting-item">
                        <div class="seting-title">简介</div>
                        <el-input
                            class="textarea"
                            type="textarea"
                            placeholder="非必填，不超过120个字符，该摘要只在发送图文消息为单条时显示"
                            maxlength="120"
                            show-word-limit
                            resize="none"
                        ></el-input>
                    </div>
                </div>
            </li>
        </ul>
        <div class="footer-add" >
            <span class="el-icon-plus avatar-uploader-icon"></span>
            <span>最多添加8个图文消息</span>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: [
                {
                    title: "1"
                },
                {
                    title: "2"
                },
                {
                    title: "3"
                }
            ],
            isUploaded:false,
        };
    },
    mounted(){
        this.$nextTick(()=>{
          
        })
    },
    methods: {
        downward(item, index) {
            var tempOption = this.list[index + 1];
            this.$set(this.list, index + 1, this.list[index]);
            this.$set(this.list, index, tempOption);
        },
        upward(item, index) {
            var tempOption = this.list[index - 1];
            this.$set(this.list, index - 1, this.list[index]);
            this.$set(this.list, index, tempOption);
        },
        editor(item, index){
            let list = this.$refs.list;
            let editor = this.$refs.editor;
            let listItems = this.$refs.listItem;
            listItems[index].style.display="none";
            list.insertBefore(editor,listItems[index]);
            

        }
    }
};
</script>
<style lang="scss" scoped>
.image-text {
    padding-top: 24px;
}
.list {
    width: 279px;
    margin: 0 auto;
    > li {
        position: relative;
        margin-bottom: 8px;
    }
    li.fist-item {
        height: 140px;
        overflow: hidden;
        border-radius: 4px;
        .imgwrap {
            width: 100%;
            height: 100%;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .headline {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 8px 16px;
            background: rgba(38, 38, 38, 0.5);
            color: #fff;
        }
    }
    li.list-item {
        height: 60px;
        padding: 0 10px 0 32px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 10px 0px rgba(224, 224, 224, 0.5);
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .imgwrap {
            width: 50px;
            height: 50px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .mask {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(38, 38, 38, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        button {
            padding: 10px;
            .iconfont {
                color: #fff;
                &:hover {
                    color: #09cceb;
                }
            }
        }
    }
    li:hover .mask {
        opacity: 1;
    }
    // 编辑图文
    li.editor {
        height: auto;

        .example {
            height: 140px;
            position: relative;
            box-shadow: 0px 2px 10px 0px rgba(224, 224, 224, 0.5);
        }
        .seting-info {
            padding-top: 8px;
            box-shadow: 0px 2px 10px 0px rgba(224, 224, 224, 0.5);
            .seting-item {
                padding-bottom: 16px;
            }
            .seting-title {
                padding-bottom: 8px;
            }
            .cover {
                width: 70px;
                height: 70px;
                border-radius: 2px;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
                .upload-icon {
                    cursor: pointer;
                    width: 100%;
                    height: 100%;
                    border: 1px solid #09cceb;
                    background: rgba(9, 204, 235, 0.1);
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    .el-icon-plus {
                        font-size: 24px;
                        color: #09CCEB;
                    }
                }
            }
        }
    }
}
.footer-add {
    cursor: pointer;
    margin: 0 auto;
    width: 279px;
    height: 60px;
    line-height: 60px;
    padding: 0 10px 0 32px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 10px 0px rgba(224, 224, 224, 0.5);
    border-radius: 4px;
    margin-bottom: 16px;
    .el-icon-plus {
        margin-right: 16px;
    }
}
</style>