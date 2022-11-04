<template>
<div>
  <div style="height: 55px">
    <el-form :inline="true" label-width="85px" style="margin-top: 15px;margin-left:-25px;min-width: 1800px;">
      <el-form-item label="用户" prop="userName" v-if="this.nowUser">
        <el-select v-model="query.userId" placeholder="请选择" clearable size="small" style="width: 240px" @change="getList">
          <el-option
            v-for="dict in userArray"
            :key="dict.userId"
            :label="dict.nickName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称">
        <el-input v-model="query.appName" placeholder="请输入应用名称" clearable size="small" style="width: 200px" @input="getList"/>
      </el-form-item>
      <el-form-item label="包名">
        <el-input v-model="query.pkg" placeholder="请输入包名" clearable size="small" style="width: 200px" @input="getList"/>
      </el-form-item>
      <el-form-item label="日期" >
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
  </el-form-item>
    </el-form>
  </div>
  <div>
    <el-table v-loading="loading" :data="list" border style="padding-bottom: 50px" :height="tableHeight" :summary-method="getSummaries" show-summary  ref="table">
      <el-table-column prop="time" label="日期" sortable></el-table-column>
      <el-table-column prop="nickName" label="用户"></el-table-column>
      <el-table-column prop="appName" label="应用">
        <template slot-scope="scope">
<!--          提示框-->
<!--          <el-tooltip :content=scope.row.appName placement="top">-->
            <!-- 注意：这个地方要传参数进去才能进行操作  函数名称(scope.row) -->
            <div @click="handleCopy(scope.row.appName)" style="cursor:pointer" class="copy">{{scope.row.appName}}</div>
<!--          </el-tooltip>-->
        </template>
      </el-table-column>
      <el-table-column prop="pkg" label="包名">
        <template slot-scope="scope">
            <div @click="handleCopy(scope.row.pkg)" style="cursor:pointer" class="copy">{{scope.row.pkg}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="cincome" label="穿山甲" sortable></el-table-column>
      <el-table-column prop="tincome" label="腾讯" sortable></el-table-column>
      <el-table-column prop="total" label="总计" sortable></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" style="bottom: 10px;right: 10px"/>
  </div>
</div>
</template>

<script>
import {pageShow} from "@/report/summary"
import {selectUser} from "@/management/mediaList";

export default {
  name: "summary",
  data(){
    return {
      tableHeight: "",//表格高度
      //获取数据条数
      total:0,
      //获取到的数据
      list:[],
      //当前登录是否是admin
      nowUser:false,
      //向后端传递的查询数据
      query:{
        pageNum:1,
        pageSize:20,
        appName:null,
        pkg:null,
        startDate:null,
        endDate:null,
        //当前登录名称
        userId:null,
      },
      //所属用户数组
      userArray:[],
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
  created() {
    this.getTableHeight()
    this.selectUserArray()
  },
  methods:{
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          let totalCount = 0;
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              totalCount++;
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index === 4 || index === 5 || index === 6){
            sums[index] = sums[index].toFixed(2)
          }
          if (index === 1){
            sums[index] = '';
          }
          sums[index] += '';
        } else {
          sums[index] = '';
        }
      });
      return sums;
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
    //查询所属用户
    selectUserArray(){
      this.loading = true
      selectUser().then(res =>{
        for (let i in res){
          this.userArray[i] = res[i]
        }
        if (this.$store.state.user.name === "admin"){
          this.getList()
          this.nowUser = true
        }else {
          for (let i = 0;i<this.userArray.length;i++){
            if (this.$store.state.user.name === this.userArray[i].userName){
              this.query.userId = this.userArray[i].userId
              this.getList()
              break;
            }
          }
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
/*!* /deep/ 为深度操作符，可以穿透到子组件 *!*/
/*/deep/ .el-table {*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*}*/

/*!* order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方 *!*/
/*/deep/ .el-table__body-wrapper {*/
/*  order: 1;*/
/*}*/
</style>
