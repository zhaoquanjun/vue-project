<template>
    <dl class="members—info" id="members—info">
        <dt class="avatar">
            <img src="../../assets/avatar.jpeg" onerror="../../assets/defualtvatar.jpeg">
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
            <span style="display: flex;align-items: center;">
               <i style="flex: none;padding-right: 10px;"> 备注 :</i>
                <template v-if="isRemarkShow">
                    <span @click="handleRemark" style="display: inline-block;  cursor: pointer;">
                        <i>{{ remarkValue}}</i>
                        <svg-icon icon-class="remark"></svg-icon>
                    </span>
                </template>
                <template v-else>
                    <el-input
                        v-if="inputType"
                       clear="remark" 
                        type="text"
                        placeholder="请输入内容"
                        v-model="memberInfo.remark"
                        maxlength="100"
                        show-word-limit
                         @change="change"
                        @blur="handlerblur"
                        @focus="focus"
                    ></el-input>
                       <el-input
                        v-else
                       clear="remark" 
                        type="text"
                        placeholder="请输入内容"
                        v-model="memberInfo.remark"
                        maxlength="100"
                        show-word-limit
                         @change="change"
                        @blur="handlerblur"
                        @focus="focus"
                    ></el-input>
                    <!-- <input
                        type="text"
                        :value="memberInfo.remark"
                        @input="change"
                        @blur="handlerblur"
                        class="remark-input input-hover"
                    > -->
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
            inputType:true,
            isRemarkShow: true
        };
    },
    created() {},
    methods: {
        handleRemark() {
            
            this.isRemarkShow = false;
        },
        handlerblur() {
         
            this.isRemarkShow = true;
            // this.inputType = "text"
        },
        focus(){
            
            this.inputType = "textarea"
        },
        change(value) {
            console.log(value,'00000')
            //this.memberInfo.remark = e.target.value;
            //this.$emit("update:value", e.target.value);
            this.$emit("input", value);
        }
    },
    computed: {
        remarkValue() {
            return this.memberInfo.remark ? this.memberInfo.remark : "";
        }
    }
};
</script>
<style >
#members—info .el-input .el-input__inner{
    height: 32px;
    line-height: 32px;
    padding-right: 60px;
}
</style>

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
        flex: none;
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
            border: 1px solid #e8e8e8;
            border-radius: 1px;
            text-indent: 10px;
            &:hover {
                border: 1px solid #00c1de;
            }
        }
    }
}
</style>
