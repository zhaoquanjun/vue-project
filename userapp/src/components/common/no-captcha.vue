<template>
  <div>
    <div class="box" id="box"></div>
    <!-- <no-captcha-js src="http://g.alicdn.com/sd/ncpc/nc.js?t=2015052012" type="text/javascript" charset="utf-8" /> -->
  </div>
</template>
 
<script>
import { GetCaptcha, geetestEntity } from "@/api/index.js";

export default {
  data() {
    return {
      isValidateOk: ""
    };
  },

  mounted() {
    this._GetCaptcha();
  },
  components: {},
  methods: {
    async _GetCaptcha() {
      let getcaptcha = await GetCaptcha();
      let geetestEntity = {


        GeetestCallBack: function(dataStr) {
          var data = eval(dataStr);
          console.log(data, "-----");
          initGeetest(
            {
              gt: data.gt,
              challenge: data.challenge,
              product: "embed", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
              offline: false,
              new_captcha: true
            },
            function(captchaObj) {
              captchaObj.onSuccess(function() {
                var result = captchaObj.getValidate();
                console.log(result)
                alert("成功")
                // geetestEntity.ValidateCallBack(
                //   JSON.stringify({
                //     validate: result.geetest_validate,
                //     seccode: result.geetest_seccode,
                //     challenge: result.geetest_challenge
                //   })
                // );
              });
              document
                // .getElementById(geetestEntity.ElementId)
                // .appendChild(captchaObj);
              captchaObj.appendTo("#box");
            }
          );
        }
      };

      eval(getcaptcha)

      //   initGeetest({
      //         gt: data.gt,
      //         challenge: data.challenge,
      //         product: "embed", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
      //         offline: false,
      //         new_captcha: true
      //     },
      //         function (captchaObj) {

      //             captchaObj.onSuccess(function () {
      //                 var result = captchaObj.getValidate();
      //                 // geetestEntity.ValidateCallBack(JSON.stringify({
      //                 //     validate: result.geetest_validate,
      //                 //     seccode: result.geetest_seccode,
      //                 //     challenge: result.geetest_challenge
      //                 // }));
      //             });
      //             document.getElementById(geetestEntity.ElementId).appendChild(captchaObj)
      //             //captchaObj.appendTo("#" + geetestEntity.ElementId);
      //         });
    }
  }
};
</script>

<style>
</style>
