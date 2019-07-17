<template>
    <div class="invita-link">
        <div class="invita-wrap" v-if="isLinkShow">
            <i class="back-icon" @click="backInvite">
                <svg-icon icon-class="l-home"></svg-icon>
            </i>
            <p class="invita-title invita-item">将链接发送给成员, 成员加入后即可协助您管理站点</p>
            <p class="link-wrap">
                <span class="link">{{link}}</span>
                <button
                    v-clipboard:copy="link"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                    class="link-btn"
                >{{copyTip}}</button>
            </p>
            <p class="invita-item invita-tip">一个邀请链接只能邀请一个成员, 有效期3天</p>
        </div>
        <template v-else>
            <div class="auth-tip" v-if="authtipShow">请至少选择一项权限</div>
            <Authorization/>
            <footer class="footer">
                <button class="create-link" @click="generate">生成链接</button>
            </footer>
        </template>
    </div>
</template>
<script>
import AuthList from "./AuthList";
import Authorization from "./Authorization";
import { getShortUrlByInviation } from "@/api/index";
export default {
    components: {
        AuthList,
        Authorization
    },

    data() {
        return {
            timer: null,
            isLinkShow: false,
            copy: "www.baidu.com",
            input: "212",
            link: "",
            copyTip: "复制链接",
            authtipShow: false
        };
    },
    methods: {
        async _getShortUrlByInviation(names) {
            names = names.join(",");
            let { data } = await getShortUrlByInviation(names);
            this.link = data;
        },
        generate() {
            let names = this.$store.getters.getSelectedAuthNames;
            console.log(names);
            if (names.length <= 0) {
                this.authtipShow = true;
                return false;
            }
            this.authtipShow = false;
            this._getShortUrlByInviation(names);
            this.$store.commit("CLOSERIGHTPANNEL", false);
            this.$store.commit("CURMEMBVERINFO", 1);
            this.timer = setTimeout(() => {
                this.$store.commit("CLOSERIGHTPANNEL", true);
                this.isLinkShow = true;
            }, 500);
        },
        onCopy() {
            this.$message({
                message: `复制成功！`,
                type: "success"
            });
            // this.$store.commit("CLOSERIGHTPANNEL", false);
            this.copyTip = "复制成功";
            // this.isLinkShow = false;
        },
        onError() {
            this.$message.error("prompt.copyFail");
        },
        backInvite() {
            this.isLinkShow = false;
        }
    },
    watch: {
        isLinkShow() {
            let titleText = document.getElementById("title-text");
            if (this.isLinkShow) {
                titleText.style.paddingLeft = "30px";
            } else {
                titleText.style.paddingLeft = "10px";
            }
        }
    },
    mounted() {}
};
</script>

<style lang="scss" scoped>
.invita-link {
    p {
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        margin-bottom: 15px;
    }
    .auth-tip {
        box-sizing: border-box;
        margin: 10px 16px 0;
        height: 32px;
        line-height: 32px;
        padding: 0 16px;
        color: #ff451d;
        background: rgba(253, 240, 237, 1);
        border: 1px solid rgba(253, 171, 153, 1);
    }
    .back-icon {
        position: absolute;
        top: 10px;
        left: 10px;
    }
    .invita-wrap {
        padding: 42px 29px;
        .invita-title {
            color: #262626;
        }
        .invita-tip {
            color: #8c8c8c;
        }
        .link-wrap {
            box-sizing: border-box;
            .link {
                display: inline-block;
                background: #e8f8fb;
                width: 300px;
                padding-left: 15px;
            }
            .link-btn {
                background: #00c1de;
                border: none;
                width: 70px;
                height: 32px;
                color: #fff;
                margin-left: 10px;
            }
        }
    }
    .footer {
        width: 100%;
        position: absolute;
        bottom: 14px;
        left: 16px;
        .create-link {
            border: none;
            width: 90px;
            height: 32px;
            color: #fff;
            background: rgba(0, 193, 222, 1);
        }
    }
}

.panel-main {
    padding: 0 16px;
    overflow: hidden;
    .search-auth {
        height: 32px;
        border: 1px solid #e5e5e5;
        box-sizing: border-box;
        position: relative;
        input,
        button {
            height: 100%;
            border: none;
            background: #fff;
        }
        .auth-input {
            width: 100%;
            text-indent: 10px;
        }
        .auth-btn {
            position: absolute;
            right: 0;
            top: 0;
            width: 58px;
            background: #00c1de;
            color: #fff;
        }
    }
    .auth-name {
        border: 1px solid #efefef;
        border-top: none;
        padding: 0 10px;
    }
}
.pannel-right-item {
    float: left;
    width: 50%;
}
.pannel-left-item {
    width: 40%;
    float: right;
    .selected-auth {
        border: 1px solid #efefef;
        padding: 0 10px;
    }
}
</style>