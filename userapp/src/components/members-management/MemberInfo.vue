<template>
  <dl class="members—info">
    <dt class="avatar">
      <img
        src="../../assets/avatar.jpeg"
        onerror
      >
    </dt>
    <dd class="basic">
      <span>
        姓名 :
        <i>{{memberInfo.displayName}}</i>
      </span>
      <span>
        手机 :
        <i>{{memberInfo.phoneNumber}}</i>
      </span>
      <span>
        备注 :
        <i>暂无备注</i>
      </span>
    </dd>
  </dl>
</template>
<script>
export default {
    props:{
        memberInfo:{
            type:Object,
            default: () => ({})
        }
    }
}
</script>

<style lang="scss" scoped>
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
</style>
