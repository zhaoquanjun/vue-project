<template>
  <div>
    <h3>个人账号管理</h3>
    <dl class="user-account clear">
      <dt class="avatar">
        <img src="http://cdn.duitang.com/uploads/item/201610/03/20161003000301_Wfm5X.jpeg" alt>
      </dt>
      <dd class="account-info">
        <p>
          <span v-if="flag">
            {{input!=''? input : '设置您的名字'}}
            <i @click="setName" class="el-icon-edit"></i>
          </span>
          <el-input
            @blur="blur"
            v-else
            maxlength="20"
            size="small"
            v-model="input"
            placeholder="请输入内容"
          ></el-input>
        </p>
        <p>
          创建时间
          <i>2019-09-12 10:12</i>
        </p>
      </dd>
    </dl>
    <ul class="social-list">
      <li>
        <div class="fleft">
          <span>
            <i>x</i>
            <b>手机号</b>
          </span>
          <span class="pd-left social-desc">手机号</span>
        </div>
        <div class="fright">
          <span>13011011746</span>

          <span class="pd-left">
            <i>已绑定</i> |
            <i>修改</i>
          </span>
        </div>
      </li>
    </ul>
    <right-pannel :style="{width:pannelWidth+'px'}">
      <span slot="title-text">手机号修改</span>
      <SetPhoneNumber/>
    </right-pannel>
  </div>
</template>
<script>
import RightPannel from "../RightPannel";
import SetPhoneNumber from "./SetPhoneNumber";
import { mapState, mapGetters } from "vuex";
import { getAuth } from "@/api/index.js";
export default {
  data() {
    return {
      input: "",
      flag: true
    };
  },
  components: {
    RightPannel,
    SetPhoneNumber
  },
  created() {
    this._getAuth();
  },
  methods: {
    setName() {
      this.flag = false;
    },
    blur() {
      console.log(1);
      this.flag = true;
    },
    async _getAuth() {
      let loginInfo = await getAuth();
      console.log(loginInfo)
      console.log(`http://192.168.199.154:8002${loginInfo.data}http://192.168.199.101:8080/accountManagement`);
      if(loginInfo.code === 403){
        // window.location.href = `http://192.168.199.154:8002${loginInfo.data}http://192.168.199.101:8080/accountManagement`
        
      }
      //window.location.href ="http://192.168.199.154:8002" 
      // switch (loginInfo.code) {
      //   case 200: {
      //     document.body.innerHTML = JSON.stringify(loginInfo.data);
      //     break;
      //   }
      //   case 400: {
      //     alert(loginInfo.msg);
      //     break;
      //   }
      //   case 403: {
          
      //     break;
      //   }
      //   default: {
      //     alert("未知的返回状态");
      //     break;
      //   }
      
    }
  },
  computed: {
    pannelWidth() {
      return this.$store.state.isRightPanelShow === true ? 300 : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.user-account {
  line-height: 30px;
  display: flex;
  align-items: center;
  padding-top: 15px;
  .avatar {
    float: left;
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .account-info {
    float: left;
    padding-left: 20px;
    p {
      padding: 13px 0;
    }
  }
}
.social-list {
  padding-top: 50px;
  li {
    padding: 20px 10px;
  }
  .fleft {
    float: left;
  }
  .fright {
    float: right;
  }
  .pd-left {
    padding-left: 30px;
  }
  .social-desc {
    color: #ccc;
  }
}
</style>

