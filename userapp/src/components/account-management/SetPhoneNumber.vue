<template>
  <div class="set-phone-number">
    <el-row class="demo-autocomplete"></el-row>
    <el-alert title="修改手机号后，可以使用新手机登录管理平台，您关联的账户下的成员列表中的手机号会一同修改" type="success"></el-alert>
    <!-- <no-captcha></no-captcha> -->
    <div class="smsCodeWrap">
      <el-input
        class="smsInput"
        prefix-icon="el-icon-date"
        size="small"
        v-model="input"
        placeholder="请输入内容"
      ></el-input>

      <el-select size="small" @change="change" v-model="value" placeholder="请选择">
        <el-option
        popper-class="dropdown__item"
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
      <!-- <button class="sendSms">发送验证码</button> -->
    </div>
  </div>
</template>
<script>
import NoCaptcha from "../common/no-captcha";
export default {
  components: { NoCaptcha },
  data() {
    return {
      input: "123",
      options: [
        {
          value: "中国大陆",
          label: "+86"
        },
        {
          value: "香港",
          label: "+852"
        },
        {
          value: "台湾",
          label: "+886"
        },
        {
          value: "美国",
          label: "+1"
        },
        {
          value: "英国",
          label: "+44"
        },
        {
          value: "日本",
          label: "+81"
        },
        {
          value: "俄罗斯",
          label: "+7"
        },
        {
          value: "意大利",
          label: "+39"
        }
      ],
      value: "中国大陆"
    };
  },
  methods: {
    change(item) {
      console.log(item);
    }
  },
  mounted() {}
};
</script>
<style>
.el-autocomplete-suggestion {
  width: 150px ;
}
.el-select .el-input__inner {
  border: none;
  padding: 0;
  padding-left: 5px;
  height: 30px;
}
.el-input--small .el-input__icon {
  line-height: 30px;
}
.el-input--prefix .el-input__inner {
  padding-left: 90px;
}
/* .el-select-dropdown{
  left: 262px !important;
} */
 .el-scrollbar__wrap{
  width: 150px;
}
</style>


<style lang="scss" scoped>
.set-phone-number {
  padding: 0 15px;
}
.smsCodeWrap {
  position: relative;
}
.el-select {
  position: absolute;
  width: 60px;
  left: 30px;
  top: 1px;
  bottom: 1px;
}
.dropdown__item{
  width: 150px;
}
// .sendSms {
//   border: none;
//   position: absolute;
//   right: 2px;
//   top: 1px;
//   bottom: 1px;
// }
</style>


