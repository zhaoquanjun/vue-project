<template>
    <div class="right-pannel">
        <div class="pannel-head">
            <span>
                <slot name="back"></slot>
                <slot name="title-text"></slot>
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="可批量为多个成员增加权限，该操作不会删除"
                    placement="left-start"
                >
                    <slot name="icon-tip"></slot>
                </el-tooltip>
            </span>
            <span class="close-pannel" @click="closePanel">X</span>
        </div>
        <div style="padding:0 17px">
            <slot slot="cur-tip"></slot>
            <div><slot></slot></div>
        </div>
        <slot name="footer"></slot>
    </div>
</template>
<script>
export default {
    name: "right-pannel",
    props: {
        pannelWidth: {
            type: String,
            default: "331"
        }
    },
    data() {
        return {
            value: ""
        };
    },

    mounted() {},
    methods: {
        closePanel() {
            this.$emit("closeRightPanel", false);
            // this.$store.commit("CLOSERIGHTPANNEL", false);
        }
    },
    watch: {}
};
</script>
<style lang="scss" scoped>
.auth-title {
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
}
.right-pannel {
    background: #ffffff;
    position: fixed;
    z-index: 2200;
    right: 0;
    top: 0;
    bottom: 0;
    box-shadow: 0 0 3px #ccc;
    transition: width 0.2s linear;
    background-color: "#fff";
    // width: 200px;
    color: #262626;
    .pannel-head {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        overflow: hidden;
        border-bottom: 1px solid #efefef;
        > span {
            padding: 0 10px;
        }
        .auth-title {
            margin-right: 10px;
        }
        .close-pannel {
            float: right;
            cursor: pointer;
        }
    }
}

.category-content {
    padding: 30px 0 13px 0;
}
</style>


