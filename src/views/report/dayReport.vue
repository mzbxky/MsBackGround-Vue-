<template>
  <div>
    <div>
  <el-card style="margin-bottom: 10px">
  <el-form :inline="true" label-width="85px" style="padding-top: 15px;margin-left: 0">
    <el-form-item label="平台切换" prop="mediaName" >
      <el-select v-model="mySqlQuery.platformList" placeholder="媒体" size="small" style="width: 200px" @change="serviceShow">
        <el-option
          v-for="dict in platformList"
          :key="dict"
          :label="dict"
          :value="dict"
        />
      </el-select>
    </el-form-item>
<!----------------------------优量汇-----------------------------  -->
    <el-form-item label="媒体名称" prop="mediaName" v-if="pageShow">
      <el-input v-model="mySqlQuery.mediaName" placeholder="请输入媒体名称" clearable size="small" style="width: 200px" @input="getList('媒体名称')"/>
    </el-form-item>
    <!----------------------------穿山甲---------------------------- -->
    <el-form-item label="应用名称" prop="mediaName" v-if="!pageShow" style="margin-left: -20px">
      <el-input v-model="pangolinQuery.appName" placeholder="请输入应用名称" clearable size="small" style="width: 200px" @input="getDataReportList('应用名称')"/>
    </el-form-item>
    <el-date-picker
      v-model="value1"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      @change="serviceDate()"
      :clearable="false"
      :picker-options="pickerOptions">
    </el-date-picker>
    <el-form-item style="margin-left: 10px" v-if="pageShow">
      <el-button  icon="el-icon-bottom-left" size="small"  @click="thirdPartyData">同步</el-button>
    </el-form-item>
    <el-form-item style="margin-left: 10px" v-if="!pageShow">
      <el-button  icon="el-icon-bottom-left" size="small"  @click="getThirdInterface" >同步</el-button>
    </el-form-item>
<!--    优量汇  -->
    <el-form-item>
      <el-select v-model="indicator" placeholder="请选择" style="width: 100px;height: 30px;margin-left: 10px;" @change="changeTu" v-if="pageShow">
        <el-option
          v-for="item in indicators"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
<!--    穿山甲 -->
    <el-form-item>
      <el-select v-model="indicator2" placeholder="请选择" style="width: 120px;height: 30px;margin-left: 10px;" @change="controlChart" v-if="!pageShow">
        <el-option
          v-for="item in indicators2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
  </el-card>
  <el-card style="margin-bottom: 10px">
  <div class="proCharts" ref='charts' >
  </div>
  </el-card>
      </div>
    <div>
<!-- 数据维度  -->
      <el-card>
<!--      穿山甲-->
    <div style="margin-left: 30px;margin-top: 20px;margin-bottom: 10px" v-if="!pageShow">
      <span style="font-size: 15px;color: rgb(96,98,102)">数据维度：</span>
      <el-checkbox v-model="pangolinQuery.byAppName" @change="getDataReportList('数据维度')">应用</el-checkbox>
      <el-checkbox v-model="pangolinQuery.byDate" @change="getDataReportList('数据维度')">时间</el-checkbox>
    </div>
<!--      优量汇   -->
      <div style="margin-left: 30px;margin-top: 20px;margin-bottom: 10px" v-if="pageShow">
        <span style="font-size: 15px;color: rgb(96,98,102)">数据维度：</span>
        <el-checkbox v-model="mySqlQuery.byMediumName" @change="getList('数据维度')">媒体名称</el-checkbox>
        <el-checkbox v-model="mySqlQuery.byDate" @change="getList('数据维度')">时间</el-checkbox>
      </div>
