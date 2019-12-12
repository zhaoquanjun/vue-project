<template>
    <div class="invita-link">
        <div class="invita-wrap" v-if="isLinkShow ">
            <i class="back-icon" @click="backInvite"></i>
            <p class="invita-title invita-item">将链接发送给成员, 成员加入后即可协助您管理站点</p>
            <p class="link-wrap">
                <span class="link ellipsis">{{link}}</span>
                <button
                    v-clipboard:copy="link"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                    class="link-btn"
                    :class="[isCopy?'link-btn-green':'']"
                >{{copyTip}}</button>
            </p>
            <p class="invita-item invita-tip">一个邀请链接只能邀请一个成员, 有效期3天</p>
        </div>
        <template v-else>
            <div class="auth-tip" v-if="authtipShow">请至少选择一项权限</div>
            <Authorization />
            <footer class="footer">
                <button class="cl-button cl-button--primary" @click="generate">生成链接</button>
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
            authtipShow: false,
            isCopy: false
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
            this.isCopy = false;
            this._getShortUrlByInviation(names);
            this.$store.commit("ISINVITATIONPANELSHOW", false);
          
            this.timer = setTimeout(() => {
                // CLOSERIGHTPANNEL
                this.$store.commit("ISINVITATIONPANELSHOW", true);
                this.isLinkShow = true;
                 document.getElementsByClassName("right-pannel")[0].style.width="513px"
            }, 500);
        },
        onCopy() {
              this.$notify({
                        customClass: "notify-success", // error success
                        message: `复制成功！`,
                        duration: 1500,
                        showClose: false
                    });
            // this.$store.commit("CLOSERIGHTPANNEL", false);
            this.copyTip = "复制成功";
            this.isCopy = true;
            // this.isLinkShow = false;
        },
        onError() {
            this.$message.error("prompt.copyFail");
        },
        backInvite() {
            this.isLinkShow = false;
        }
    },
    computed: {},
    watch: {
        isLinkShow() {
            let titleText = document.getElementById("title-text");
            
            
            if (this.isLinkShow) {
                titleText.style.paddingLeft = "30px";
            } else {
                titleText.style.paddingLeft = "10px";
            }
        },
        immediate: true,
       
    }
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
        display: inline-block;
        position: absolute;
        top: 12px;
        left: 10px;
        width: 16px;
        height: 16px;
        background: url("~img/memberManage/back.png") no-repeat center;
        background-size: contain;
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
                vertical-align: middle;
            }
            .link-btn {
                background: $--color-primary;
                border: none;
                width: 70px;
                height: 32px;
                color: #fff;
                margin-left: 10px;
            }
            .link-btn-green {
                background: $--color-success;
            }
        }
    }
    .footer {
        width: 100%;
        position: absolute;
        bottom: 14px;
        left: 16px;
    }
}

</style>