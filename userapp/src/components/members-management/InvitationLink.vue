<template>
  <div class="invita-link">
    <p class="invita-title invita-item">将链接发送给成员, 成员加入后即可协助您管理站点</p>
    <p class="link-wrap">
      <span class="link">https://www.baidu.com</span>
      <button class="link-btn">复制成功</button>
    </p>
    <p class="invita-item invita-tip">一个邀请链接只能邀请一个成员, 有效期3天</p>
  </div>
</template>
<style lang="scss" scoped>
.invita-link {
  padding: 40px;
  p {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    margin-bottom: 15px;
  }
  .invita-title {
    color: #262626;
  }
  .invita-tip {
    color: #8c8c8c;
  }
  .link-wrap {
    box-sizing: border-box;
    .link {
      display: inline-block;
      background: #e8f8fb;
      width: 300px;
      padding-left: 15px;
    }
    .link-btn {
      background: #00b539;
      border: none;
      width: 70px;
      height: 32px;
      color: #fff;
      margin-left: 10px;
    }
  }
}
</style>