<!--    优量汇列表-->
        <div>
          <el-table v-loading="loading" :data="dayData" border style="padding-bottom: 50px" max-height="700" v-if="pageShow" :height="tableHeight" :summary-method="getSummaries" show-summary ref="table">
            <el-table-column prop="date" label="日期" sortable  v-if="this.mySqlQuery.byDate === true || this.mySqlQuery.byMediumName === false" width="200px">
              <template slot-scope="scope">
                {{scope.row.date}}
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" sortable  v-if="this.mySqlQuery.byDate === false && this.mySqlQuery.byMediumName === true" width="200px">
              {{this.value1[0]+"~"+this.value1[1]}}
            </el-table-column>
            <el-table-column prop="medium_name" label="媒体名称" sortable show-overflow-tooltip width="200px" v-if="this.mySqlQuery.byMediumName === true || this.mySqlQuery.mediaName !== '' && this.mySqlQuery.mediaName !== null">
              <template slot-scope="scope">
                <el-tooltip :content=scope.row.medium_name placement="top">
                  <div @click="handleCopy(scope.row)" style="cursor:pointer" class="copy">{{scope.row.medium_name}}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="ecpm" label="单价" sortable></el-table-column>
            <el-table-column prop="revenue" label="收入" sortable></el-table-column>
            <el-table-column prop="pv" label="曝光量" sortable></el-table-column>
            <el-table-column prop="ad_exposure_rate" label="曝光率" sortable></el-table-column>
            <el-table-column prop="click" label="点击量" sortable></el-table-column>
            <el-table-column prop="click_rate" label="点击率" sortable></el-table-column>
            <el-table-column prop="ad_request_count" label="请求量" sortable></el-table-column>
            <el-table-column prop="ad_return_count" label="返回量" sortable></el-table-column>
            <el-table-column prop="ad_fill_rate" label="填充率" sortable></el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="mySqlQuery.pageNum" :limit.sync="mySqlQuery.pageSize" @pagination="getList" v-if="pageShow" style="bottom: 13px;right: 10px"/>
        </div>
