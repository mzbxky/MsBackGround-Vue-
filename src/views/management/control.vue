<template>
<div>
  <div style="height: 70px">
  <el-form :model="query" ref="queryForm" :inline="true" label-width="85px" style="padding-top: 15px;min-width: 1800px">
    <el-row v-if="selectShow">
      <!--  用户、所属媒体-->
      <el-form-item label="所属用户" prop="mediaName" v-if="!optionUser">
      <el-select v-model="beLongUser" placeholder="所属用户" size="small" style="width: 150px;" clearable @change="selectMedia" :disabled="optionUser">
        <el-option
          v-for="dict in userArray"
          :key="dict.userId"
          :label="dict.nickName"
          :value="dict.userId"
        />
      </el-select>
      </el-form-item>
      <!--  选择媒体  -->
      <el-form-item label="媒体" prop="mediaName" style="margin-left: -30px">
      <el-select v-model="query.mediaName" placeholder="媒体" clearable size="small" style="width: 150px" @change="getList">
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
      <el-form-item label="包名" prop="pck" style="margin-left: -40px">
        <el-input v-model="query.pck" placeholder="请输入包名" clearable size="small" style="width: 200px" @input="getList"/>
      </el-form-item>
      <el-form-item label="渠道" prop="channel" style="margin-left: -40px">
        <el-select v-model="query.channel" placeholder="请选择" clearable size="small" style="width: 240px" @change="getList">
          <el-option
            v-for="dict in selectChannelArray"
            :key="dict.name"
            :label="dict.alt"
            :value="dict.name"
            style="height: 30px"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small"  @click="handleQuery" >搜索</el-button>
      </el-form-item>
      <el-button size="small" @click="cType" style="background-color: #71e2a3;color: white" icon="el-icon-edit" :disabled="ids.length === 0" v-hasPermi="['control:openOrOff']">广告开关</el-button>
      <el-button size="small" @click="changeTypeTwo" style="background-color: #57c3c2;color: white" icon="el-icon-edit" :disabled="ids.length === 0" v-hasPermi="['control:secondary']">二次确认</el-button>
      <el-button @click="handleDelete" icon="el-icon-delete" style="" :disabled="ids.length === 0" v-hasPermi="['control:delete']">
        <span>批量删除</span>
        {{this.countNum}}
      </el-button>
      <el-button @click="insertShow" icon="el-icon-plus" v-hasPermi="['control:insert']">
        <span>新增</span>
      </el-button>
    </el-row>
<!--    <el-button type="primary" size="small" @click="hiddenSelect" icon="el-icon-search" style="width: 50px;background-color: #778899;border-color: unset;margin-bottom: 5px"></el-button>-->
  </el-form>
  </div>
