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