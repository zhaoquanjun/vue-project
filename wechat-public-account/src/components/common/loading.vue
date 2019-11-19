<template>
  <div>
      <!-- <div class="loading-section">
    <div class="loading-content__area">
      <div class="loading-icon__area"></div>
      <p>加载中...</p>
    </div>
  </div> -->
   <div class="arc"></div>
  </div>
</template>

<script>
export default {
  data(){
    return {}
  }
}
</script>

<style lang="scss" scoped>
// .loading-section {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background: #fff;
//   .loading-content__area {
//     .loading-icon__area {
//       width: 50px;
//       height: 52px;
//       background: url('~img/loading.gif') no-repeat center center;
//       background-size: 100% 100%;
//     }
//     p {
//       padding-top: 16px;
//       font-size: $--font-size-small;
//       color: #666;
//     }
//   }
// }
body {
  background: #0b0b14;
  font-family: 'Inconsolata', monospace;
  overflow: hidden;
}
.arc {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border-top: 2px solid #ffea29;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  animation: rt 2s infinite linear;
}
.arc::before {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border-top: 2px solid #8d29ff;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  animation: rt 4s infinite linear reverse;
  content: "";
}
.arc::after {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  border-radius: 50%;
  border-top: initial;
  border-left: initial;
  border-right: initial;
  animation: cw 1s infinite;
  content: "";
  background: snow;
}

h1 {
  position: absolute;
  height: 40px;
  margin: auto;
  top: 200px;
  left: 0;
  right: 0;
  bottom: 0;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.1em;
  font-size: $--font-size-small;
  font-weight: lighter;
  color: white;
}
h1 span {
  display: none;
}
h1::after {
  animation: txt 5s infinite;
  content: "";
}

@keyframes rt {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes cw {
  0% {
    width: 0;
    height: 0;
  }
  75% {
    width: 40px;
    height: 40px;
  }
  100% {
    width: 0;
    height: 0;
  }
}
@keyframes txt {
  0% {
    content: "LOADING.";
  }
  50% {
    content: "LOADING..";
  }
  100% {
    content: "LOADING...";
  }
}
</style>

