<template>
  <el-row class="plugin-section" :gutter="40">
    <el-col class="plugins-box" :span="6" v-for="(it, idx) in  plugins" :key="idx">
      <div class="box-inner">
        <span class="plugin-item plugin-img" :class="it.pluginCode"></span>
        <span class="plugin-item plugin-text">
          <h2>{{it.name}}</h2>
          <p>{{it.description}}</p>
          <p>{{it.isActive ? '激活' : '未激活'}}</p>
        </span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ["plugins"]
};
</script>

<style lang="scss" scoped>
body {
  background: #f5f5f6;
}
.plugin-section {
  display: flex;
  justify-content: space-between;
  align-content: center;
  flex-wrap: wrap;
  .plugins-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 42px;
    cursor: pointer;
    .box-inner {
      width: 100%;
      position: relative;
      background: #fff;
      border: 1px solid transparent;
      border-radius: 3px;
      border: 1px solid rgba(229, 229, 229, 1);
      text-align: center;

      background: url("~img/dashboard/board-pluginImg.png");
      background-repeat: no-repeat;
      background-position: right bottom;
      background-size: 143px 131px;
      &:hover {
        border: 1px solid #00c1de;
      }
      .plugin-item {
        display: block;
      }
      .plugin-img {
        width: 84px;
        height: 84px;
        margin: 20px auto 0px;
      }
      .MicroProgram {
        background: url("~img/dashboard/board-wxprogram.png") no-repeat center;
        background-size: contain;
      }
      .AliPayProgram {
        background: url("~img/dashboard/board-alipay.png") no-repeat center;
        background-size: contain;
      }
      .OfficialAccounts {
        background: url("~img/dashboard/board-wxpublicNumber.png") no-repeat
          center;
        background-size: contain;
      }
      .Form {
        background: url("~img/dashboard/board-form.png") no-repeat center;
        background-size: contain;
      }
      .plugin-text {
        h2 {
          font-size: 18px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(38, 38, 38, 1);
          line-height: 25px;
        }
        p:first-of-type {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(161, 168, 177, 1);
          line-height: 20px;
          margin-top: 8px;
        }
        p:last-of-type {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(9, 204, 235, 1);
          line-height: 20px;
          margin-top: 24px;
          margin-bottom: 36px;
        }
      }
    }
  }
}
</style>
