<template>
    <div class="right-pannel">
        <div class="pannel-head">
            <span>
                <slot name="back"></slot>
                <slot name="title-text"></slot>
                <el-tooltip
                    class="item"
                   
                    placement="right"
                >
                     <div slot="content">可批量为多个成员增加权限，该操作不会删除成员已有权限，<br/>如成员已有权限中无选中的权限，则为成员增加该权限</div>    
                    <slot name="icon-tip"></slot>
                </el-tooltip>
            </span>
            <span class="icon-size close-pannel" @click="closePanel"></span>
        </div>
        <slot></slot>
    </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
    name: "right-pannel",
    props: {
        pannelWidth: {
            type: String,
            default: "534"
        }
    },
    data() {
        return {
            aa: 123
        };
    },
    methods: {
        closePanel() {
            this.$store.commit("CLOSERIGHTPANNEL", false);
        }
    }
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
    color: #262626;
    overflow: hidden;
    .pannel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        overflow: hidden;
        border-bottom: 1px solid #efefef;
        vertical-align: middle;
        >span {
            padding: 0 10px;
        }
        .auth-title {
            margin-right: 10px;
        }
        .close-pannel {
            float: right;
            cursor: pointer;
            background: url("~img/close.png") no-repeat center;
            background-size: contain;
        }
    }
}
</style>