<!--  <el-button -->
<!--    type="warning"-->
<!--    plain-->
<!--    icon="el-icon-download"-->
<!--    size="mini"-->
<!--    @click="allHandleExport"-->
<!--    v-hasPermi="['advertisingControl:export']"  -->
<!--  >全部导出</el-button>-->
  <el-table
    :data="controlList"
    stripe
    border
    :height="tableHeight"
    style="width: 100%;padding-bottom: 50px" @selection-change="handleSelectionChange">
    <el-table-column v-show="false" type="selection" width="55" align="center"/>
    <el-table-column prop="name" label="名称" width="180" sortable></el-table-column>
    <el-table-column prop="pck" label="包名" width="210" :show-overflow-tooltip="true">
      <template slot-scope="scope" >
        <el-tooltip :content=scope.row.pck placement="top" :show-overflow-tooltip="true">
        <!-- 注意：这个地方要传参数进去才能进行操作  函数名称(scope.row) -->
        <div @click="handleCopy(scope.row)" style="cursor:pointer" class="copy" id="pckDiv">{{scope.row.pck}}</div>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="alt" label="渠道" sortable></el-table-column>
    <el-table-column prop="version" label="版本"></el-table-column>
    <el-table-column prop="state" label="状态" sortable>
      <template slot-scope="scope">
      <el-switch
        @change="cType(scope.row)"
        v-model="scope.row.state"
        active-color="#13ce66"
        inactive-color="LightGray"
        :active-value="1"
        :inactive-value="0" :disabled="!checkPermi(['control:delete'])">
      </el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="confirm" label="二次确认">
      <template slot-scope="scope">
        <el-switch
          @change="changeTypeTwo(scope.row)"
          v-model="scope.row.confirm"
          active-color="#57c3c2"
          inactive-color="LightGray"
          :active-value="1"
          :inactive-value="0" :disabled="!checkPermi(['control:delete'])">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="ctime" label="修改时间"></el-table-column>
    <el-table-column prop="address" label="操作" v-if="checkPermi(['control:delete'])">
      <template slot-scope="scope">
        <el-button size="mini" type="text"  @click="updateClick(scope.row)" icon="el-icon-edit" v-hasPermi="['control:update']">修改 </el-button>
        <el-button size="mini" type="text"  @click="deleteInfo(scope.row)" icon="el-icon-delete" v-hasPermi="['control:delete']">删除</el-button>
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport(scope.row)"-->
<!--          v-hasPermi="['advertisingControl:export']"-->
<!--        >导出</el-button>-->
      </template>
    </el-table-column>
  </el-table>
