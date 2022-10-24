<template>
<div>
  <el-form :model="query" ref="queryForm" :inline="true" label-width="85px" style="padding-top: 15px">
    <el-form-item label="平台名称" prop="name">
      <el-input v-model="query.name" placeholder="请输入平台名称" clearable size="small" style="width: 240px" @input="getList"/>
    </el-form-item>
    <el-form-item label="主体公司" prop="name">
      <el-input v-model="query.company" placeholder="请输入主体公司" clearable size="small" style="width: 240px" @input="getList"/>
    </el-form-item>
    <el-button @click="deleteInfo" icon="el-icon-delete" :disabled="deleteId.length === 0" style="margin-left: 20px;">
      <span>批量删除</span>
      <span>{{this.countNum}}</span>
    </el-button>
    <el-button @click="updateInfoWindow('insertClick')" >新增</el-button>
  </el-form>
  <div>
    <el-table v-loading="loading" :data="dataList" border @selection-change="handleSelectionChange" style="padding-bottom: 50px" :height="tableHeight">
      <el-table-column v-show="false" type="selection" width="55" align="center"/>
      <el-table-column prop="platform_id" label="平台id" sortable ></el-table-column>
      <el-table-column prop="name" label="平台名称" sortable></el-table-column>
      <el-table-column prop="company" label="主体公司" sortable></el-table-column>
      <el-table-column prop="secret" label="私钥" sortable><span>*************</span></el-table-column>
      <el-table-column prop="alias" label="备注名" sortable></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="updateInfoWindow(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteInfo(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" style="bottom: 13px;right: 10px"/>
    <el-dialog  :visible.sync="updatePlatform" width="500px" append-to-body @close="updatePlatform = false" style="text-align:center" v-if="updatePlatform" title="平台信息修改">
      <el-form :model="updateQuery" ref="tableData" :inline="true" @submit.native.prevent key="1" label-width="auto">
        <el-row>
          <el-form-item label="平台id:" prop="platform_id">
            <el-input v-model="updateQuery.platform_id" placeholder="请输入平台id" clearable size="small" style="width: 275px" :disabled="idDisOr"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="平台名称:" prop="name">
            <el-input v-model="updateQuery.name" placeholder="请输入平台名称" clearable size="small" style="width: 275px"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="主体公司:" prop="company">
            <el-input v-model="updateQuery.company" placeholder="请输入主体公司" clearable size="small" style="width: 275px"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="私钥:" prop="secret">
            <el-input v-model="updateQuery.secret" placeholder="请输入私钥" clearable size="small" style="width: 275px"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注名:" prop="alias">
            <el-input v-model="updateQuery.alias" placeholder="请输入备注名" clearable size="small" style="width: 275px"/>
          </el-form-item>
        </el-row>
        <el-form-item>
          <el-button type="primary" size="small"  @click="updateData()"><span v-if="idDisOr">修改</span><span v-if="!idDisOr">新增</span></el-button>
          <el-button @click="shutDown">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</div>
</template>

<script>
import {selectPlatformList,deleteMany,updatePlatform,insertInfo} from "@/report/platform";
 export default {
  name: "platform",
  data(){
    return{
      tableHeight: "",//表格高度
      total:0,
      query:{
        pageNum:1,
        pageSize:20,
        id:null,
        name:null
      },
      //id是否禁用
      idDisOr:true,
      //删除的id数组
      deleteId:[],
      //列表
      dataList:[],
      countNum:0,
      //修改参数
      updateQuery:{
        id:null,
        platform_id:null,
        name:null,
        company:null,
        secret:null,
        alias:null
      },
      //修改弹窗
      updatePlatform:false
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
    this.getTableHeight()
    this.getList()
  },
  methods: {
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
    //多选框
    handleSelectionChange(selection) {
      this.deleteId = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.countNum = this.deleteId.length
    },
    //查询列表
    getList(){
      this.loading = true
      selectPlatformList(this.query).then(res=>{
        this.total = res.total
        this.dataList = res.list
      })
      this.loading = false
    },
    //修改
    updateInfoWindow(row){
      this.idDisOr = true
      if (row === "insertClick"){
        this.idDisOr = false
        this.updateQuery.platform_id = null
        this.updateQuery.name = null
        this.updateQuery.company = null
        this.updateQuery.secret = null
        this.updateQuery.alias = null
      }else {
        this.query.id = row.id
        selectPlatformList(this.query).then(res=>{
          this.updateQuery.id = res.list[0].id
          this.updateQuery.platform_id = res.list[0].platform_id
          this.updateQuery.name = res.list[0].name
          this.updateQuery.company = res.list[0].company
          this.updateQuery.secret = res.list[0].secret
          this.updateQuery.alias = res.list[0].alias
        })

        this.query.id = null
      }
      this.updatePlatform = true
    },
    //发送修改或添加
    updateData(){
      if (this.idDisOr === true){
        updatePlatform(this.updateQuery).then(res=>{
          if (res.code === 0){
            this.$message({
              type: 'success',
              message: res.msg
            });
          }
        })
      }else {
        insertInfo(this.updateQuery).then(res=>{
          if (res.code === 0){
            this.$message({
              type: 'success',
              message: res.msg
            });
          }
        })
      }
      this.updatePlatform = false
      this.getList()
    },
    shutDown(){
      this.updatePlatform = false
    },
    //删除
    deleteInfo(row){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteId = row.id || this.deleteId;
        this.loading = true
        if (deleteId != null && deleteId !== '' || deleteId[0] != null && deleteId[0] !== undefined){
          deleteMany(deleteId).then(res=>{
            this.getList()
          })
        }else {
          this.$message.error('请先选中要操作的数据');
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
