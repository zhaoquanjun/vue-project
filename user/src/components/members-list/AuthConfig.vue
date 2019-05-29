<template>
  <div>
    <div>
      <dl class="members—info">
        <dt class="avatar">
          <img
            src="http://img3.duitang.com/uploads/item/201605/07/20160507191419_J2m8R.thumb.700_0.jpeg"
            alt
          >
        </dt>
        <dd class="basic">
          <span>
            姓名 :
            <i>张先生</i>
          </span>
          <span>
            手机 :
            <i>13520303156</i>
          </span>
          <span>
            备注 :
            <i>暂无备注</i>
          </span>
        </dd>
      </dl>
    </div>
    <div class="panel-main">
      <div class="pannel-right-item">
        <h3 class="auth-title">选择权限</h3>
        <div class="search-auth">
          <input class="auth-input" v-model="input" placeholder="请输入权限名称">
          <button class="auth-btn">搜索</button>
        </div>
        <div class="auth-name">
          <auth-list @chooseAuth="chooseAuth" :authList="authList" :isSelect="true"></auth-list>
        </div>
      </div>
      <div class="pannel-left-item">
        <h3 class="auth-title">已选权限</h3>
        <div class="selected-auth">
          <auth-list
            @emptySelected="emptySelected"
            @removeSelected="removeSelected"
            :authList="selectedAuth"
          ></auth-list>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary">确认</el-button>
      <el-button type="primary" plain>取消</el-button>
    </div>
  </div>
</template>
<script>
import AuthList from "./AuthList";
import { mapState, mapMutations } from "vuex";
export default {
  name: "right-pannel",
  components: { AuthList },
  created() {},
  data() {
    return {
      input: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎"
        },
        {
          date: "2016-05-04",
          name: "王小虎"
        },
        {
          date: "2016-05-01",
          name: "王小虎"
        },
        {
          date: "2016-05-03",
          name: "王小虎"
        }
      ]
    };
  },
  methods: {
    ...mapMutations([
      "CHOOSEAUTH",
      "REMOVESELECTEDAUTH",
      "EMPTYSELECTEDAUTJ",
      "ISRIGHTPANNELSHOW"
    ]),
    chooseAuth(obj) {
      this.CHOOSEAUTH(obj);
    },
    removeSelected(item) {
      this.REMOVESELECTEDAUTH(item);
    },
    emptySelected() {
      this.EMPTYSELECTEDAUTJ();
    },
    closePanel() {
      this.ISRIGHTPANNELSHOW(!this.isRightPanelShow);
    }
  },
  computed: {
    ...mapState(["authList", "selectedAuth", "isRightPanelShow"])
  }
};
</script>
<style lang="scss" scoped>
.auth-title {
  height: 40px;
  line-height: 40px;
  margin-right: 10px;
}
.right-pannel {
  background: #ffffff;
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  bottom: 0;
  width: 534px;
  color: #262626;
  .pannel-head {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    span {
      padding: 0 10px;
    }
    .auth-title {
      margin-right: 10px;
    }
    .close-pannel {
      float: right;
      cursor: pointer;
    }
  }
}
.panel-main {
  padding: 20px 10px;
  overflow: hidden;
  .search-auth {
    height: 32px;
    border: 1px solid #e5e5e5;
    box-sizing: border-box;
    position: relative;
    input,
    button {
      height: 100%;
      border: none;
      background: #fff;
    }
    .auth-input {
      width: 100%;
      text-indent: 10px;
    }
    .auth-btn {
      position: absolute;
      right: 0;
      top: 0;
      width: 58px;
      background: #00c1de;
      color: #fff;
    }
  }
  .auth-name {
    border: 1px solid #efefef;
    border-top: none;
    padding: 0 10px;
  }
}
.pannel-right-item {
  float: left;
  width: 50%;
}
.pannel-left-item {
  width: 40%;
  float: right;
  .selected-auth {
    border: 1px solid #efefef;
    padding: 0 10px;
  }
}
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
    float: left;
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
  }
}

.footer {
  padding-left: 15px;
}
</style>

