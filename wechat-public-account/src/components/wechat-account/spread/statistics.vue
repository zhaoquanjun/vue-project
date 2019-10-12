<template>
  <div class="statistics">
    <div class="title">
      <span>这里是页面标题</span>
      <span class="btn">返回</span>
    </div>
    <div class="body">
      <h4>{{'风向标题'}}</h4>
      <div class="total">
        <div>
          <img src="~img/share01.png"/>
          <p>近30日阅读数</p>
          <span>30</span>
        </div>
        <div>
          <img src="~img/share02.png"/>
          <p>近30日访客数</p>
          <span>230</span>
        </div>
        <div>
          <img src="~img/share03.png"/>
          <p>总分享数</p>
          <span>230</span>
        </div>
      </div>
      <div class="btn">
      </div>
      <div id="myChart" :style="{width: '100%', height: '300px'}">

      </div>
    </div>
  </div>
</template>


<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
//require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
export default {
  props: {
    shareInfo: {
      type:Object
    }
  },
  data() {
    return {
      msg: '000'
    }
  },
  components: {
    
  },
  mounted(){
    this.initCode()
  },
  watch: {
    
  },
  methods: {
    
    //生成图表
    initCode(){
      // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data:['视频广告','直接访问','搜索引擎']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一','周二','周三','周四','周五','周六']
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name:'视频广告',
                  type:'line',
                  stack: '总量',
                  data:[150, 232, 201, 154, 190, 330, 410]
              },
              {
                  name:'直接访问',
                  type:'line',
                  stack: '总量',
                  data:[320, 332, 301, 334, 390, 330, 320]
              },
              {
                  name:'搜索引擎',
                  type:'line',
                  stack: '总量',
                  data:[820, 932, 901, 934, 1290, 1330, 1320]
              }
          ]
        });
    }
  }
   
    
};
</script>

<style lang="scss" scoped>
.statistics {
  .title {
    height: 68px;
    padding: 14px 0;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    .btn {
      width:90px;
      height:40px;
      border-radius:2px;
      border:1px solid rgba(9,204,235,1);
      color: rgba(9,204,235,1);
      text-align: center;
    }
  }
  .body {
    padding: 0 32px;
    height:570px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(229,229,229,1);
    h4 {
      font-size:14px;
      font-weight:400;
      color:rgba(38,38,38,1);
      line-height:22px;
      margin: 24px 0 16px;
    }
    .total {
      display: flex;
      div {
        height: 85px;
        padding: 8px;
        flex: 1;
        height:85px;
        border-radius:4px;
        border:1px solid rgba(229,229,229,1);
        margin-right: 24px;
        &.div:last-child {
          margin-right: 0;
        }
        img {
          float: left;
          width: 70px;
          height: 70px;
          margin-right: 16px;
        }
        p {
          font-weight:400;
          color:rgba(161,168,177,1);
          line-height:32px;
          margin-top: 6px;
        }
        span {
          font-size:24px;
          font-family:"HelveticaNeue";
          color:rgba(38,38,38,1);
          line-height:24px;
        }
      }
    }
  }
}
</style>