<template>
  <div>
    <div style="height: 55px">
      <el-form :inline="true" label-width="85px" style="margin-top: 15px;margin-left:5px;min-width: 1800px">
        <el-form-item label="用户" prop="userName" v-if="this.nowUser" style="margin-left:-30px">
          <el-select v-model="query2.userId" placeholder="请选择" clearable size="small" style="width: 240px" @change="getListUser">
            <el-option
              v-for="dict in userArray"
              :key="dict.userId"
              :label="dict.nickName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" >
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="getListUser()"
            :clearable="false"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
  <div>
    <el-table v-loading="loading" :data="listUser" border style="padding-bottom: 50px" :height="tableHeight" :summary-method="getSummaries" show-summary ref="table">
      <el-table-column prop="time" label="日期" sortable></el-table-column>
      <el-table-column prop="nickName" label="用户"></el-table-column>
      <el-table-column prop="cincome" label="穿山甲" sortable></el-table-column>
      <el-table-column prop="tincome" label="腾讯" sortable></el-table-column>
      <el-table-column prop="total" label="总计" sortable></el-table-column>
    </el-table>
    <pagination v-show="total2>0" :total="total2" :page.sync="query2.pageNum" :limit.sync="query2.pageSize" @pagination="getListUser" style="bottom: 10px;right: 10px"/>
  </div>
  </div>
</template>

<script>
import {pageShowUser} from "@/report/summary"
import {selectUser} from "@/management/mediaList";
export default {
  name: "userSummary",
  data(){
    return{
      tableHeight: "",//表格高度
      //所属用户数组
      userArray:[],
      total2:0,
      //获取到的数据
      listUser:[],
      query2:{
        pageNum:1,
        pageSize:20,
        startDate:null,
        endDate:null,
        userId:null
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
      //当前登录是否是admin
      nowUser:false,
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
    this.selectUserArray()
    this.getTableHeight()
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
          if (index === 1){
            sums[index] = ''
          }
          if (index === 4 || index === 2 || index === 3){
            sums[index] = sums[index].toFixed(2)
            return;
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
    //查询所属用户
    selectUserArray(){
      this.loading = true
      selectUser().then(res =>{
        for (let i in res){
          this.userArray[i] = res[i]
        }
        if (this.$store.state.user.name === "admin"){
          this.getListUser()
          this.nowUser = true
        }else {
          for (let i = 0;i<this.userArray.length;i++){
            if (this.$store.state.user.name === this.userArray[i].userName){
              this.query2.userId = this.userArray[i].userId
              this.getListUser()
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
/* /deep/ 为深度操作符，可以穿透到子组件 */
/deep/ .el-table {
  display: flex;
  flex-direction: column;
}

/* order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方 */
/deep/ .el-table__body-wrapper {
  order: 1;
}
</style>
