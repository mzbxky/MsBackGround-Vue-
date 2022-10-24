<template>
<div>
<!--  class="U_head"-->
  <div>
  <el-form :model="query" ref="queryForm" :inline="true" label-width="85px" style="padding-top: 15px;margin-left: -30px">
    <el-row>
<!--      <el-form-item label="日期" prop="NowTime">-->
<!--        <el-date-picker-->
<!--          type="date"-->
<!--          :clearable="false"-->
<!--          v-model="query.NowTime"-->
<!--          @change="getList"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          placeholder="选择日期">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
      <el-form-item label="用户" prop="userName" v-if="!this.optionUser">
        <el-select v-model="query.userName" placeholder="请选择" clearable size="small" style="width: 240px" @change="getList(1)" :disabled="this.optionUser">
          <el-option
            v-for="dict in userArray"
            :key="dict.userId"
            :label="dict.nickName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="媒体" prop="pck">
<!--        <el-input v-model="query.name" placeholder="请输入媒体" clearable size="small" style="width: 240px" @change="getList"/> -->
        <el-select v-model="query.name" placeholder="媒体" clearable size="small" style="width: 150px" @change="getList">
          <el-option
            v-for="dict in beLongUserMedia"
            :key="dict.name"
            :label="dict.name"
            :value="dict.name"
          >
            <span style="float: left">{{dict.name}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{dict.exp}} {{dict.pkg}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="包名" prop="pkg">
        <el-input v-model="query.pkg" placeholder="请输入包名" clearable size="small" style="width: 240px" @input="getList"/>
      </el-form-item>
      <el-form-item label="别名" prop="exp">
        <el-input v-model="query.exp" placeholder="请输入别名" clearable size="small" style="width: 240px" @input="getList"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small"  @click="handleQuery" >搜索</el-button>
      </el-form-item>
      <el-button @click="handleDelete" icon="el-icon-delete" :disabled="deleteId.length === 0" style="margin-left: 20px" v-hasPermi="['management:delete']">
        <span>批量删除</span>
        <span>{{this.countNum}}</span>
      </el-button>
      <el-button type="primary" size="small" @click="showMedia" icon="el-icon-plus" v-hasPermi="['management:insert']">新增</el-button>
    </el-row>
  </el-form>
  </div>
<div>
    <el-table v-loading="loading" :data="managementList" @selection-change="handleSelectionChange" border style="padding-bottom: 50px" :height="tableHeight" >
    <el-table-column v-show="false" type="selection" width="55" align="center"/>
    <el-table-column prop="name" label="名称" width="180" sortable></el-table-column>
    <el-table-column prop="pkg" label="包名" width="180" content="提示信息" >
      <template slot-scope="scope" content="提示信息">
        <el-tooltip :content=scope.row.pkg placement="top">
          <div @click="handleCopy(scope.row)" style="cursor:pointer" class="copy" id="pckDiv">{{scope.row.pkg}}</div>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="exp" label="别名"></el-table-column>
    <el-table-column prop="version" label="版本"></el-table-column>

    <el-table-column prop="state" label="状态" sortable>
      <template slot-scope="scope">
        <div v-if="scope.row.state===0">
          <span>审核中</span>
        </div>
        <div v-else-if="scope.row.state===1">
          <span style="color: #13ce66">已上线</span>
        </div>
        <div v-else-if="scope.row.state===2">
          <span style="color: red">已下线</span>
        </div>
        <div v-else >
          <span>暂无状态</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="cid" label="平台C">
      <template slot-scope="scope">
        <div v-if="scope.row.cid==null">
          <el-tag type="danger">未关联</el-tag>
        </div>
        <div v-else-if="scope.row.cid===''">
          <el-tag type="danger">未关联</el-tag>
        </div>
        <div v-else>
          <el-tooltip class="item" effect="dark" :content="scope.row.cid"
                      placement="top-start">
            <el-tag type="success">已关联</el-tag>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="tid" label="平台T">
      <template slot-scope="scope">
        <div v-if="scope.row.tid==null">
          <el-tag type="danger">未关联</el-tag>
        </div>
        <div v-else-if="scope.row.tid==='' || scope.row.tid == null">
          <el-tag type="danger">未关联</el-tag>
        </div>
        <div v-else>
          <el-tooltip class="item" effect="dark" :content="scope.row.tid"
                      placement="top-start">
            <el-tag type="success">已关联</el-tag>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
      <el-table-column prop="utime" label="修改时间"></el-table-column>
    <el-table-column prop="userName" label="所属用户"></el-table-column>

    <el-table-column prop="address" label="操作" v-if="checkPermi(['management:update'])">
      <template slot-scope="scope">
        <el-button size="mini" type="text"  @click="updateClick(scope.row)" icon="el-icon-edit">修改</el-button>
        <el-button size="mini" type="text"  @click="deleteInfo(scope.row)" icon="el-icon-delete">删除</el-button>
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport(scope.row)"-->
<!--          v-hasPermi="['management:export']"-->
<!--        >导出</el-button>   -->
      </template>
    </el-table-column>
  </el-table>
<!--  <div class="page" style="padding-right: 200px;bottom: 55px">-->
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" style="bottom: 13px;right: 10px"/>
<!--  </div>-->
</div>

<!--  媒体新增-->
  <el-dialog  :visible.sync="media" width="500px" append-to-body @close="media = false" style="text-align:center" v-if="media" title="新增">
    <el-form :model="insertMedia" ref="tableData" :inline="true" @submit.native.prevent key="1" label-width="auto" :rules="rules">
      <el-row>
        <el-form-item label="所属用户:" prop="userName">
          <!--          <el-input v-model="insertMedia.state" placeholder="注：0审核中，1已上线，2已下线" clearable size="small" style="width: 260px" onkeyup="value=value.replace(/[^0-2_]/g,'');"/>-->
          <el-select v-model="insertMedia.userName" placeholder="请选择" clearable size="small" style="width: 275px">
            <el-option
              v-for="dict in userArray"
              :key="dict.userId"
              :label="dict.nickName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="insertMedia.name" placeholder="请输入媒体名称" clearable size="small" style="width: 275px"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="包名:" prop="pkg">
          <el-input v-model="insertMedia.pkg" placeholder="请输入包名" clearable size="small" style="width: 275px"/>
        </el-form-item>
      </el-row>
<!--      <el-row>-->
<!--        <el-form-item label="别名" prop="nick">-->
<!--          <el-input v-model="insertMedia.nick" placeholder="请输入别名" clearable size="small" style="width: 260px"/>-->
<!--        </el-form-item> -->
<!--      </el-row>-->
      <el-row>
        <el-form-item label="别名:" prop="exp">
          <el-input v-model="insertMedia.exp" placeholder="请输入别名" clearable size="small" style="width: 275px"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="版本:" prop="version">
          <el-input v-model="insertMedia.version" placeholder="请输入版本" clearable size="small" style="width: 275px;" onkeyup="value=value.replace(/[^0-9_]/g,'');"/>
        </el-form-item>
      </el-row>
      <el-row>
<!--        <el-option v-for="(type, index) in commodityType"  :key="index" :label="type.dictLabel" :value="type.dictValue"/>-->
        <el-form-item label="状态:" prop="state">
<!--          <el-input v-model="insertMedia.state" placeholder="注：0审核中，1已上线，2已下线" clearable size="small" style="width: 260px" onkeyup="value=value.replace(/[^0-2_]/g,'');"/>-->
          <el-select v-model="insertMedia.state" placeholder="请选择" clearable size="small" style="width: 275px">
            <el-option
              v-for="dict in dict.type.media"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="平台C:" prop="cid">
          <el-input v-model="insertMedia.cid" placeholder="请输入关联平台C" clearable size="small" style="width: 275px"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="平台T:" prop="tid">
          <el-input v-model="insertMedia.tid" placeholder="请输入关联平台T" clearable size="small" style="width: 275px"/>
        </el-form-item>
      </el-row>

      <el-form-item>
        <el-button type="primary" size="small"  @click="insertMediaInfo()" >添加</el-button>
        <el-button @click="showMedia">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
<!--  修改弹窗 -->
  <el-dialog  :visible.sync="updateShow" width="500px" append-to-body @close="updateShow = false" style="text-align:center" v-if="updateShow">
    <el-form ref="updateInfo" :model="updateInfo" :inline="true" @submit.native.prevent key="1" label-width="auto" :rules="updateRule">
      <el-row>
        <el-form-item label="用户:" prop="userName" v-if="!optionUser">
          <el-select v-model="updateInfo.userId" placeholder="请选择" clearable size="small" style="width: 240px">
            <el-option
              v-for="dict in userArray"
              :key="dict.userId"
              :label="dict.nickName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
      </el-row>
        <el-row>
          <el-form-item label="名称:" prop="name">
            <el-input v-model="updateInfo.name"  placeholder="请输入名称" clearable size="small" style="width: 240px"/>
          </el-form-item>
        </el-row>
      <el-row>
        <el-form-item label="包名:" prop="pkg">
          <el-input v-model="updateInfo.pkg" placeholder="请输入包名" clearable size="small" style="width: 240px" :disabled="optionUser" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="别名:" prop="exp">
          <el-input v-model="updateInfo.exp" placeholder="请输入别名" clearable size="small" style="width: 240px"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="版本:" prop="version">
          <el-input v-model="updateInfo.version" placeholder="请输入版本" clearable size="small" style="width: 240px"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="状态:" prop="state">
          <el-select v-model="updateInfo.state" placeholder="请选择" clearable size="small" style="width: 240px">
            <el-option label="审核中" :value="0"></el-option>
            <el-option label="已上线" :value="1"></el-option>
            <el-option label="已下线" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="平台C:" prop="cid">
          <el-input v-model="updateInfo.cid" placeholder="请输入平台C" clearable size="small" style="width: 240px"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="平台T:" prop="tid">
          <el-input v-model="updateInfo.tid" placeholder="请输入平台T" clearable size="small" style="width: 240px"/>
        </el-form-item>
      </el-row>
<!--      <el-row>-->
<!--        <el-form-item label="所属用户" prop="nickName">-->
<!--          <el-input v-model="item.nickName" placeholder="请输入名称" clearable size="small" style="width: 240px"/>-->
<!--        </el-form-item>-->
<!--      </el-row>-->
      <el-form-item>
        <el-button type="primary" size="small"  @click="update()">修改</el-button>
        <el-button @click="closeUpdate">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
import {selectList,deleteControlInfo,insertInfo,updateControlList,selectUser,userInfo} from "@/management/mediaList"
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import {selectMediaByUser} from "@/management/advertising";

export default {
  name: "list",
  dicts: ['media'],
  data() {
    return {
      tableHeight: "",//表格高度
      //新增表单验证
      rules:{
        name:[{required: true,message: '媒体名称不能为空', trigger: 'blur'}],
        pkg:[ { required: true, message: '包名不能为空',trigger: 'blur'}],
        exp:[ { required: true, message: '别名不能为空',trigger: 'blur'}],
        userName:[{required: true, message: '所属用户不能为空',trigger: 'blur'}]
      },
      //修改表单验证
      updateRule:{
        name:[{required: true,message: '名称不能为空', trigger: 'blur'}],
        pkg:[{ required: true, message: '包名不能为空',trigger: 'blur'}],
      },
      //传递的数据
      updateInfo:{
        id:null,
        name:null,
        pkg:null,
        exp:null,
        state:null,
        cid:null,
        tid:null,
        username:null,
        version:null,
        userId:null
      },
      total: 0, // 一共几条数据
      //添加媒体是否显示
      media:false,
      dialogOpen:true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //媒体新增参数信息
      insertMedia:{
        id:null,
        //媒体名称
        name:null,
        //包名
         pkg:null,
        //版本
        version:null,
        //状态
        state:null,
        //平台C
        cid:null,
        //平台T
        tid:null,
        //所属用户
        userName:null,
        //别名
        exp:null
      },
      //查询信息
      query:{
        pageNum: 1,
        pageSize: 20,
        id:null,
        name:null,
        pkg:null,
        NowTime:null,
        //所属用户
        userName:null,
        exp:null
      },
      //修改框是否弹出
      updateShow:false,
      //媒体列表数据
      managementList:[],
      //删除的id数组
      deleteId:[],
      //被选中的数量
      countNum:0,
      //向后台传递的修改数据
      //传往后台的数据
      info:{
        //id
        id:null,
        //媒体名称
        name:null,
        //包名
        pck:null,
        //别名
        nick:null,
        //媒体状态
        state:null,
        //c媒体
        cid:null,
        //t媒体
        tid:null,
        //所属用户
        username:1
      },
      //所属用户数组
      userArray:[],
      //所属用户下的媒体
      beLongUserMedia:[],
      //-----------------------------------------------权限管理控制-----------------------------------------------
      //当前登录的用户名
      varuserName:null,
      //选择用户是否可用
      optionUser:false,
      //操作列是否显示
      updateColumn:true
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
    // this.getNowTime()
    this.getTableHeight()
    this.selectUserArray()
    this.userInfo()
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
      this.copyData = row.pkg
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
    //权限信息
    checkPermi,
    checkRole,
    //获取当前登录信息
    userInfo(){
      this.loading = true
      //获取当前的登录信息
      this.varuserName =this.$store.state.user.name
        userInfo(this.varuserName).then(res=>{
          if (res[0].roleKey === "operating"){
            this.query.userName = res[0].userId
            this.getList()
            this.optionUser = true
          }else if (res[0].roleKey === "admin"){
            this.query.userName = ''
          }else {
            this.getList()
          }
        })
      this.loading = false
    },
    //查询所属用户
    selectUserArray(){
      selectUser().then(res =>{
        for (let i in res){
          this.userArray[i] = res[i]
        }
        this.getList()
      })
    },
    selectMediaInInsert(){
      selectMediaByUser(this.query.userName).then(res=>{
        this.beLongUserMedia = res
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.deleteId = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.countNum = this.deleteId.length
    },
    //处理默认选中当前日期
    getNowTime() {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date}`;
      this.$set(this.query, "NowTime", defaultDate);
    },
    // 全部删除
    //
    handleDelete(row) {
        this.$confirm('此操作将永久删除所选文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          const deleteId = row.id || this.deleteId;
          if (deleteId != null && deleteId !== '' || deleteId[0] != null && deleteId[0] !== undefined){
            deleteControlInfo(deleteId).then(res=>{
              this.getList()
            })
          }else {
            this.$message.error('请先选中要操作的数据');
          }
          this.deleteId.value = []
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    getList(){
      this.loading = true
      selectList(this.query).then(res=>{
        this.managementList = res.list
        this.total = res.total
        this.selectMediaInInsert()
        this.loading = false
  })
},
    //修改
    /*
      this.info.id = this.updateInfo[0].id
      this.info.name = this.updateInfo[0].name
      this.info.pck = this.updateInfo[0].pkg
      this.info.exp = this.updateInfo[0].exp
      this.info.state = this.updateInfo[0].state
      this.info.cid = this.updateInfo[0].cid
      this.info.tid = this.updateInfo[0].tid
      this.info.username = this.updateInfo[0].username
      this.info.version = this.updateInfo[0].version
      this.info.userId = this.updateInfo[0].userId
    */
    updateClick(row){
      this.query.id = row.id
      selectList(this.query).then(res=>{
        this.updateInfo.id = res.list[0].id
        this.updateInfo.name = res.list[0].name
        this.updateInfo.pkg = res.list[0].pkg
        this.updateInfo.exp = res.list[0].exp
        this.updateInfo.state = res.list[0].state
        this.updateInfo.cid = res.list[0].cid
        this.updateInfo.tid = res.list[0].tid
        this.updateInfo.username = res.list[0].username
        this.updateInfo.version = res.list[0].version
        this.updateInfo.userId = res.list[0].userId
        this.query.id = null
      })
      this.updateShow = true
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
              deleteControlInfo(deleteId).then(res=>{
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
    },
    //媒体新增是否显示
    showMedia(){
      if (this.media === false){
        this.media = true
      }else if (this.media === true) {
        this.media = false
      }
    },
    //媒体信息增加
    insertMediaInfo(){
      if (this.insertMedia.name == null || this.insertMedia.pkg == null || this.insertMedia.exp == null || this.insertMedia.userName == null|| this.insertMedia.userName == ''){
        this.$message.error('请填写完整的数据');
      }else {
        insertInfo(this.insertMedia).then(res=>{
          if (res > 0){
            this.$message.success('添加成功');
          }else {
            this.$message.error('添加失败');
          }
          this.getList()
        })
        this.media = false
        //添加完成后使对象置空
        this.insertMedia = {}
      }
    },
    //修改弹窗
    update(){
      this.info.id = this.updateInfo.id
      this.info.name = this.updateInfo.name
      this.info.pck = this.updateInfo.pkg
      this.info.exp = this.updateInfo.exp
      this.info.state = this.updateInfo.state
      this.info.cid = this.updateInfo.cid
      this.info.tid = this.updateInfo.tid
      this.info.username = this.updateInfo.username
      this.info.version = this.updateInfo.version
      this.info.userId = this.updateInfo.userId
      if (this.info.name == null || this.info.name === '' ||this.info.pck == null || this.info.pck === ''){
        this.$message.error('请输入完整的数据');
      }else {
        updateControlList(this.info).then(res =>{
          if (res>0){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }else {
            this.$message.error('修改失败');
          }
          this.updateShow = false
          this.getList()
        })
      }

    },
    //搜索
    //
    handleQuery(){
      this.getList();
    },
    /** 导出按钮操作 */
    handleExport(row) {
      this.query.id = row.id
      this.download('management/export', {
        ...this.query
      }, `data_${new Date().getTime()}.xlsx`)
    },
    /** 全部导出按钮操作 */
    allHandleExport(row) {
      this.query.NowTime = null
      this.download('management/export', {
        ...this.query
      }, `data_${new Date().getTime()}.xlsx`)
    },
    //修改页面关闭
    closeUpdate(){
      this.updateShow =false
    },
    //重置
    resetQuery(){
      //把搜索条件置空
      this.query = {}
      this.query.pageNum = 1
      this.query.pageSize = 20
      this.getList()
    },
}}
</script>

<style scoped>
#pckDiv{
  overflow: hidden;
  white-space : nowrap;
  text-overflow: ellipsis;
}
.el-form-item__label {
  text-align: justify;
}
.point{
  cursor: pointer;
  }
/*鼠标悬停改变字体颜色*/
.copy:hover{
  color: #1c84c6;
}
</style>
