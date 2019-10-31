<template>
  <div class="content-section">
    <p class="section-title">会员中心</p>
    <el-row class="content">
      <el-col :span="12" class="item">
        <div class="item-wrap" @click="jumpTo('vipList')">
          <div class="item-name">
            <span class="vip-img"></span>
            <span class="name">会员</span>
          </div>
          <div class="item-content">
            <span class="item-num">{{memberNum}}</span>
            <span class="item-type">/ 人</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="item">
        <div class="item-wrap" @click="jumpTo('vipLevel')">
          <div class="item-name">
            <span class="viplevel-img"></span>
            <span class="name">会员级别</span>
          </div>
          <div class="item-content">
            <span class="item-btn">管理</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ["contentNumber"],
  data() {
    return {
      memberNum: 0
    };
  },
  methods: {
    jumpTo(type) {
      if (type == "vipList") {
        this.$router.push({
          path: "/sitemember/memberlist"
        });
      } else if (type == "vipLevel") {
        this.$router.push({
          path: "/sitemember/memberlevel"
        });
      }
    }
  },
  watch: {
    contentNumber() {
      this.memberNum = this.contentNumber.memberCountInfo.currentVal;
    }
  }
};
</script>

<style lang="scss" scoped>
.content-section {
  margin-top: 32px;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 3px;
  border: 1px solid rgba(229, 229, 229, 1);
  .section-title {
    height: 64px;
    padding-left: 25px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 64px;
    border-bottom: 1px solid #e5e5e5;
  }
  .content {
    width: 100%;
    .item:last-of-type {
      border-right: 1px solid transparent;
    }
    .item {
      height: 100px;
      border-right: 1px solid #eeeeee;

      .item-wrap {
        margin-left: 16px;
        margin-right: 16px;
        margin-top: 30px;
        padding-left: 12px;
        padding-right: 26px;
        height: 50px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        &:hover {
          background: rgba(240, 243, 247, 1);
          border-radius: 2px;
        }
        .item-name {
          height: 100%;
          display: flex;
          align-items: center;
          .vip-img {
            margin-right: 8px;
            display: inline-block;
            width: 32px;
            height: 32px;
            background: url("~img/dashboard/board-vip.png") no-repeat center;
            background-size: contain;
            vertical-align: top;
          }
          .viplevel-img {
            margin-right: 8px;
            display: inline-block;
            width: 32px;
            height: 32px;
            background: url("~img/dashboard/board-viplevel.png") no-repeat
              center;
            background-size: contain;
            vertical-align: top;
          }
          .name {
            display: inline-block;
            font-size: 16px;
            font-weight: 400;
            color: rgba(38, 38, 38, 1);
            line-height: 22px;
          }
        }
        .item-content {
          .item-num {
            display: inline-block;
            font-size: 18px;
            font-weight: 500;
            color: rgba(38, 38, 38, 1);
            line-height: 50px;
            margin-right: 4px;
          }
          .item-type {
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            color: rgba(185, 203, 207, 1);
            line-height: 20px;
          }
          .item-btn {
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            color: rgba(5, 149, 230, 1);
            line-height: 20px;
            margin-top: 15px;
          }
        }
      }
    }
  }
}
</style>