<!--  新增  -->
  <el-dialog  :visible.sync="showIf" width="500px" append-to-body @close="showIf = false" style="text-align:center" v-if="showIf" title="新增" :rules="insertRule">
    <el-form :model="insetForm" ref="tableData" :inline="true" @submit.native.prevent key="1" label-width="auto">
      <el-row>
        <el-form-item label="所属用户:" prop="mediaName" v-if="!optionUser">
          <el-select v-model="insert_user" placeholder="所属用户" size="small" style="width: 260px;" @change="selectMediaInInsert" :disabled="optionUser">
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
        <el-form-item label="媒体:" prop="mediaName">
          <el-select v-model="insetForm.mediaName" placeholder="媒体" clearable size="small" style="width: 260px" @change="selectPckAndApp">
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
      </el-row>
      <el-row>
        <el-form-item label="应用名称:" prop="name" :required="true">
          <el-input v-model="insetForm.name" placeholder="请输入应用名称" clearable size="small" style="width: 260px" disabled/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="包名:" prop="pck" :required="true">
          <el-input v-model="insetForm.pck" placeholder="请输入包名" clearable size="small" style="width: 260px" disabled/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="版本号:" prop="version">
          <el-input v-model="insetForm.version" placeholder="请输入版本号" clearable size="small" style="width: 260px" onkeyup="value=value.replace(/[^0-9_]/g,'');"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="渠道标识:" prop="channelArray">
          <el-checkbox-group v-model="channelLogo" placeholder="请选择" clearable size="small" style="width: 260px">
            <el-checkbox
              v-for="dict in selectChannelArray"
              :key="dict.name"
              :label="dict.name"
              :value="dict.name"
            >{{dict.alt}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small"  @click="insert" @blur="insert()">添加</el-button>
        <el-button @click="insertShow">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
<!--  插入渠道-->
  <el-dialog  :visible.sync="showChannelIf" width="500px" append-to-body @close="showChannelIf = false" style="text-align:center" v-if="showChannelIf" title="新增渠道">
    <el-form :model="insertChannelForm" ref="tableData" :inline="true" @submit.native.prevent key="1">
      <el-row>
        <el-form-item label="渠道标识" prop="name">
          <el-input v-model="insertChannelForm.name" placeholder="请输入渠道标识" clearable size="small" style="width: 260px"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="渠道中文名" prop="name">
          <el-input v-model="insertChannelForm.alt" placeholder="请输入渠道中文名" clearable size="small" style="width: 260px"/>
        </el-form-item>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small"  @click="insertChannel" >添加</el-button>
        <el-button @click="insertChannelShow">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
<!--  修改 -->
  <el-dialog  :visible.sync="updateShow" width="500px" append-to-body @close="updateShow = false" style="text-align:center" v-if="updateShow" >
    <el-form :model="updateInfo" ref="updateInfo" :inline="true" @submit.native.prevent key="1" label-width="auto" :rules="updateRule">
      <el-row>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="updateInfo.name" placeholder="请输入名称" clearable size="small" style="width: 240px" disabled/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="包名:" prop="pck">
          <el-input v-model="updateInfo.pck" placeholder="请输入名称" clearable size="small" style="width: 240px" disabled/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="版本:" prop="version">
          <el-input v-model="updateInfo.version" placeholder="请输入名称" clearable size="small" style="width: 240px" onkeyup="value=value.replace(/[^0-9_]/g,'');"/>
        </el-form-item>
      </el-row>
      <el-row>
<!--         -->
        <el-form-item label="渠道:" prop="channel">
          <el-select v-model="updateInfo.channel" placeholder="请选择" clearable size="small" style="width: 240px" @change="getList">
            <el-option
              v-for="dict in selectChannelArray"
              :key="dict.name"
              :label="dict.alt"
              :value="dict.name"
              style="height: 30px"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small"  @click="updateButton" >修改</el-button>
        <el-button @click="closeUpdateWindows">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" style="bottom: 13px;right: 10px"/>
</div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {selectAdvertisingList,deleteAdvertisingInfo,changeType,insert,insertChannel,changeSecondConfirm,updateAdvertisingList,selectMediaByUser,selectChannel} from "@/management/advertising";
import {selectList, selectUser, userInfo} from "@/management/mediaList"
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
export default {
  name: "control",
  dicts: ['open_type','second_type'],
  data(){
    return{
      tableHeight: "",//表格高度
      insertRule:{
        mediaName:[{required: true,message: '媒体名称不能为空', trigger: 'blur'}],
        version:[ { required: true, message: '版本号不能为空',trigger: 'blur'}],
      },
      updateRule:{
        name:[{required: true,message: '名称不能为空', trigger: 'blur'}],
        version:[{required: true,message: '版本号不能为空', trigger: 'blur'}],
      },
      //不为空提示信息
      isNotNull:null,
      //总条数
      total:0,
      updateShow:false,
      value:true,
      dialogOpen:true,
      //新增窗口是否弹出
      showIf:false,
      //新增渠道窗口是否弹出
      showChannelIf:false,
      //查询出的数据
      controlList:[],
      //下拉框的数组
      //传递给弹出层的数据
      updateInfo: {
        id: null,
        name: null,
        pck: null,
        version: null,
        channel: null,
      },
      //搜索框是否显示
      selectShow:true,
      //所属用户
      beLongUser:110,
      //所属用户下的媒体
      beLongUserMedia:[],
      // 查询参数
      query:{
        pageNum: 1,
        pageSize: 20,
        id:null,
        pck:null,
        channel:null,
        NowTime:null,
        //渠道标识s
        name:null,
        mediaName:null,
        userName:null
      },
      //新增参数
      insetForm:{
        //应用名称
        name:null,
        //包名
        pck:null,
        //版本号
        version:null,
        // //渠道标识
        // channel:'huawei',
        channel:null,
        //媒体
        mediaName:null,
        //状态
        state:'0',
        //二次确认
        confirm:'0',
        //用户id
        userName:null
      },
      //渠道标识
      channelLogo:[],
      //新增渠道绑定参数
      insertChannelForm:{
        name:null,
        alt:null,
      },
      //删除的id数组
      ids:[],
      //被选中的数量
      countNum:0,
      //全部选中
      isSelectAll:false,
      //往后台传递的数据
      infoAlter:{
        id:null,
        name:null,
        pck:null,
        version:null,
        altName:null,
      },
      //渠道数组
      selectChannelArray:[],
      userArray:[],
      //新增弹窗选择用户
      insert_user:110,

      //-----------------------------------------------权限管理控制-----------------------------------------------
      //当前登录的用户名
      varuserName:null,
      //选择用户是否可用
      optionUser:false,
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
    this.userInfo()
    this.selectMedia()
    this.selectUserArray()
    this.selectChannelArrayList()
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
      // console.log('row', JSON.parse(JSON.stringify(row)))
      this.copyData = row.pck
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
            //运营
            this.beLongUser = res[0].userId
            this.insert_user = res[0].userId
            this.query.userName = this.beLongUser
            this.getList()
            this.selectMedia()
            this.optionUser = true
          }else if (res[0].roleKey === "admin"){
            this.beLongUser = null
            this.getList()
            this.selectMedia()
          }
        })
      this.loading = false
    },
    //删除提示框
    deleteInfo(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = row.id || this.ids;
        if (ids!=null && ids !== '' || ids[0] != null && ids[0] !== undefined){
          deleteAdvertisingInfo(ids).then(res=>{
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
    selectMediaInInsert(){
      selectMediaByUser(this.insert_user).then(res=>{
        this.beLongUserMedia = res
      })
    },
    //查询所属用户
    selectUserArray(){
      selectUser().then(res =>{
        for (let i in res){
          this.userArray[i] = res[i]
        }
      })
    },
    selectChannelArrayList(){
      selectChannel().then(res =>{
        for (let i in res){
          this.selectChannelArray[i] = res[i]
        }
      })
    },
    selectMedia(){
      //所属用户
      selectMediaByUser(this.beLongUser).then(res=>{
        this.beLongUserMedia = res
        if (this.query.mediaName != null){
          this.query.mediaName = null
        }
      })
      this.getList()
    },
    //根据媒体查询包名、应用名
    selectPckAndApp(){
      selectList({name:this.insetForm.mediaName}).then(res=>{
        this.insetForm.pck = res.list[0].pkg
        this.insetForm.name = res.list[0].exp
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.countNum = this.ids.length
    },
    //隐藏搜索
    hiddenSelect(){
      this.selectShow = this.selectShow !== true;
    },
    //处理默认选中当前日期
    // getNowTime() {
    //   var now = new Date();
    //   var year = now.getFullYear(); //得到年份
    //   var month = now.getMonth(); //得到月份
    //   var date = now.getDate(); //得到日期
    //   month = month + 1;
    //   month = month.toString().padStart(2, "0");
    //   date = date.toString().padStart(2, "0");
    //   var defaultDate = `${year}-${month}-${date}`;
    //   this.$set(this.query, "NowTime", defaultDate);
    // },
    // 全部删除
    //
    handleDelete(row) {
      this.$confirm('此操作将永久删除所选文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        const ids = row.id || this.ids;
        if (ids!=null && ids !== '' || ids[0] != null && ids[0] !== undefined){
          deleteAdvertisingInfo(ids).then(res=>{
        if (res === 0){
              this.$message.error('删除失败');
            }
            this.getList()
          })
        }else {
          this.$message.error('请先选中要操作的数据');
        }
        this.ids.value = []
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
    //
    //修改广告状态
    cType(row){
      const ids = row.id || this.ids;
      if (ids!=null && ids !== '' || ids[0] != null && ids[0] !== undefined){
        changeType(ids).then(res=>{
          this.getList()
        })
      }else {
        this.$message.error('请先选中要操作的数据');
      }
      this.ids = []
    },
    //二次确认
    changeTypeTwo(row){
      const ids = row.id || this.ids;
      if (ids!=null && ids !== '' || ids[0] != null && ids[0] !== undefined){
        changeSecondConfirm(ids).then(res=>{
          this.getList()
        })
      }else {
        this.$message.error('请先选中要操作的数据');
      }
      this.ids = []
    },
    //查询列表
    getList(){
      this.loading = true
      this.query.userName = this.beLongUser
      selectAdvertisingList(this.query).then(res => {
        this.controlList = res.list
        this.total = res.total
        this.loading = false
      })
    },
    //修改
    updateClick(row){
      this.query.id = row.id
      this.loading = true
      selectAdvertisingList(this.query).then(res => {
        this.updateInfo.id = res.list[0].id
        this.updateInfo.name = res.list[0].name
        this.updateInfo.pck = res.list[0].pck
        this.updateInfo.version= res.list[0].version
        this.updateInfo.channel = res.list[0].channel
        this.query.id = null
      })
      this.loading = false
      this.updateShow = true
    },
    //修改弹窗
    updateButton(){
      this.infoAlter.id = this.updateInfo.id
      this.infoAlter.name = this.updateInfo.name
      this.infoAlter.pck = this.updateInfo.pck
      this.infoAlter.version = this.updateInfo.version
      this.infoAlter.channel = this.updateInfo.channel
      if (this.infoAlter.name == null || this.infoAlter.name === '' || this.infoAlter.version == null || this.infoAlter.version === ''){
        this.$message.error('请输入完整的值');
      }else {
        updateAdvertisingList(this.infoAlter).then(res =>{
          if (res>0){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }else {
            this.$message.error('修改失败,请检查可能有相同的数据');
          }
          this.getList()
        })
        this.updateShow = false
      }
    },
    //添加
    insert(){
      //拼接
      for (let i in this.channelLogo){
        if (this.insetForm.channel == null || this.insetForm.channel === ''){
          this.insetForm.channel = this.channelLogo[i]
        }else {
          this.insetForm.channel = this.insetForm.channel+","+this.channelLogo[i]
        }
      }
      if (this.insetForm.mediaName == null || this.insetForm.version == null){
      this.$message.error('请填写完整信息');
    }
     else {
        insert(this.insetForm).then(res=>{
          if (res>0){
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          }else {
            this.$message.error('添加失败');
          }
          this.showIf = false
          this.getList()
          //应用名称
          this.insetForm.name = null,
            //包名
            this.insetForm.pck = null,
            //版本号
            this.insetForm.version = null,
            //媒体
            this.insetForm.mediaName = null,
            //状态
            this.insetForm.state = '0',
            //二次确认
            this.insetForm.confirm = '0'
          //渠道标识数组
          this.channelLogo = []
          this.insetForm.channel = null
        })
        this.insetForm.channel = null
      }
    },
    //添加渠道
    insertChannel(){
      insertChannel(this.insertChannelForm).then(res=>{
          this.showChannelIf = false
      })
    },
    //新增框是否弹出
    insertShow(){
      if(this.showIf === false){
        this.showIf = true
      }else if (this.showIf === true){
        this.showIf = false
      }
    },
    //新增渠道弹框
    insertChannelShow(){
      if(this.showChannelIf === false){
        this.showChannelIf = true
      }else if (this.showChannelIf === true){
        this.showChannelIf = false
      }
    },
    //关闭修改窗口
    closeUpdateWindows(){
      this.updateShow = false
    },
    //搜索
    handleQuery(){
      this.getList();
    },
    /** 导出按钮操作 */
    handleExport(row) {
      this.query.id = row.id
      this.download('advertisingControl/export', {
        ...this.query
      }, `data_${new Date().getTime()}.xlsx`)
    },
    /** 全部导出按钮操作   */
    allHandleExport(row) {
      this.query.NowTime = null
      this.download('advertisingControl/export', {
        ...this.query
      }, `data_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>

<style scoped>
#pckDiv{
  overflow: hidden;
  white-space : nowrap;
  text-overflow: ellipsis;
}
.el-checkbox {
  margin-left: 5px;
  margin-right: 25px;
  width: 35px;
padding-left: 0px;
  text-align: left;
}
.el-checkbox-group {
  text-align: left;
}
.el-dialog {
  margin: 0 auto !important;
  top: 50%;
  transform: translateY(-50%);

}
.el-dialog__header{
  background: #f7f7f7;
  text-align: left;
  font-weight: 600;
}
/*鼠标悬停改变字体颜色*/
.copy:hover{
  color: #1c84c6;
}

.el-tooltip__popper{
  display: none; }
</style>
