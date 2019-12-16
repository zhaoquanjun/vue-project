<template>
  <div class="statistics">
    <div class="title">
      <span>{{sticsTitle}}</span>
      <button class="cl-button cl-button--small cl-button--primary_notbg" @click="closeStatistics">返回</button>
    </div>
    <div class="body">
      <h4>{{shareInfo.shareTitle}}</h4>
      <div class="total">
        <div>
          <img src="~img/share01.png"/>
          <p>近30日阅读数</p>
          <span>{{pvTotal}}</span>
        </div>
        <div>
          <img src="~img/share02.png"/>
          <p>近30日访客数</p>
          <span>{{uvTotal}}</span>
        </div>
        <div>
          <img src="~img/share03.png"/>
          <p>总分享数</p>
          <span>{{shareInfo.shareCount}}</span>
        </div>
      </div>
      <div class="btns">
        <span @click="changeDay(0)" :class="{active: interval==0}">近7日</span>
        <span @click="changeDay(1)" :class="{active: interval==1}">近30天</span>
      </div>
      <div id="myChart" :style="{width: '100%', height: '300px'}">
      </div>
    </div>
  </div>
</template>


<script>
import { getStatistics } from "@/api/request/account.js";
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
    },
    AddType: {
      type: String
    }
  },
  data() {
    return {
      msg: '000',
      siteId: this.$store.state.dashboard.siteId || getLocal("ymSd"),
      pvTotal: 0,
      pvList:[],
      uvTotal: 0,
      uvList:[],
      yList:[],
      yLast:[],
      pvLast:[],
      uvLast:[],
      sticsTitle: '',
      interval: 0, //设置X轴数据间隔几个显示一个，为0表示都显示
      screenWidth: document.body.clientWidth, // 屏幕宽度
      timer: true,
      myChart:null
    }
  },
  created (){
      this.sticsTitle = '页面推广数据'
      if (this.AddType == 'news') {
        this.sticsTitle = '文章推广数据'
      } else if (this.AddType == 'product') {
        this.sticsTitle = '产品推广数据'
      }
  },
  components: {
    
  },
  mounted(){
    // 监听窗口大小
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    },
    this.getInfo()
  },
  watch: {
    screenWidth(val) {
      if (this.timer) {
        this.timer = false
        setTimeout(()=> {
          this.myChart.resize();
          this.timer = true
        },500)
      }
    }
  },
  methods: {
    async getInfo(){
      let data = await getStatistics(this.siteId, this.shareInfo.id)
      if (data && data.status == 200) {
        this.pvTotal = 0;
        this.pvList = [];
        this.uvTotal = 0;
        this.uvList = [];
        this.yList=[];
        this.yLast= [];
        this.pvLast=[];
        this.uvLast=[];
        if(data.data.pv.length > 0) {
          data.data.pv.map((item, index)=>{
            this.pvTotal = this.pvTotal + item.count;
            this.pvList.push(item.count);
            this.yList.push(item.flag.slice(5,10))
            if(index > 23) {
              this.pvLast.push(item.count);
              this.yLast.push(item.flag.slice(5,10))
            }
          })
          data.data.uv.map((item, index)=>{
            this.uvTotal = this.uvTotal + item.count;
            this.uvList.push(item.count)
            if(index > 23) {
              this.uvLast.push(item.count);
            }
          })
        }
        this.initCode()
      }
    },
    //closeStatistics
    closeStatistics(){
      this.$emit('closeStatistics')
    },
    //改变天数
    changeDay(val){
      this.interval = val
      this.initCode()
    },
    //生成图表
    initCode(){
      // 基于准备好的dom，初始化echarts实例

        this.myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        this.myChart.setOption({
          backgroundColor: '#fff',
          legend: {
            // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
            x: 'right',
            // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
            y: 'top',
            data:['阅读数','访问数']
          },
          grid: {
              left: '0%',
              right: '2%',
              bottom: '0%',
              containLabel: true
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.interval == 1 ? this.yList:this.yLast,
              axisLabel: {
                interval: this.interval  //设置X轴数据间隔几个显示一个，为0表示都显示
              },
              axisLine: {
                lineStyle: {
                  color: '#A1A8B1'
                }
              }
          },
          yAxis: {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#A1A8B1'
                }
              }
            },
          series: [
              {
                  name:'阅读数',
                  type:'line',
                  stack: '阅读数',
                  symbolSize:5,
                  symbol:'circle', 
                  smooth: true, 
                  data: this.interval == 1 ? this.pvList:this.pvLast
              },
              {
                  name:'访问数',
                  type:'line',
                  stack: '访问数',
                  symbolSize:5,
                  symbol:'circle',
                  smooth: true, 
                  data: this.interval == 1 ? this.uvList:this.uvLast
              }
          ],
          color: ['#23CD5D', '#FF6A00']
        });
    }
  }
   
    
};
</script>

<style lang="scss" scoped>
.statistics {
  .title {
    height: 32px;
    width: 100%;
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    line-height: 32px;
    button {
      height: 32px;
      line-height: 12px;
    }
  }
  .body {
    padding: 0 32px;
    height:570px;
    min-width: 1050px;
    background:rgba(255,255,255,1);
    border-radius:$--border-radius-base;
    border:1px solid rgba(229,229,229,1);
    h4 {
      font-size:$--font-size-small;
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
        border-radius:$--border-radius-base;
        border:1px solid rgba(229,229,229,1);
        margin-right: 24px;
        &:last-child {
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
          color:rgba(38,38,38,1);
          line-height:24px;
        }
      }
    }
    .btns {
      margin: 32px 0 0;
      width:184px;
      height:36px;
      display: flex;
      justify-content: space-between;
      border-radius:18px;
      border:1px solid rgba(185,203,207,1);
      span {
        display: inline-block;
        width:90px;
        height:36px;
        text-align: center;
        line-height: 36px;
        border-radius:18px;
        font-weight:400;
        color:rgba(38,38,38,1);
        cursor: pointer;
      }
      .active {
        background: $--color-primary;
        color: white;
      }
    }
  }
}
</style>