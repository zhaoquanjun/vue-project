<template>
    <dl class="members—info" id="members—info">
        <dt class="avatar">
            <img v-if="memberInfo && memberInfo.userHeadUrl" :src="memberInfo && memberInfo.userHeadUrl" >
            <img v-else src="../../assets/defualtAvatar.png" alt="">
        </dt>
        <dd class="basic">
            <span>
                姓名 :
                <i>{{memberInfo && memberInfo.displayName}}</i>
            </span>
            <span>
                手机 :
                <i>{{memberInfo && memberInfo.phoneNumber}}</i>
            </span>
            <span class="remark-wrap">
               <i class="remark-title"> 备注 :</i>
                <template v-if="isRemarkShow">
                    <span  class="remark-text">
                        <i>{{ !!remarkValue?remarkValue:"暂无备注"}}</i>&nbsp;
                        <i class="iconWrap" @click="handleRemark">
                        <svg-icon  icon-class="remark"></svg-icon>

                        </i>
                    </span>
                </template>
                <template v-else>
                    <el-input
                        v-if="inputType"
                       class="remark" 
                       ref="remarkInput"
                        type="text"
                        placeholder="暂无备注"
                        v-model=" memberInfo.remark"
                        maxlength="100"
                        show-word-limit
                         @change="change"
                        @blur="handlerblur"
                        @focus="focus"
                    ></el-input>
                </template>
            </span>
        </dd>
    </dl>
</template>
<script>
export default {
    props: {
        memberInfo: {
          
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
            this.$nextTick(()=>{
                this.$refs.remarkInput.focus();
            })

            
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
            return this.memberInfo && this.memberInfo.remark ? this.memberInfo.remark : "";
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
            line-height: 25px;
        }
        .remark-wrap{
            display: inline-block;
            width: 100%;
            .remark-title{
                float: left;
                width: 42px;
            }
            .remark-text{
                float: left;
                width: calc(100% - 42px);
               .iconWrap{
                   cursor: pointer;
               }
            }

        }
    }
}
</style>
