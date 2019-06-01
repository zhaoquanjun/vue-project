<template>
  <div>
    <div class="auth-name-title">
      <span class="item-left">权限名称</span>
      <span v-if="isSelect" class="item-right explain">说明</span>
      <span v-else class="item-right empty" @click="empty">清空</span>
    </div>
    <ul class="auth-list">
      <template v-if="authList.length>0">
        <li class="list-item" v-for="item in authList" :key="item.id" @click="curAuth(item)">
        <span class="item-left">{{item.name}}</span>
        <span class="item-right" v-if="isSelect">{{item.mark}}</span>
        <span class="item-right auth-icon" v-else @click="removeAuth(item)">
          <i class="iconfont icon-weibiaoti-"></i>
        </span>
      </li>
      </template>
    
    </ul>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "AuthList",
  props: {
    isSelect:{
      type:Boolean
    },
    authList: {
      type:Array,
      default: () => ([])
    }
  },
  created() {
    console.log(this.authList,'00000000')
  },
  methods: {
    curAuth(item) {
      this.$emit("chooseAuth", item);
    },
    removeAuth(item) {
      console.log(item)
      this.$emit("removeSelected", item);
    },
    empty() {
      this.$emit("emptySelected");
    }
  },
  computed: {
    memberManager() {
      return this.$store.state.memberManager;
    }
    //  ...mapState(["authList"])
    // ...mapState("memberManager", {
    //   curmemberInfo: state => {
    //     alert(state);
    //   }
    // })
  }
};
</script>

<style lang="scss" scoped>
.auth-name-title {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #efefef;
}
.auth-list{
  min-height: 200px;
}
.auth-list .list-item {
  height: 40px;
  line-height: 40px;
  width: 100%;
  span {
    display: inline-block;
  }
}
.item-left {
  width: 40%;
  float: left;
}
.item-right {
  width: 60%;
  padding-left: 10px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  color: #8c8c8c;
}
.explain {
  color: #262626;
}
.empty {
  width: 30%;
  color: #00c1de;
  text-align: right;
  float: right;
}
.auth-icon {
  text-align: right;
}
.icon-weibiaoti- {
  color: #f4542b;
}
</style>
