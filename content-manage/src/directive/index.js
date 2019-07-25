import Vue from "vue";
Vue.directive('filterSpecialChar', {
    update: function (el, { value, modifiers }, vnode) {
            try {
                //此处可以debug看看el具体值是什么,这里演示的是原生控件input,如果是使用element中的<el-input />标签,需要通过 el.children[0] 拿到原生input.
                    if(!el.value){
                       return false; 
                     }
                    el.value = el.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, "");
                    el.dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
            } catch (e) {
            }
    }
  })
//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive('real-img', async function (el, binding) {//指令名称为：real-img
  let imgURL = binding.value;//获取图片地址
  if (imgURL) {
      let exist = await imageIsExist(imgURL);
      if (exist) {
          el.setAttribute('src', imgURL);
      } 
  }
})

/**
* 检测图片是否存在
* @param url
*/
let imageIsExist = function(url) {
  return new Promise((resolve) => {
      var img = new Image();
      img.onload = function () {
          if (this.complete == true){
              resolve(true);
              img = null;
          }
      }
      img.onerror = function () {
          resolve(false);
          img = null;
      }
      img.src = url;
  })
}  