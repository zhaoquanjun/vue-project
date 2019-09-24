<template>
    <div>
        <div class="banner-pic-mask">
            <div class="banner-pic-box">
                <header class="header">
                    <h3>我的图片</h3>
                    <button class="close-modul" @click="close">
                        <i class="iconfont iconguanbi"></i>
                    </button>
                </header>
                <div class="content-wrap">
                    <div class="banner-left-content">
                        <div class="banner-left-menu">
                            <span class="tip">可以拖拽图片调整图片位置及排序</span>
                            <button class="add-batch-pic" @click="batchAddPicture">添加图片</button>
                        </div>
                        <section class="list-wrap" v-scrollBar>
                            <!-- <draggable class="piture-list"> -->
                            <draggable
                                class="piture-list"
                                tag="ul"
                                :options="{ animation: 150, ghostClass:'', dragClass: '111', scroll:true,scrollSensitivity: 200, handle: '.handler-move' }"
                                v-model="list"
                                @end="_handleSortEnd"
                            >
                                <transition-group>
                                    <li
                                        class="picture-item handler-move"
                                        :class="{'active':index===active}"
                                        v-for="(item,index) in list"
                                        :key="index"
                                        @click="handlerClickItem(item,index)"
                                    >
                                        <div class="img-wrap">
                                            <img :src="item.url" />
                                        </div>
                                        <div class="hander-btn">
                                            <!--  @click="preview" -->
                                            <button class="view" @click.stop="preview(item,index)">
                                                <i class="iconfont iconchakan"></i>
                                            </button>
                                            <button class="remove" @click.stop="removeItem(index)">
                                                <i class="iconfont iconicon-dash-Navigationdelete"></i>
                                            </button>
                                        </div>
                                        <span class="number">{{index+1}}</span>
                                    </li>
                                </transition-group>
                            </draggable>
                            <div
                                style=" text-align: center; margin-top: 100px;"
                                v-if="list.length<1"
                            >
                                暂无图片，请先
                                <button style="color:#09CCEB" @click="batchAddPicture(true)">添加图片</button>
                            </div>
                        </section>
                    </div>
                    <div class="banner-right-content" v-if="list.length>=1">
                        <div class="slider-banner">
                            <div class="swiper">
                                <div class="image-wrap" v-for="(item,index) in list" :key="index">
                                    <img width="100%" :src="activeUlr" />
                                </div>
                                <div class="image-wrap" v-if="list.length<1">
                                    <img width="100%" :src="activeUlr" />
                                </div>
                            </div>

                            <span class="number">{{active+1}}</span>
                            <div class="change-pic">
                                <button>更换图片</button>
                            </div>
                            <button class="slider-btn left-prev" @click="prev">
                                <i class="iconfont iconicon-des-Arrow"></i>
                            </button>
                            <button class="slider-btn right-next" @click="next">
                                <i class="iconfont iconicon-des-Arrow"></i>
                            </button>
                        </div>
                        <div class="pic-info">
                            <div class="item">
                                <label for>图片标题</label>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="图片标题"
                                        v-model="activeImgInfo.title"
                                    />
                                </div>
                            </div>
                            <div class="item">
                                <label for>图片描述</label>
                                <div>
                                    <input type="text" placeholder="图片描述" />
                                </div>
                            </div>
                            <div class="item">
                                <label for>图片链接</label>
                                <div class="link">
                                    <!-- <input type="text" placeholder="图片链接" /> -->
                                    <span>{{activeImgInfo.url}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer class="footer">
                    <button class="handler-btn confirm">确定</button>
                    <button class="handler-btn cancel">取消</button>
                </footer>
            </div>
        </div>
        <div class="banner-pic-mask" v-if="isSliderShow">
            <div class="slider-banner banner-slider" style=" width: 100%; height: 100%;">
                <div class="swiper">
                    <div class="image-wrap" v-for="(item,index) in list" :key="index">
                        <img width="auto" height="auto" :src="activeUlr" />
                    </div>
                </div>
                <button class="slider-btn left-prev" @click="prev">
                    <i class="iconfont iconicon-des-Arrow"></i>
                </button>
                <button class="slider-btn right-next" @click="next">
                    <i class="iconfont iconicon-des-Arrow"></i>
                </button>
                <button class="dialog-close" @click="closeDialog">
                    <i class="iconfont iconguanbi"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
// import draggable from "vuedraggable";
export default {
    components: {
        draggable
    },
    data() {
        return {
            isSliderShow: false,
            active: 0,
            list: [
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/af9ba9709066420a8a40b28af8657e6a.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/108a4268fff3450abf2aad9183c8fe13.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/2f88e6470c7e465196ee4e9bfbd267ff.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/081c5a29e5b9427ebe4633c44b584373.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/af9ba9709066420a8a40b28af8657e6a.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/af9ba9709066420a8a40b28af8657e6a.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/108a4268fff3450abf2aad9183c8fe13.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/2f88e6470c7e465196ee4e9bfbd267ff.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/081c5a29e5b9427ebe4633c44b584373.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/af9ba9709066420a8a40b28af8657e6a.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/af9ba9709066420a8a40b28af8657e6a.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/108a4268fff3450abf2aad9183c8fe13.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/2f88e6470c7e465196ee4e9bfbd267ff.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/081c5a29e5b9427ebe4633c44b584373.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/af9ba9709066420a8a40b28af8657e6a.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/af9ba9709066420a8a40b28af8657e6a.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/108a4268fff3450abf2aad9183c8fe13.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/2f88e6470c7e465196ee4e9bfbd267ff.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/081c5a29e5b9427ebe4633c44b584373.jpg"
                },
                {
                    title: "123",
                    url:
                        "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/af9ba9709066420a8a40b28af8657e6a.jpg"
                }
            ],
            activeUlr:
                "http://img.andni.cn/Picture/823EB3BD-93F4-4655-B833-D604A6EF2032/af9ba9709066420a8a40b28af8657e6a.jpg",
            activeImgInfo: ""
        };
    },
    mounted() {
        this.activeImgInfo = this.list[0];
    },
    methods: {
        handlerClickItem(item, index) {
            this.active = index;
            this.activeUlr = item.url;
        },
        prev() {
            --this.active;
            if (this.active < 0) {
                this.active = this.list.length - 1;
            }
            this.activeUlr = this.list[this.active].url;
            this.activeImgInfo = this.list[this.active];
        },
        next() {
            ++this.active;
            if (this.active >= this.list.length) {
                this.active = 0;
            }
            this.activeUlr = this.list[this.active].url;
        },
        removeItem(index) {
            this.list.splice(index, 1);
        },
        preview(item, index) {
            this.active = index;
            this.activeUlr = item.url;
            this.isSliderShow = true;
        },
        getChoosePictureList() {
            this.$$emit("getPictureList", this.list);
        },
        batchAddPicture() {
            this.$emit("batchAddPicture");
        },
        changeActivePictrue() {
            this.$emit("changeActivePictrue");
        },
        close() {
            this.$emit("closeBannerPictureModul");
        },
        closeDialog() {
            this.isSliderShow = false;
        },
        // 排序
        _handleSortEnd() {
            console.log(this.list[0]);
            console.log(this.list);
        },
        // 选中
        _handleSelect() {},
        // 切换图片
        _handleChangePicture() {},
        // 编辑图片
        _handleEditPicture() {},
        // 删除图片
        _handleDeletePicture() {}
    }
};
</script>
<style lang="scss" scoped>
.number {
    padding: 5px 8px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 2px;
    z-index: 1;
    position: absolute;
    left: 8px;
    top: 8px;
}
.swiper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .image-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        img {
            max-height: 100%;
            max-width: 100%;
        }
    }
}
.slider-btn {
    width: 40px;
    height: 40px;
    background: rgba(38, 38, 38, 0.7);
    border-radius: 2px;
    position: absolute;
    top: 50%;
    margin-top: -20px;
    color: #fff;
    .iconfont {
        color: #fff;
    }
}
.left-prev {
    left: 10px;
    transform: rotate(180deg);
}
.right-next {
    right: 10px;
}
</style>
<style lang="scss" scoped>
.banner-pic-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100;
}
.content-wrap{
        height: calc(100% - 130px);
    display: flex;
  border-bottom: 1px solid #e5e5e5;
}
.banner-pic-box {
    width: 1257px;
    height: 796px;
    background: #fff;
    box-shadow: 0px 2px 32px 4px rgba(0, 0, 0, 0.13);
    border-radius: 3px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 100;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        line-height: 22px;
        border-bottom: 1px solid #e5e5e5;
    }
    .banner-left-content {
        // width: 942px;
        width: 100%;
        // height: calc(100% - 130px);
        height: 100%; // 修改
        display: inline-block;
        box-sizing: border-box;
        // border-bottom: 1px solid #e5e5e5;// 修改
    }

    .banner-left-menu {
        padding: 16px;
        padding-right: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e5e5;
        color: #a1a8b1;
        .add-batch-pic {
            width: 90px;
            height: 32px;
            background: rgba(0, 193, 222, 1);
            border-radius: 2px;
            color: #fff;
        }
    }
    .list-wrap {
        height: calc(100% - 100px);
        overflow-y: auto;
        position: relative;
        .piture-list {
            padding: 32px;
            box-sizing: border-box;
            .picture-item {
                cursor: pointer;
                display: inline-block;
                width: 140px;
                height: 140px;
                border: 3px solid transparent;
                box-sizing: border-box;
                position: relative;
                margin-right: 32px;
                margin-bottom: 32px;
                overflow: hidden;
                .img-wrap {
                    width: 100%;
                    height: 100%;
                    img {
                        width: 100%;
                    }
                }
                &:hover .hander-btn {
                    opacity: 1;
                }
                .hander-btn {
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    button {
                        padding: 5px;
                        margin: 5px;
                        width: 30px;
                        height: 30px;
                        background: rgba(38, 38, 38, 1);
                        opacity: 0.9;
                        border-radius: 50%;
                        .iconfont {
                            color: #fff;
                            font-size: 16px;
                        }
                    }
                }
            }
            .active {
                border: 3px solid rgba(9, 204, 235, 1);
                .number {
                    background: #09cceb;
                    color: #fff;
                }
            }
        }
    }
}

