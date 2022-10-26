<template>
<div>
  <div>
<el-form :inline="true" label-width="85px" style="margin-top: 15px">
<!--  <el-form-item label="平台切换" >-->
<!--    <el-select v-model="platform" placeholder="媒体" size="small" style="width: 200px">-->
<!--      <el-option-->
<!--        v-for="dict in platformList"-->
<!--        :key="dict"-->
<!--        :label="dict"-->
<!--        :value="dict"-->
<!--      />-->
<!--    </el-select>-->
<!--  </el-form-item> -->
  <el-form-item label="应用名称">
    <el-input v-model="query.appName" placeholder="请输入应用名称" clearable size="small" style="width: 200px" @input="getList"/>
  </el-form-item>
  <el-form-item label="包名">
    <el-input v-model="query.pkg" placeholder="请输入包名" clearable size="small" style="width: 200px" @input="getList"/>
  </el-form-item>
  <el-date-picker
    v-model="value1"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd"
    @change="getList()"
    :clearable="false"
    :picker-options="pickerOptions">
  </el-date-picker>
</el-form>
  </div>
  <div>
    <el-table v-loading="loading" :data="list" border style="padding-bottom: 50px" :height="tableHeight">
      <el-table-column prop="time" label="日期" ></el-table-column>
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
      <el-table-column prop="cincome" label="平台c收益"></el-table-column>
      <el-table-column prop="tincome" label="平台t收益"></el-table-column>
      <el-table-column prop="total" label="总计"></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" style="bottom: 10px;right: 10px"/>
  </div>
</div>
</template>

<script>
import {selectPlatformName} from "@/report/platform";
import {pageShow} from "@/report/summary"

export default {
  name: "summary",
  data(){
    return {
      tableHeight: "",//表格高度
      //获取数据条数
      total:0,
      //平台绑定参数
      platform:'穿山甲',
      //平台
      platformList:[],
      //获取到的数据
      list:[],
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
  created() {
    // if (this.$store.state.user.name !== "admin"){
    //   this.userName = this.$store.state.user.name
    // }
    this.getTableHeight()
    this.getPlatFormName()
    this.getList()
  },
  methods:{
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
        this.total = res.data.total
        this.list = res.data.list
      })
      this.loading = false
    },
    //查找平台
    getPlatFormName(){
      selectPlatformName().then(res=>{
        this.platformList = res
      })
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