<!--穿山甲列表-->
        <div>
    <el-table v-loading="loading" :data="pangolinList" border style="padding-bottom: 50px" max-height="700" v-if="!pageShow" :height="tableHeight" :summary-method="getSummaries" show-summary ref="table">
      <el-table-column prop="date" label="日期" sortable v-if="this.pangolinQuery.byDate === true || this.pangolinQuery.byAppName ===false">
        <template slot-scope="scope">
          {{scope.row.date}}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="日期" sortable v-if="this.pangolinQuery.byDate === false && this.pangolinQuery.byAppName ===true">
        {{this.value1[0]+"~"+this.value1[1]}}
      </el-table-column>
      <el-table-column prop="app_name" label="应用名称" sortable v-if="this.pangolinQuery.appName !=='' || this.pangolinQuery.byAppName === true">
        <template slot-scope="scope">
          <el-tooltip :content=scope.row.app_name placement="top">
            <!-- 注意：这个地方要传参数进去才能进行操作  函数名称(scope.row) -->
            <div @click="handleCopy(scope.row)" style="cursor:pointer" class="copy">{{scope.row.app_name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="ecpm" label="预估ecpm" sortable></el-table-column>
      <el-table-column prop="revenue" label="预估收益" sortable></el-table-column>
      <el-table-column prop="click" label="点击量" sortable></el-table-column>
      <el-table-column prop="click_rate" label="点击率" sortable></el-table-column>
      <el-table-column prop="request" label="广告请求量" sortable></el-table-column>
      <el-table-column prop="response" label="广告返回量" sortable></el-table-column>
    </el-table>
          <pagination v-show="pangolinTotal>0" :total="pangolinTotal" :page.sync="pangolinQuery.pageNum" :limit.sync="pangolinQuery.pageSize" @pagination="getDataReportList" v-if="!pageShow" style="bottom: 13px;right: 10px"/>
        </div>
      </el-card>
    </div>
    </div>
</template>

<script>
import echarts from "echarts";
import {dayData,overview} from "@/report/dayReport";
import {selectPlatformName} from "@/report/platform";
import {getDataReport,selectSumList} from "@/report/dataReportSecond";

export default {
  name: "dayReport",
  data() {
    return {
      tableHeight: "",//表格高度
//------------------------------------报表相关------------------------------------
      option:{
        //线的颜色
        color:['rgb(18,170,156)','rgb(91,174,35)',"rgb(249,114,61)"],
        title: {
          text: ''
        },
        tooltip: { //提示框
          trigger: 'axis',
        },
        legend: {//图例的类型
          icon:'roundRect',//图例icon图标
          data: [
            {
              name:"",
              textStyle: {
                color: '#4a4035'
              }

            }
          ],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
            top:'17%',
          containLabel: true //grid区域是否包含坐标轴的刻度标签
        },
        xAxis: {
          type: 'category', //坐标轴类型
          boundaryGap: false, //坐标轴两边留白策略
          data: [],
          axisLabel: {//坐标轴刻度标签的相关设置
            interval:0,
            textStyle: {
              color: '#4a4035',
              fontSize :10
            },
          },
          axisLine:{//坐标轴轴线相关设置
            show :true,
            lineStyle:{
              color:'rgb(187,181,172)'
            }
          },
          axisTick:{ //坐标轴刻度相关设置。
            show :false,
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: { //x轴的坐标文字
            show: true,
            formatter: '{value}%',
            textStyle: {
              color: '#4a4035' //文字的颜色
            },

          },
          max:100,//最大值100
          axisLine:{//坐标轴轴线相关设置
            show :true,
            lineStyle:{
              color:'rgb(187,181,172)'
            }
          },
          axisTick:{ //坐标轴刻度相关设置。
            show :false,
          },
          splitLine:{  //坐标在grid区域的分割线
            lineStyle: { //设置分割线的样式(图表横线颜色)
              color: ['#dad4cb']
            }
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            data: [],
            lineStyle:{
              color:'rgb(18,170,156)'  //线的颜色
            },
            smooth : true
          }
        ]
      },
//------------------------------------请求数据------------------------------------
      query:{
        start_date:"",
        end_date:"",
        page:1,
        page_size:10
      },
      pictureMySqlQuery:{
        pageNum:1,
        pageSize:20,
        mediaName:null,
        //开始时间
        startDate:"",
        //结束时间
        endDate:"",
        byDate:true,
      },
      //数据库查询参数
      mySqlQuery:{
        pageNum:1,
        pageSize:20,
        mediaName:null,
        //开始时间
        startDate:"",
        //结束时间
        endDate:"",
        platformList:"穿山甲",
        byDate:false,
        byMediumName:true,
      },
  //----------穿山甲----------
      pictureQuery:{
        pageNum:1,
        pageSize:20,
        //应用名称
        appName:"",
        byDate:true,
        startDate:"",
        endDate:"",
      },
      pangolinQuery:{
        pageNum:1,
        pageSize:20,
        //应用名称
        appName:"",
        //广告位
        slotName:"",
        startDate:"",
        endDate:"",
      //  代码位
        codeBit:0,
        byDate:false,
        byAppName:true,
        bySlot:false,
        bySlotName:false
      },
      dataReportSecondQuery:{
        date:""
      },
//------------------------------------获取到的参数------------------------------------
      //获取到的list
      dayData:[],
      //平台列表
      platformList:[],
      //点击率
      click_rate_data:[],
      //曝光率
      ad_exposure_rate_data:[],
      //填充率
      fill_data:[],
      //点击量
      click_data:[],
      //曝光量
      pv_data:[],
      //收入
      revenue_data:[],
      //请求量
      ad_request_count_data:[],
      //返回量
      ad_return_count_data:[],
      //一共几条数据
      total:0,
      //日期
      data_data:[],
  //--------穿山甲获取到的数据-------
      pangolinList:[],
      //一共几条数据
      pangolinTotal:0,
      //应用名称
      appNameList:[],
      //广告位名称
      slotNameList:[],
      //日期
      pangolinDate:[],
      //预估收益
      revenueList:[],
      //点击率
      clickRateList:[],
      //点击量
      clickCount:[],
      //预估ecpm
      ecpm:[],
      //广告请求量
      reqcount:[],
      //广告返回量
      retcount:[],
//------------------------------------控制参数------------------------------------
      //选中的数据
      countNum:0,
      //指标
      indicators:[
        {label:"填充率",value:"填充率"},
        {label:"曝光率",value:"曝光率"},
        {label:"点击率",value:"点击率"},
        {label:"点击量",value:"点击量"},
        {label:"曝光量",value:"曝光量"},
        {label:"收入",value:"收入"},
        {label: "请求量",value: "请求量"},
        {label: "返回量",value: "返回量"}
      ],
      //指标
      indicator:'收入',
      list1:[],
      list2:[],
    // 拉取数据时间选择弹框
      selectTime:false,
      //穿山甲拉取时间选择框
      getDataTime:false,
      //控制页面展示
      pageShow:false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value1:[],
      value2: '',
      value3:'',
  //----------穿山甲----------
      //指标
      indicators2:[
        {label:"点击率",value:"点击率"},
        {label:"点击量",value:"点击量"},
        {label: "预估ecpm",value: "预估ecpm"},
        {label: "预估收益",value: "预估收益"},
        {label: "广告请求量",value: "广告请求量"},
        {label: "广告返回量",value: "广告返回量"}
      ],
      //指标
      indicator2:'预估收益',
    };
  },
  //生命周期重构表格
  updated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  mounted() {
    //挂载window.onresize事件(动态设置table高度)
    let _this = this;
    window.onresize = () => {
      if (_this.resizeFlag) {
        clearTimeout(_this.resizeFlag);
      }
      _this.resizeFlag = setTimeout(() => {
        _this.getTableHeight();
        _this.resizeFlag = null;
      }, 100);
    };
  },
  created(){
    this.getTableHeight()
    this.value1[0] = this.getAnyTime(-6)
    this.value1[1] = this.getAnyTime(0)
    //获取平台名称
    this.getPlatFormName()
    //页面是否显示
    this.serviceShow()
  },
  methods:{
    // 复制
    handleCopy(row) {
      if (this.mySqlQuery.platformList === "优量汇"){
        this.copyData = row.medium_name
      }else {
        this.copyData = row.app_name
      }
      this.copy(this.copyData)
    },
    copy(data) {
      const url = data;
      const oInput = document.createElement('input');
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand('Copy'); // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      });
      oInput.remove()
    },
    //计算table高度(动态设置table高度)
    getTableHeight() {
      let tableH = 210; //距离页面下方的高度
      let tableHeightDetil = window.innerHeight - tableH;
      if (tableHeightDetil <= 300) {
        this.tableHeight = 300;
      } else {
        this.tableHeight = window.innerHeight - tableH;
      }
    },
    //总和数据行  
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (this.mySqlQuery.platformList === "优量汇"){
          if (this.mySqlQuery.byMediumName === false && this.mySqlQuery.byDate === false || this.mySqlQuery.byDate === true){
            if (index === 4 || index === 6 || index === 9){
              sums[index] = ''
              return;
            }
          }else if(this.mySqlQuery.byMediumName === true && this.mySqlQuery.byDate === false){
            if (index === 5 || index === 10 || index === 7){
              sums[index] = ''
              if (index === 2){
                sums[index] = sums[index].toFixed(2)
              }
              return;
            }
          }
        }else {
          if (this.pangolinQuery.byAppName === true && this.pangolinQuery.byDate=== true || this.pangolinQuery.byAppName === true){
            if (index === 1 || index === 5){
              sums[index] = ''
              return;
            }
          }else if (this.pangolinQuery.byAppName === false && this.pangolinQuery.byDate === false || this.pangolinQuery.byDate === true){
            if (index === 4){
              sums[index] = ''
              return;
            }
          }
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += '';
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    serviceDate(){
      if (this.pageShow === false){
        this.getDataReportList()
        this.getPangolinData()
      }else {
        this.getList()
        this.getData()
      }
    },
    //控制页面展示
    serviceShow(){
      if (this.mySqlQuery.platformList === "优量汇"){
        this.pageShow = true
        //优量汇第一次显示直接显示总览
        this.getList("firstShow")
        this.getData()
      }else {
        //穿山甲
        this.pageShow = false
        this.getDataReportList()
        this.getPangolinData()
      }
    },
    //-------------------------------------穿山甲--------------------------------------------
    //查询列表
    getDataReportList(row){
      if (row === "应用名称"){
        this.getPangolinData()
      }
      this.loading = true
      //如果日期选择器不为空，以日期选择器为准
      if (this.value1!= null && this.value1.length > 0){
        this.pangolinQuery.startDate = this.value1[0]
        this.pangolinQuery.endDate = this.value1[1]
      }
        selectSumList(this.pangolinQuery).then(res=>{
          if (res.code !== 0){
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
          this.pangolinList = res.data.list
          this.pangolinTotal = res.data.total
        })
      this.loading = false
    },
    //给穿山甲报表数组赋值
    getPangolinData(){
      //仅由应用名称和时间控制
      this.pictureQuery.appName = ''
      this.pictureQuery.startDate = ''
      this.pictureQuery.endDate = ''
      this.pictureQuery.appName = this.pangolinQuery.appName
      this.pictureQuery.startDate = this.pangolinQuery.startDate
      this.pictureQuery.endDate = this.pangolinQuery.endDate
      selectSumList(this.pictureQuery).then(res=>{
        this.pangolinDate = []
        this.revenueList = []
        this.clickCount = []
        this.clickRateList = []
        this.ecpm = []
        this.reqcount = []
        this.retcount = []
        this.codeBitName = []
        this.appName = []
        let i = 0;
        for (let n = res.data.list.length-1;n>=0;n--){
          this.pangolinDate[i] = res.data.list[n].date
          this.revenueList[i] = res.data.list[n].revenue
          this.clickRateList[i] = res.data.list[n].click_rate
          this.clickCount[i] = res.data.list[n].click
          this.ecpm[i] = res.data.list[n].ecpm
          this.reqcount[i] = res.data.list[n].request
          this.retcount[i] = res.data.list[n].response
          //应用名称
          this.appName[i] = res.data.list[n].app_name
          i++
        }
        this.option.xAxis.data = this.pangolinDate
        this.controlChart()
      })
    },
    //控制图表
    controlChart(){
      this.list2 = [{name:"预估收益",key:this.revenueList,value:"{value}"},{name:"点击率",key:this.clickRateList,value:"{value}%"},
                    {name:"点击量",key:this.clickCount,value:"{value}"},   {name:"预估ecpm",key:this.ecpm,value:"{value}"},
                    {name:"广告请求量",key:this.reqcount,value:"{value}"},  {name:"广告返回量",key:this.retcount,value:"{value}"}]
      for (let i = 0;i<this.list2.length;i++){
        if (this.indicator2 === this.list2[i].name){
          this.option.series[0].data = this.list2[i].key
          this.option.series[0].name = this.indicator2
          this.option.legend.data[0].name = this.indicator2
          this.option.yAxis.axisLabel.formatter = this.list2[i].value
          //找出最大值
          let max = 0
          for (let n = 0;n<this.option.series[0].data.length;n++){
            if (this.option.series[0].data[n]>max){
              max = this.option.series[0].data[n]
            }
          }
          if (max < 10){
            this.option.yAxis.max = 10
          }else if(max<100){
            this.option.yAxis.max = 100
          }else if(max<1000){
            this.option.yAxis.max = 1000
          }else if(max<10000){
            this.option.yAxis.max = 10000
          }else if(max<100000){
            this.option.yAxis.max = 100000
          }
          max = 0
          break;
        }
      }
      this.mycharts()
    },
    //从第三方接口同步数据
    getThirdInterface(){
      this.dataReportSecondQuery.date = this.getAnyTime(0)
      getDataReport(this.dataReportSecondQuery).then(res=>{
        if (res.code === 0){
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.getDataTime = false
          this.value3 = ''
          this.getDataReportList()
          this.getPangolinData()
        }else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      })
    },
    //-------------------------------------优量汇--------------------------------------------
    //从数据库中获取天级报表信息
    getList(row){
      this.loading = true
      //如果日期选择器不为空，就以日期选择器为准
      if (this.value1!= null && this.value1.length > 0) {
        this.mySqlQuery.startDate = this.value1[0]
        this.mySqlQuery.endDate = this.value1[1]
      }
      if (row === "媒体名称"){
        this.getData()
      }
      this.loading = true
        overview(this.mySqlQuery).then(res=>{
          if (res.code !== 0){
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
          this.dayData = res.data.list
          this.total = res.data.total
          //给报表数组赋值
        })
      this.loading = false
    },
    getData(){
      this.pictureMySqlQuery.mediaName = ''
      this.pictureMySqlQuery.startDate = ''
      this.pictureMySqlQuery.endDate = ''
      //日期
      this.data_data = []
      //点击率
      this.click_rate_data = []
      //曝光率
      this.ad_exposure_rate_data = []
      //填充率
      this.fill_data = []
      //点击量
      this.click_data = []
      //曝光量
      this.pv_data = []
      //收入
      this.revenue_data = []
      //请求量
      this.ad_request_count_data = []
      //返回量
      this.ad_return_count_data = []
      this.pictureMySqlQuery.mediaName = this.mySqlQuery.mediaName
      this.pictureMySqlQuery.startDate = this.mySqlQuery.startDate
      this.pictureMySqlQuery.endDate = this.mySqlQuery.endDate
      overview(this.pictureMySqlQuery).then(res=>{
        //赋值
        let i = 0
        for (let n = res.data.list.length-1;n>=0;n--){
          //日期
          this.data_data[i] = res.data.list[n].date
          //点击率
          this.click_rate_data[i] = res.data.list[n].click_rate
          //曝光率
          this.ad_exposure_rate_data[i] = res.data.list[n].ad_exposure_rate
          //填充率
          this.fill_data[i] = res.data.list[n].ad_fill_rate
          //点击量
          this.click_data[i] = res.data.list[n].click
          //曝光量
          this.pv_data[i] = res.data.list[n].pv
          //收入
          this.revenue_data[i] = res.data.list[n].revenue
          //请求量
          this.ad_request_count_data[i] = res.data.list[n].ad_request_count
          //返回量
          this.ad_return_count_data[i] = res.data.list[n].ad_return_count
          i++
        }
        this.changeTu()
      })
    },
    //改变图标
    changeTu(){
      this.list1 = [
        {name:"点击率",key:this.click_rate_data,value:"{value}%"},        {name:"曝光率",key:this.ad_exposure_rate_data,value:"{value}%"},
        {name:"填充率",key:this.fill_data,value:"{value}%"},              {name:"点击量",key:this.click_data,value:"{value}"},
        {name:"曝光量",key:this.pv_data,value:"{value}"},              {name:"收入",key:this.revenue_data,value:"{value}"},
        {name:"请求量",key:this.ad_request_count_data,value:"{value}"}, {name:"返回量",key:this.ad_return_count_data,value:"{value}"}]
      for (let i = 0;i<this.list1.length;i++){
        if (this.indicator === this.list1[i].name){
          this.option.series[0].data = this.list1[i].key
          this.option.series[0].name = this.indicator
          this.option.legend.data[0].name = this.indicator
          this.option.yAxis.axisLabel.formatter = this.list1[i].value
          this.option.xAxis.data = this.data_data
          //找出最大值
          let max = 0
          for (let n = 0;n<this.option.series[0].data.length;n++){
            if (this.option.series[0].data[n]>max){
              max = this.option.series[0].data[n]
            }
          }
          if (max < 10){
            this.option.yAxis.max = 10
          }else if(max<100){
            this.option.yAxis.max = 100
          }else if(max<1000){
            this.option.yAxis.max = 1000
          }else if(max<10000){
            this.option.yAxis.max = 10000
          }else if(max<100000){
            this.option.yAxis.max = 100000
          }else if(max<1000000){
            this.option.yAxis.max = 1000000
          }
          max = 0
          break;
        }
      }
      this.mycharts()
    },
    mycharts(){
      let myChart =echarts.init(this.$refs.charts,"macarons");
      myChart.setOption(this.option)
      //图表自适应
      window.addEventListener("resize",function(){
        myChart.resize()  // myChart 是实例对象
      })
    },
    //从三方接口拉取数据
    thirdPartyData(){
      this.query.start_date = this.getAnyTime(0).replace("-",'').replace("-","")
      this.query.end_date = this.getAnyTime(0).replace("-",'').replace("-","")
      dayData(this.query).then(res=>{
        if (res.code === 0){
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.selectTime = false
          this.value2 = ''
        }else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      })
      this.getList()
      this.getData()
    },

    //获取时间
    getAnyTime(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds); //注意，这⾏是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length === 1) {
        m = "0" + month;
      }
      return m;
    },
    //查找平台
    getPlatFormName(){
      selectPlatformName().then(res=>{
        this.platformList = res
      })
    },
  },
}
</script>

<style scoped>
.proCharts{
  width: 100%;
  height: 400px;
  background: white;
}
.blue {
  background-color: #10aec2;
  color: #fffef8;
}
.orange {
  background-color: rgb(248, 244, 237);
}
.copy{
  overflow: hidden;
  white-space : nowrap;
  text-overflow: ellipsis;
}
/*鼠标悬停改变字体颜色*/
.copy:hover{
  color: #1c84c6;
}

</style>
