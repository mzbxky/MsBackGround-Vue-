<template>
<div>
  <div>
<el-form :inline="true" label-width="85px" style="margin-top: 10px">
  <el-form-item label="应用名称">
    <el-input v-model="query.appName" placeholder="请输入应用名称" clearable size="small" style="width: 200px" @input="getList" :disabled="this.personalOrApp"/>
  </el-form-item>
  <el-form-item label="包名">
    <el-input v-model="query.pkg" placeholder="请输入包名" clearable size="small" style="width: 200px" @input="getList" :disabled="this.personalOrApp"/>
  </el-form-item>
  <el-date-picker
    v-model="value1"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd"
    @change="serviceList()"
    :clearable="false"
    :picker-options="pickerOptions">
  </el-date-picker>
  <el-button style="margin-left: 10px" @click="serviceButton"><span v-if="this.personalOrApp">应用总览</span><span v-if="!this.personalOrApp">个人总览</span></el-button>
</el-form>
  </div>
  <div v-if="!this.personalOrApp">
    <el-table v-loading="loading" :data="list" border style="padding-bottom: 50px" :height="tableHeight" >
      <el-table-column prop="time" label="日期" sortable></el-table-column>
      <el-table-column prop="nickName" label="用户"></el-table-column>
      <el-table-column prop="appName" label="应用">
        <template slot-scope="scope">
          <el-tooltip :content=scope.row.appName placement="top">
            <!-- 注意：这个地方要传参数进去才能进行操作  函数名称(scope.row) -->
            <div @click="handleCopy(scope.row.appName)" style="cursor:pointer" class="copy">{{scope.row.appName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="pkg" label="包名">
        <template slot-scope="scope">
          <el-tooltip :content=scope.row.pkg placement="top">
            <!-- 注意：这个地方要传参数进去才能进行操作  函数名称(scope.row) -->
            <div @click="handleCopy(scope.row.pkg)" style="cursor:pointer" class="copy">{{scope.row.pkg}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="cincome" label="平台c收益" sortable></el-table-column>
      <el-table-column prop="tincome" label="平台t收益" sortable></el-table-column>
      <el-table-column prop="total" label="总计" sortable></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" style="bottom: 10px;right: 10px"/>
  </div>
  <div v-if="this.personalOrApp">
    <el-table v-loading="loading" :data="listUser" border style="padding-bottom: 50px" :height="tableHeight" >
      <el-table-column prop="time" label="日期" sortable></el-table-column>
      <el-table-column prop="nickName" label="用户"></el-table-column>
      <el-table-column prop="cincome" label="平台c收益" sortable>
        <template slot-scope="scope">
          {{scope.row.cincome}}
        </template>
      </el-table-column>
      <el-table-column prop="tincome" label="平台t收益" sortable>
        <template slot-scope="scope">
          {{scope.row.tincome}}
        </template>
      </el-table-column>
      <el-table-column prop="total" label="总计" sortable></el-table-column>
    </el-table>
    <pagination v-show="total2>0" :total="total2" :page.sync="query2.pageNum" :limit.sync="query2.pageSize" @pagination="getListUser" style="bottom: 10px;right: 10px"/>
  </div>
</div>
</template>

<script>
import {pageShow,pageShowUser} from "@/report/summary"

export default {
  name: "summary",
  data(){
    return {
      tableHeight: "",//表格高度
      //显示个人总览还是应用总览
      personalOrApp:false,
      //获取数据条数
      total:0,
      total2:0,
      //获取到的数据
      list:[],
      //获取到的数据
      listUser:[],
      //向后端传递的查询数据
      query:{
        pageNum:1,
        pageSize:20,
        appName:null,
        pkg:null,
        startDate:null,
        endDate:null,
        //当前登录名称
        userName:"operating",
      },
      query2:{
        pageNum:1,
        pageSize:20,
        startDate:null,
        endDate:null,
      },
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
    }
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
  created() {
    // if (this.$store.state.user.name !== "admin"){
    //   this.userName = this.$store.state.user.name
    // }
    this.getTableHeight()
    this.serviceList()
  },
  methods:{
    //控制列表显示
    serviceList(){
      if (this.personalOrApp === true){
        //显示个人
        this.getListUser()
      }else {
        //显示应用
        this.getList()
      }
    },
    //控制按钮
    serviceButton(){
      this.personalOrApp = this.personalOrApp !== true;
      this.serviceList()
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
    // 复制
    handleCopy(row) {
        this.copyData = row
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
    //获取数据
    getList(){
      this.query.startDate = this.value1[0]
      this.query.endDate = this.value1[1]
      this.loading = true
      pageShow(this.query).then(res=>{
        if (res.code!==0){
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }else {
          this.total = res.data.total
          this.list = res.data.list
        }
      })
      this.loading = false
    },
    //获取数据（用户）
    getListUser(){
      this.query2.startDate = this.value1[0]
      this.query2.endDate = this.value1[1]
      this.loading = true
      pageShowUser(this.query2).then(res=>{
        if (res.code!==0){
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }else {
          this.total2 = res.data.total
          this.listUser = res.data.list
        }
      })
      this.loading = false
    },
}
}
</script>

<style scoped>
/*鼠标悬停改变字体颜色*/
.copy:hover{
  color: #1c84c6;
}
</style>
