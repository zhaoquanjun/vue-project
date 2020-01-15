<template>
  <div>
    <div class="storeTitle">
      <div class="storeTitleText">产品价格</div>
      <div>
        计价货币
        <el-select
          v-model="storePrice.storeTypeValue"
          placeholder="请选择"
          style="width:140px;margin-left:8px"
        >
          <el-option
            v-for="item in storeTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="storePrice">
      <div class="storePrice-content">
        <div class="storePrice-title">
          <div class="storePrice-originalPrice">现价</div>
          <div class="storePrice-price">原价</div>
        </div>
        <div class="storePrice-priceContent">
          <div class="storePrice-originalPrice">
            <el-input
              placeholder="现价"
              v-model="storePrice.price"
              @blur="blurPrice"
              style="width:170px"
            >
              <i slot="prefix" class="storePrice-type">{{storeType(storePrice.storeTypeValue)}}</i>
            </el-input>
            <div class="ym-form-item__error" v-show="errorOriginalPrice">请输入有效金额</div>
          </div>
          <div class="storePrice-price">
            <el-input
              placeholder="原价"
              v-model="storePrice.originalPrice"
              @blur="blurOriginalPrice"
              style="width:170px"
            >
              <i slot="prefix" class="storePrice-type">{{storeType(storePrice.storeTypeValue)}}</i>
            </el-input>
            <div class="ym-form-item__error" v-show="errorPrice">请输入有效金额</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["storeData"],
  components: {},

  data() {
    return {
      storeTypeList: [
        {
          value: 0,
          label: "人民币（￥）"
        },
        {
          value: 1,
          label: "美元（$）"
        },
        {
          value: 2,
          label: "欧元（€）"
        },
        {
          value: 3,
          label: "日元（￥）"
        },
        {
          value: 4,
          label: "英镑（£）"
        },
        {
          value: 5,
          label: "韩元（₩）"
        }
      ],
      storePrice: {
        storeTypeValue: 0,
        originalPrice: "0.00",
        price: "0.00"
      },
      errorOriginalPrice: false,
      errorPrice: false
    };
  },

  mounted() {},
  methods: {
    blurOriginalPrice() {
      if (this.storePrice.originalPrice == "") {
        this.storePrice.originalPrice = "0.00";
      }
      if (this.isNumber(this.storePrice.originalPrice)) {
        this.storePrice.originalPrice = this.storePrice.originalPrice.substr(
          0,
          this.storePrice.originalPrice.indexOf(".") + 3
        );
        this.errorOriginalPrice = false;
      } else {
        this.errorOriginalPrice = true;
      }
    },
    blurPrice() {
      if (this.storePrice.price == "") {
        this.storePrice.price = "0.00";
      }
      if (this.isNumber(this.storePrice.price)) {
        this.storePrice.price = this.storePrice.price.substr(
          0,
          this.storePrice.price.indexOf(".") + 3
        );
        this.errorPrice = false;
      } else {
        this.errorPrice = true;
      }
    },
    storeType(type) {
      switch (type) {
        case 0:
          return "￥";
        case 1:
          return "$";
        case 2:
          return "€";
        case 3:
          return "￥";
        case 4:
          return "£";
        case 5:
          return "₩";
      }
    },
    isNumber(val) {
      let regPos = /^\d+(\.\d+)?$/; //非负浮点数
      let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    storeData() {
      this.storePrice.storeTypeValue = this.storeData.currencyType;
      this.storePrice.originalPrice = this.storeData.originalPrice;
      this.storePrice.price = this.storeData.price;
    }
  }
};
</script>
<style lang="scss" scoped>
.storeTitle {
  height: 60px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: $--border-base;
  .storeTitleText {
    font-size: $--font-size-base;
    font-weight: 500;
    color: $--color-text-primary;
  }
}
.storePrice {
  height: 166px;
  padding: 24px;
  box-sizing: border-box;
  .storePrice-content {
    width: 100%;
    border: $--border-base;
    .storePrice-title {
      height: 42px;
      display: flex;
      align-items: center;
      border-bottom: $--border-base;
      .storePrice-originalPrice {
        display: inline-block;
        width: 70%;
        box-sizing: border-box;
        padding-left: 40px;
        color: #a1a8b1;
      }
      .storePrice-price {
        display: inline-block;
        color: #a1a8b1;
      }
    }
    .storePrice-priceContent {
      //   height: 62px;
      margin: 16px 0;
      display: flex;
      align-items: center;
      .storePrice-originalPrice {
        display: inline-block;
        width: 70%;
        box-sizing: border-box;
        padding-left: 40px;
      }
      .storePrice-price {
        display: inline-block;
      }
      .storePrice-type {
        line-height: 32px;
      }
    }
  }
}
</style>