// 右侧样式
.banner-right-content {
    flex: 0 0 313px;
    // height: calc(100% - 130px); // 修改 
    height: 100%;
    display: inline-block;
    box-sizing: border-box;
    vertical-align: top;
    overflow: hidden;
    box-sizing: border-box;
    // border-bottom: 1px solid #e5e5e5; // 修改 
    .slider-banner {
        position: relative;
        width: 289px;
        height: 289px;

        .change-pic {
            position: absolute;
            width: 80%;
            text-align: center;
            padding: 16px 0;
            margin-left: 10%;
            background: rgba(38, 38, 38, 0.8);
            border-radius: 2px;
            bottom: 16px;
            box-sizing: border-box;
            button {
                color: #fff;
            }
        }
    }
    .pic-info {
        padding: 16px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-left: 1px solid #e5e5e5;
        .item {
            padding: 16px 0;
        }
        label {
        }
        input {
            width: 100%;
            border: none !important;
            margin-top: 16px;
            border-bottom: 1px solid #eee !important;
            color: #8c8c8c;
        }
        .link {
            padding-top: 8px;
            span {
                display: block;
                overflow: hidden;
                color: #8c8c8c;
                word-wrap: break-word;
                word-break: normal;
                padding: 5px 0;
            }
        }
    }
}

.footer {
    text-align: right;
    padding: 24px;
    box-sizing: border-box;
    .handler-btn {
        width: 58px;
        height: 32px;
        background: rgba(0, 193, 222, 1);
        color: #fff;
        box-sizing: border-box;
        border: 1px solid transparent;
    }
    & :last-child {
        margin-left: 16px;
    }
    .cancel {
        background: #fff;
        border: 1px solid rgba(0, 193, 222, 1);
        color: rgba(0, 193, 222, 1);
    }
}
.banner-slider {
    .left-prev {
        left: 20%;
    }
    .right-next {
        right: 20%;
    }
    .dialog-close {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 36px;
        right: 36px;
        z-index: 200;
        i {
            font-size: 36px;
            color: #fff;
        }
    }
}
</style>