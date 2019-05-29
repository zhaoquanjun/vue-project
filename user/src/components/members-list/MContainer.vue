<template>
  <div class="container">
    <el-main>
      <el-row class="user-list">
        <span>成员列表</span>
      </el-row>
      <div class="user-set">
        <el-col :span="15">
          <span class="user-count">成员 (12人)</span>
          <button class="btn-item" @click="authorization">权限配置</button>
          <button class="btn-item">删除</button>
          <div class="seachInput">
            <el-input size="medium" placeholder="请输入内容" v-model="input5" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="3" :offset="6">
          <button class="btn-item invite-friends" @click="invitation">邀请成员</button>
        </el-col>
      </div>
      <m-table></m-table>
      <el-dialog width="0" :visible.sync="$store.state.isRightPanelShow || $store.state.isInvitationPanelShow" :before-close="handleClose"></el-dialog>

      <transition name="pannel">
        <right-pannel v-if="isRightPanelShow">
           <span slot="title-text">权限配置</span>
          <AuthConfig/>
        </right-pannel>
        <right-pannel v-else-if="isInvitationPanelShow">
          <span slot="title-text">邀请成员</span>
          <InvitationLink></InvitationLink>
        </right-pannel>
      </transition>
    </el-main>
  </div>
</template>
<script>
import MTable from "./MTable";
import RightPannel from "../RightPannel";
import AuthConfig from "./AuthConfig";
import InvitationLink from "./InvitationLink"
import { mapMutations, mapState } from "vuex";
export default {
  name: "homeMain",
  components: {
    MTable,
    RightPannel,
    AuthConfig,
    InvitationLink
  },
  data() {
    return {
      input5: 11,
      dialogVisible: true
    };
  },
  methods: {
    ...mapMutations(["ISRIGHTPANNELSHOW", "ISINVITATIONPANELSHOW"]),
    /**
     * 权限配置
     */
    authorization() {
      this.ISRIGHTPANNELSHOW(true);
    },
    /**
     * 邀请成员 链接
     */
    invitation() {
      this.ISINVITATIONPANELSHOW(true);
    },
     handleClose() {
        this.ISRIGHTPANNELSHOW(false);
        this.ISINVITATIONPANELSHOW(false);
      }
  },
  computed: {
    ...mapState(["isRightPanelShow", "isInvitationPanelShow"])
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 90%;
  margin-left: 50px;
  margin: 0 auto;
  box-sizing: 100%;
}
.user-list {
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.user-count {
  margin-right: 10px;
}
.user-set {
  padding: 15px 0;
  overflow: hidden;
  .btn-item {
    height: 34px;
    line-height: 34px;
    padding: 0 10px;
    background: #fff;
    border: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-right: 10px;
  }
  .invite-friends {
    margin: 0;
    float: right;
    cursor: pointer;
  }
}
.seachInput {
  display: inline-block;
  width: 200px;
  height: 36px;
  box-sizing: border-box;
  .el-button {
  }
}

.pannel-enter-active,
.pannel-leave-active {
  transition: all 1s ease;
}
.pannel-enter,
.pannel-leave-to {
  width: 0;
}
</style>

