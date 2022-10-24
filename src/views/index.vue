<template>
  <div class="proCharts" ref='charts'>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: "Index",
  data() {
    return {
      // option:{
      //   color:['rgb(8,252,7)','rgb(255,168,0)',"rgb(163,226,197)"],
      //   title: {
      //     text: ''
      //   },
      //   tooltip: { //提示框
      //     trigger: 'axis',
      //   },
      //   legend: {//图例的类型
      //     icon:'roundRect',//图例icon图标
      //     data: [
      //       {
      //         name:"上年",
      //         textStyle: {
      //           color: '#fff'
      //         }
      //
      //       },{
      //         name:"本年",
      //         textStyle: {
      //           color: '#fff'
      //         }
      //       },
      //       {
      //         name:"明年",
      //         textStyle: {
      //           color: '#fff'
      //         }
      //       },
      //     ],
      //
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //       top:'17%',
      //     containLabel: true //grid区域是否包含坐标轴的刻度标签
      //   },
      //   xAxis: {
      //     type: 'category', //坐标轴类型。
      //     boundaryGap: false, //坐标轴两边留白策略
      //     data: ['2008','2009','2010','2011','2012', '2013', '2014', '2015', '2016', '2017', '2018','2019','2020','2021','2022','2023','2024','2025','2026'],
      //     axisLabel: {//坐标轴刻度标签的相关设置
      //       interval:0,
      //       textStyle: {
      //         color: '#fff',
      //         fontSize :10
      //       },
      //     },
      //     axisLine:{//坐标轴轴线相关设置
      //       show :true,
      //       lineStyle:{
      //         color:'rgb(2,121,253)'
      //       }
      //     },
      //     axisTick:{ //坐标轴刻度相关设置。
      //       show :false,
      //     }
      //   },
      //   yAxis: {
      //     type: 'value',
      //     axisLabel: { //x轴的坐标文字
      //       show: true,
      //       textStyle: {
      //         color: '#fff' //文字的颜色
      //       },
      //
      //     },
      //     max:100,//最大值100
      //     axisLine:{//坐标轴轴线相关设置
      //       show :true,
      //       lineStyle:{
      //         color:'rgb(2,121,253)'
      //       }
      //     },
      //     axisTick:{ //坐标轴刻度相关设置。
      //       show :false,
      //     },
      //     splitLine:{  //坐标在grid区域的分割线
      //       lineStyle: { //设置分割线的样式(图表横线颜色)
      //         color: ['#153a8a']
      //       }
      //     }
      //   },
      //   series: [
      //     {
      //       name: '上年',
      //       type: 'line',
      //       data: [10,100,30,50,50,10,50,60,10,50,10,30],
      //       lineStyle:{
      //         color:'rgb(8,252,7)'  //线的颜色
      //       }
      //     },
      //     {
      //       name: '本年',
      //       type: 'line',
      //       data: [20,20,30,50,50,10,50,20,30,50,50,30],
      //       lineStyle:{
      //         color:'rgb(255,168,0)' //线的颜色
      //       }
      //     },
      //     {
      //       name: '明年',
      //       type: 'line',
      //       data: [30,30,40,60,60,20,60,30,40,60,60,40],
      //       lineStyle:{
      //         color:'rgb(163,226,197)'//线的颜色
      //       }
      //     }
      //   ]
      // } 
      option : {
        series: [
          {
            type: 'pie',
            data: [
              {
                value: 3350,
                name: '直接访问'
              },
              {
                value: 2340,
                name: '联盟广告'
              },
              {
                value: 1548,
                name: '搜索引擎'
              }
            ],
            roseType: 'area'
          },
        ]
      }
    };
},
mounted() {
    this.mycharts()
},
  methods:{
  mycharts(){
    let myChart =echarts.init(this.$refs.charts,"macarons");
    myChart.setOption(this.option)
    //图表自适应
    window.addEventListener("resize",function(){
      myChart.resize()  // myChart 是实例对象
    })
  }

},
}

</script>

<style scoped>
.proCharts{
  width: 100%;
  height: 400px;
  background: rgb(14, 51, 129);
}
</style>
