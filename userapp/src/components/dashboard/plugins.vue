<template>
  <el-row class="plugin-section">
    <el-col class="plugins-box" :span="6" v-for="(item, index) in  plugins" :key="index">
      <div class="box-inner">
        <span class="plugin-item plugin-img" :class="item.pluginCode"></span>
        <span class="plugin-item plugin-text">
          <h2>{{item.name}}</h2>
          <p>{{item.description}}</p>
          <p>{{isActive(item.pluginCode, item.isActive)}}</p>
        </span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ["plugins"],
  methods: {
    isActive(pluginCode, isActive) {
      switch (pluginCode) {
        case "MicroProgram":
          return isActive ? "已发布" : "未授权";
        case "AliPayProgram":
          return isActive ? "已下载" : "未绑定";
        case "WeChatAccount":
          return isActive ? "已授权" : "未授权";
        case "Form":
          return isActive ? "已创建" : "未创建";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.plugin-section {
  margin-top: 49px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  .plugins-box:last-child {
    margin-right: 0;
  }
  .plugins-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 42px;
    margin-right: 40px;
    cursor: pointer;
    .box-inner {
      width: 100%;
      position: relative;
      background: #fff;
      border: 1px solid transparent;
      border-radius: 3px;
      border: 1px solid rgba(229, 229, 229, 1);
      text-align: center;

      background: url("~img/dashboard/board-pluginImgMax.png");
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
        background: url("~img/dashboard/board-wxprogramMax.png") no-repeat
          center;
        background-size: contain;
      }
      .AliPayProgram {
        background: url("~img/dashboard/board-alipayMax.png") no-repeat center;
        background-size: contain;
      }
      .WeChatAccount {
        background: url("~img/dashboard/board-wxpublicNumberMax.png") no-repeat
          center;
        background-size: contain;
      }
      .Form {
        background: url("~img/dashboard/board-formMax.png") no-repeat center;
        background-size: contain;
      }
      .plugin-text {
        h2 {
          font-size: 18px;
          font-weight: 500;
          color: rgba(38, 38, 38, 1);
          line-height: 25px;
        }
        p:first-of-type {
          font-size: 14px;
          font-weight: 400;
          color: rgba(161, 168, 177, 1);
          line-height: 20px;
          margin-top: 8px;
        }
        p:last-of-type {
          font-size: 14px;
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
@media screen and (max-width: 1500px) {
  .plugin-section {
    margin-top: 29px;
    .plugins-box {
      margin-right: 20px;
      margin-bottom: 33px;
      .box-inner {
        background: url("~img/dashboard/board-pluginImgMin.png");
        background-repeat: no-repeat;
        background-position: right bottom;
        background-size: 71px 65px;
        .plugin-img {
          width: 72px;
          height: 72px;
          margin: 12px auto 7px;
        }
        .MicroProgram {
          background: url("~img/dashboard/board-wxprogramMin.png") no-repeat
            center;
          background-size: contain;
        }
        .AliPayProgram {
          background: url("~img/dashboard/board-alipayMin.png") no-repeat center;
          background-size: contain;
        }
        .OfficialAccounts {
          background: url("~img/dashboard/board-wxpublicNumberMin.png")
            no-repeat center;
          background-size: contain;
        }
        .Form {
          background: url("~img/dashboard/board-formMin.png") no-repeat center;
          background-size: contain;
        }
        .plugin-text {
          h2 {
            font-size: 14px;
            line-height: 20px;
          }
          p:first-of-type {
            font-size: 14px;
            line-height: 20px;
          }
          p:last-of-type {
            margin-top: 5px;
            margin-bottom: 26px;
          }
        }
      }
    }
  }
}
</style>
