<template>
  <div class="define-menu__area border clearfix">
    <div class="menu-phone__area">
      <div class="phone-box__area">
        <div class="phone-menu__area">
          <div class="phone-menu__keyboard"></div>
          <div class="phone-menu__divider"></div>
          <div class="no-menu__area" v-if="menuList.length == 0" @click="_handleAddMainMenu">+ 添加菜单</div>
          <ul class="phone-menu__list">
            <li
              v-for="(item, index) in menuList"
              :key="index"
              :class="{selected: index == curIndex}"
              @click="_handleSelectMenu(index)"
            >
              {{item.name || '主菜单'}}
              <ul class="menu-child__area">
                <li v-for="(child, idx) in item.children" :key="idx">
                  <i class="iconfont iconshang menu-move__icon"></i>
                  {{child.name || '子菜单'}}
                </li>
                <li @click="_handleAddChildMenu" v-show="item.children.length < 5">+</li>
              </ul>
            </li>
            <li v-if="menuList.length > 0 &&  menuList.length < 3">+</li>
          </ul>
        </div>
      </div>
      <div class="primary-button__nomal" @click="_handleMenuOrder">菜单排序</div>
    </div>
    <div class="menu-operate__arae">
      <order-menu v-show="isOrder"></order-menu>
      <div v-show="!isOrder">
        <div class="empty" v-if="menuList.length > 0">
          <div class="empty-icon"></div>
          <p>您还没有添加菜单</p>
        </div>
        <div class="menu-operate__box" v-else>
          <div class="menu-operate__header"></div>
          <div class="menu-operate__content">
            <div class="content-menu__name">
              <label>菜单名称</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OrderMenu from "_c/wechat-account/defineMenu/order-menu";
export default {
  data() {
    return {
      curIndex: 0,
      isOrder: false,
      menuList: [
        {
          name: "",
          children: [{ name: "" }, { name: "" }]
        },
        {
          name: "www",
          children: [
            { name: "2222" },
            { name: "3333" },
            { name: 444 },
            { name: "3333" },
            { name: 444 }
          ]
        }
      ]
    };
  },
  components: {
    OrderMenu
  },
  methods: {
    // 菜单排序
    _handleMenuOrder() {},
    // 切换menu
    _handleSelectMenu(i) {
      this.curIndex = i;
    },
    // 添加主菜单
    _handleAddMainMenu() {},
    // 添加子菜单
    _handleAddChildMenu() {}
  }
};
</script>

<style lang="scss" scoped>
.define-menu__area {
  margin: 0 auto;
  width: 1500px;
  max-width: 100%;
  min-width: 1000px;
  height: 908px;
  border-radius: 20px;
  .menu-phone__area {
    float: left;
    width: 590px;
    height: 100%;
    text-align: center;
    .phone-box__area {
      position: relative;
      margin: 48px auto 36px;
      width: 466px;
      height: 782px;
      border: 1px dashed #c9d9dc;
      background: url("~img/account/account_menu_phone.png") no-repeat center
        center;
      background-size: 100% 100%;
      .phone-menu__area {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 34px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 406px;
        height: 52px;
        background: rgba(248, 250, 252, 1);
        .phone-menu__keyboard {
          padding: 17px 33px 19px 34px;
          width: 93px;
          height: 54px;
          background: url() no-repeat center center;
          background-size: 100% 100%;
        }
        .phone-menu__divider {
          width: 1px;
          height: 32px;
          background: #a1a8b1;
        }
        .no-menu__area {
          width: calc(100% - 94px);
          height: 52px;
          text-align: center;
          line-height: 52px;
          color: #09cceb;
          font-size: 14px;
          font-family: "PingFangSC";
          font-weight: 400;
        }
        .phone-menu__list {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: calc(100% - 94px);
          li {
            position: relative;
            width: 106px;
            height: 52px;
            line-height: 52px;
            text-align: center;
            color: #09cceb;
            cursor: pointer;
            .menu-child__area {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              bottom: 60px;
              display: none;
              width: 140px;
              border: 1px solid #c9d9dc; // 需换底图
              li {
                margin: 0 auto;
                padding: 8px 0;
                height: auto;
                line-height: 34px;
                text-align: center;
                width: 104px;
                color: #262626;
                border-top: 1px solid #c9d9dc;
                .menu-move__icon {
                  margin-right: 8px;
                  font-size: 16px;
                  color: #262626;
                }
              }
              li:first-of-type {
                border-top: none;
              }
            }
          }
          li.selected {
            .menu-child__area {
              display: block;
            }
          }
          li:last-of-type {
            color: #262626;
          }
          .selected {
            border: 1px solid #09cceb;
          }
        }
      }
    }
  }
  .menu-operate__arae {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    width: calc(100% - 590px);
    height: 100%;
    background: #f8fafc;
    border-top-right-radius: 20px;
    .empty {
      width: 160px;
      height: 130px;
      .empty-icon {
        width: 160px;
        height: 106px;
        background: url("~img/account/accout_no_menu.png") no-repeat center
          center;
        background: cover;
      }
      p {
        margin-top: 3px;
        font-size: 14px;
        font-family: "PingFangSC";
        font-weight: 400;
        color: rgba(164, 178, 191, 1);
        line-height: 20px;
        text-align: center;
      }
    }
    .menu-operate__box {
      width: 85%;
      height: 820px;
    }
  }
}
</style>