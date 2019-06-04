<template>
    <div class="invita-link">
        <div v-if="isLinkShow">
            <p class="invita-title invita-item">将链接发送给成员, 成员加入后即可协助您管理站点</p>
            <p class="link-wrap">
                <span class="link">{{link}}</span>
            </p>
            <p class="invita-item invita-tip">一个邀请链接只能邀请一个成员, 有效期3天</p>
            <button 
             v-clipboard:copy="link"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
            class="link-btn"
            >{{copyTip}}</button>
            
        </div>
        <div v-else>
            <Authorization/>
            <footer>
                <el-button @click="generate" type="primary">生成链接</el-button>
            </footer>
        </div>
      
    </div>
</template>
<script>
import AuthList from "./AuthList";
import Authorization from "./Authorization";
import { getShortUrlByInviation } from "@/api/index"
export default {
    components: {
        AuthList,Authorization
    },
    data() {
        return {
            timer: null,
            isLinkShow: false,
            copy:"www.baidu.com",
            input:"212",
            link:"",
            copyTip:"复制链接"

        };
    },
    methods: {
        async _getShortUrlByInviation(){
            let arr = ["内容读"];
            let {data} = await getShortUrlByInviation(arr);
            this.link = data.result;
        },
        generate() {
            this._getShortUrlByInviation();
            this.$store.commit("CLOSERIGHTPANNEL", false);
            this.$store.commit("CURMEMBVERINFO",1)
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
            this.$store.commit("CLOSERIGHTPANNEL", false);
            this.copyTip = "复制成功"
           
            this.isLinkShow = true;
        },
        onError() {
            this.$message.error(this.$t("prompt.copyFail"));
        }
    }
};
</script>

<style lang="scss" scoped>
.invita-link {
    padding: 40px;
    p {
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        margin-bottom: 15px;
    }
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
    }
    .link-btn {
        background: #00b539;
        border: none;
        width: 70px;
        height: 32px;
        color: #fff;
        margin-left: 10px;
    }
}

.panel-main {
    padding: 20px 10px;
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