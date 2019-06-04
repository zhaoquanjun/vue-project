<template>
    <div class="header">
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="head-left head-item">
                    <span><svg-icon  icon-class="logo"></svg-icon></span>
                    <span>云～速成美站</span>
                    <span
                        class="designTitle"
                        @mouseenter="dropdownDesignShow"
                        @mouseleave="dropdownDesignhide"
                    >
                        进入设计
                        <ul class="intoDesign" v-show="isdropdownDesignShow">
                            <li>user_name1</li>
                            <li>user_name1</li>
                            <li>user_name1</li>
                            <li>user_name1</li>
                            <li>user_name1</li>
                            <li>user_name1</li>
                        </ul>
                    </span>
                </div>
            </el-col>
            <el-col :span="8" :offset="8">
                <div class="head-right head-item">
                    <span>
                        <svg-icon icon-class="t-issue"></svg-icon>
                        <b class="item-btn">立即发布</b>
                    </span>
                    <span>
                        <svg-icon icon-class="t-help"></svg-icon>
                        <b class="item-btn">帮助</b>
                    </span>
                    <span>
                        <svg-icon icon-class="t-notifi"></svg-icon>
                        <b class="item-btn">通知</b>
                    </span>
                    <span @mouseenter="dropdownAvatarShow" @mouseleave="dropdownAvatarhide">
                        <p class="avatar">
                            <img src="../../assets/avatar.jpeg" alt>
                        </p>
                        <dl class="login-set dropdown-avatar-menu" v-show="isdropdownAvatarShow">
                            <dd @click="pannelShow">个人设置</dd>
                            <dd>退出控制台</dd>
                        </dl>
                    </span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isdropdownAvatarShow: false,
            isdropdownDesignShow: false
        };
    },
    methods: {
        pannelShow() {
            this.$router.push({
                name: "personal"
            });
            //this.$store.commit("CLOSERIGHTPANNEL",true)
        },
        dropdownAvatarShow() {
            this.isdropdownAvatarShow = true;
        },
        dropdownAvatarhide() {
            this.isdropdownAvatarShow = false;
        },
        dropdownDesignShow() {
            this.isdropdownDesignShow = true;
        },
        dropdownDesignhide() {
            this.isdropdownDesignShow = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    background: #000;
    color: #fff;
    position: relative;
    .head-item {
        span {
            display: inline-block;
           // vertical-align: middle;
            padding: 0 15px;
            // margin-right: 10px;
            .item-btn {
                vertical-align: middle;
                padding-left: 5px;
            }
        }
    }
    .head-right {
        text-align: right;
    }
    .avatar {
        display: inline-block;
        width: 30px;
        height: 30px;
        vertical-align: middle;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .login-set {
        cursor: pointer;
        text-align: left;
        background: #131518;
        position: absolute;
        z-index: 100;
        right: 0;
        top: 50px;
        color: #fff;
        padding: 10px 30px;
        dd {
            line-height: 30px;
        }
    }
    .designTitle {
        cursor: pointer;
        position: relative;
    }
    .intoDesign {
        width: 120px;
        text-align: left;
        position: absolute;
        z-index: 100;
        left: 0;
        top: 49px;
        font-size: 12px;
        background: #181c20;
        padding: 4px 0;
        padding-left: 20px;
        box-sizing: border-box;

        li {
            cursor: pointer;
            line-height: 20px;
            padding: 4px;
            &:hover {
                color: #00c1de;
            }
        }
    }
}
</style>


