<template>
    <dl class="members—info">
        <dt class="avatar">
            <img src="../../assets/avatar.jpeg" onerror>
        </dt>
        <dd class="basic">
            <span>
                姓名 :
                <i>{{memberInfo.displayName}}</i>
            </span>
            <span>
                手机 :
                <i>{{memberInfo.phoneNumber}}</i>
            </span>
            <span>
                备注 :
                <template v-if="isRemarkShow">
                    <span @click="handleRemark" style="display: inline-block;">
                        <i>暂无备注</i>
                        <svg-icon icon-class="remark"></svg-icon>
                    </span>
                </template>
                <template v-else>
                    <input type="text" 
                    :value="remarkValue"
                     @input="change" 
                      @blur="handlerblur"
                     class="remark-input input-hover">
                    <!-- <el-input
                        :value="value"
                        @input="change"
                        @blur="handlerblur"
                        size="small"
                        style="width:324px;"
                        placeholder="请输入内容"
                    ></el-input>-->
                </template>
            </span>
        </dd>
    </dl>
</template>
<script>
export default {
    props: {
        memberInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            remarkValue: "",
            isRemarkShow: true
        };
    },
    methods: {
        handleRemark() {
            this.isRemarkShow = false;
        },
        handlerblur(){
           if(this.remarkValue == ""){
             this.isRemarkShow = true;
           }
        },
        change(e) {
            this.remarkValue=e.target.value;
            //this.$emit("update:value", e.target.value);
            this.$emit("input", e.target.value);
        }
    }
};
</script>

<style lang="scss" scoped>
// 成员信息
.members—info {
    padding: 0 15px;
    margin-top: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 15px;
        float: left;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .basic {
        float: left;
        span {
            display: block;
            line-height: 20px;
        }
        .remark-input {
            width: 322px;
            height: 28px;
            border: none;
            border: 1px solid #E8E8E8;
            border-radius: 1px;
            text-indent: 10px;
            &:hover{
              border: 1px solid #00C1DE
            }
           
        }
    }
}
</style>
