<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item label="用户名称"
                    prop="nickName">
        <el-input v-model="queryParams.nickName"
                  placeholder="请输入用户名称"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['system:userDept:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['system:userDept:remove']">删除</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading"
              :data="userDeptList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center"></el-table-column>
      <el-table-column prop="userId"
                       width="0"
                       v-if="false"></el-table-column>
      <el-table-column label="用户账号"
                       prop="userName"
                       width="180"></el-table-column>
      <el-table-column label="用户名称"
                       prop="nickName"
                       :show-overflow-tooltip="true"
                       width="120"></el-table-column>
      <el-table-column label="可查看部门"
                       prop="deptInfo"
                       :show-overflow-tooltip="true"
                       width="600"></el-table-column>
      <el-table-column prop="deptInfos"
                       width="0"
                       v-if="false"></el-table-column>
      <el-table-column label="创建人"
                       prop="createBy"
                       :show-overflow-tooltip="true"
                       width="150"></el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:userDept:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['system:userDept:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />
    <!-- 分配角色数据权限对话框 -->
    <div v-if="open">
    </div>
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               :before-close="handleClose"
               @click.native="whetherToShow1">
      <el-form :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="用户名称" prop="userIds" style="font-size: 14px;">
          <el-cascader ref="cascaderUser" v-model="userD" :options="userDeptIds" :props="userdefaultProps" :disabled="userDeptVisible" @change="getUserDeptId" :key="isRevert" :show-all-levels="false" clearable filterable></el-cascader>
          <Jilian ref="Jilian" :isInputShow="isInputShow" :whetherItIsHidden="whetherItIsHidden" @change="refresh" @change1="refresh1" @change2="refresh2" :rowData="rowData" :action="action" @changeInputShow="refreshInputShow" :whetherToShow2="whetherToShow2" @whetherToShowFn="whetherToShowFn"></Jilian>
        </el-form-item>
        
        <el-form-item label="查看部门" prop="deptIds">
         <div class="loading1" v-if="loading2">
          <div class="loading"></div>
         </div>
          <!-- <el-cascader ref="cascaderDeptArr" v-model="deptDs" :options="deptOptions" :props="defaultProps" @change="getDeptIds" :key="isRevert" collapse-tags clearable filterable></el-cascader> -->
          <!-- <JilianDepartment ref="JilianDepartment" :rowData="rowData" :action="action"  :loading2="loading2" @changeloading2="changeloading2" :whetherItIsHidden1="whetherItIsHidden1" @change1="refresh1"></JilianDepartment> -->
          <div class="search-header" :data-placeholder="inputPlaceholder" @click="preventClose1" v-if="!loading2">
              <li v-for="(item, index) in choseList"
                 :key="index"
                 class="li-a nick-name"
                 :style="{width: item.nickName.length*14 + 14*3 + 'px',height: '18px'}"
                 >
                 <span class="name">{{ item.nickName }}</span>
                 <strong  class="li-icon" @click="del(index, item)">X</strong>
              </li>
              <!-- <input v-if="isInputShow" :selectstart="onSelectStart" :placeholder="inputPlaceholder" class="search1"/> -->
              <i class="el-icon-arrow-down arrowDown" v-if="!whetherToShow"></i>
              <i class="el-icon-arrow-up arrowUp" v-if="whetherToShow" @click.stop="preventClose2"></i>
              <!-- <i slot="suffix" v-if="isBigSearch == true" class="el-input__icon el-icon-close" @click="closeBigSearch"></i> -->
          </div>
              <!-- 组织架构 -->
          <div class="bottom card" v-show="whetherToShow && !isBigSearch" :style="{display: whetherItIsHidden1}" @click="preventClose">
            <div class="memberbox" v-loading="loadingForOrg">
              <listJilianDepartment :noDepartChoose="noDepartChoose"
              ref="list"
              :deptDs="deptDs"
              :fixed="fixed"
              :list="depaList"
              :range="setSwitchCommon"
              :deptId="deptId"
              :choseList="choseList"
              :isRadio="isRadio"
              :delNode="delNode"
              ></listJilianDepartment>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listUserDept,delUserDept,addUserDept,getCompleteInfo} from "@/api/system/userDept";
  import {getDeptInfo} from "@/api/system/dept";
  import Jilian from '@/components/Process/components/ApprovalchooseJiilan.vue'
  import JilianDepartment from '@/components/Process/components/ApprovalchooseJilianDepartment.vue'
  import eventThis from './form-item-event'
  import eventThis1 from './form-item-event1'
  import Cookies from "js-cookie";
  import listJilianDepartment from "@/components/Process/components/listJilianDepartment.vue";
  import { getServiceNode } from "@/api/system/user.js";
  import {  getsystemApi, listDepartment,selectDeptInfoTree,selectDeptInfo } from "@/api/process";
  import { mapState } from "vuex";
  export default {
    name: "Role",
    data () {
      return {
        isInputShow: true,
        boxWidth: '',
        rightDistance: '',
        inputPlaceholder: '请选择',
        rowData: {},
        whetherItIsHidden: 'block',
        whetherItIsHidden1: 'block',
        loading2:true,
        // 遮罩层
        loading: true,
        // 选中数组
        userIds: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 表格数据
        userDeptList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 菜单列表
        menuOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          nickName: undefined,
        },
        // 表单参数
        form: {
          userIds: [],
          deptIds: []
        },
        isRevert: "0",
        userdefaultProps: {
          lazy: true,   // 开启懒加载
          lazyLoad: this.lazyLoad,  // 懒加载数据格式
          children: "children",
          label: "deptName",
          value: "deptId",
          multiple: true,
          leaf: "leaf", // 需要指定叶子节点，不然显示有问题
        },
        defaultProps: {
          lazy: true,   // 开启懒加载
          lazyLoad: this.lazyLoad1,  // 懒加载数据格式
          children: "children",
          label: "deptName",
          value: "deptId",
          multiple: true,
          leaf: "leaf", // 需要指定叶子节点，不然显示有问题
        },
        userD: "",
        userDeptVisible: false,
        deptDs: [],
        // 表单校验
        rules: {
          userIds: [
            {required: true, message: "请选择用户", trigger: "change"}
          ],
          deptIds: [
            {required: true, message: "请选择查看部门", trigger: "change"}
          ]
        },
        authorizationDialog: false,
        systemType: "",
        radio: "",
        selectMenu: [],
        checkedSecMenu: [],
        checkedSecMenuLabel: [],
        multipleSelection: [],
        testList: [],
        isHasChildren: false,
        selectAll: false,
        deptTree: [],
        // 用户列表
        userDeptIds: [],
        // 可查看部门部门列表
        deptOptions: [],
        option: [
          {deptId: "0",
            deptName: "中国移动",
            leaf: false
          }
        ],
        visible: false,
        adres: "",
        action: '',
        whetherToShow: false,
        whetherToShow2: false,
        //控制设置各节点选人组织树的弹窗
        dialogVisible: false,
        isBigSearchEmpty: false,
        loadingSearchName: false,
        TabIndex: "",
        //选择范围数据
        tabList: [],
        //input
        //搜索选人
        searchValue: "",
        //控制搜索框大小，默认为小
        isBigSearch: false,
        // 数据
        //组织架构
        depaList: [],
        //组织架构中的人的username的列表
        orgPeopleList: [],
        //虚拟组织
        virtualName: [],
        corporateVirtualOrganization: [], //公司虚拟组织
        createdIt: [], //我创建的
        //已选
        choseList: [],
        //删除
        delNode: [],
        //查询
        searchName: [],
        //更新走不走接口
        update: true,
        systemGroup: [],
        loadingForOrg: false,
        loadingForVir: false
      };
    },
    props: {  
      setSwitch: {
        type: Boolean,
        default: false
      },
      /*自选--来自起草页面传递 */
      setSwitchCommon: {
        type: Boolean,
        default: false
      },
      /* 固定选人 */
      fixed: {
        type: Boolean,
        default: false
      },
      Vdata: {
        type: Array,
        default: () => []
      },
      isRadio: {
        type: Boolean,
        default: false
      },
      noDepartChoose: {
        type: Boolean,
        default: false
      }
    },
    components: {
    Jilian,
      JilianDepartment,
      listJilianDepartment
    },
    created () {
      this.getList();
    },
    computed: {
      ...mapState({
        deptId: state => state.user.deptId,
        companyId: state => state.user.companyId
      })
    },
    methods: {
      handleClose() {
        this.open = false
        eventThis.$emit("inputvalueEmpty", '')
        eventThis.$emit("isBigSearch", false)
      },
      onSelectStart(e) {
        e.preventDefault();
      },
      refreshInputShow(data) {
      // this.isInputShow = data
      },
      whetherToShowFn(data) {
        // console.log("调用了whetherToShowFn",data);
        this.whetherToShow2 = data
      },
      changeloading2(data) {
        this.loading2 = data
      },
      refresh(data) {
        this.whetherItIsHidden = data
      },
      refresh1(data) {
        this.whetherItIsHidden1 = data
      },
      refresh2(data) {
        this.whetherToShow = data
      },
      whetherToShow1() {
        eventThis.$emit("showList", [])
        eventThis1.$emit("showList1",[])
        this.whetherItIsHidden = 'none'
        this.whetherItIsHidden1 = 'none'
        this.whetherToShow2 = false 
        eventThis.$emit("inputvalueEmpty", '')
        eventThis.$emit("isBigSearch", false)
        this.whetherToShow = false
        // console.log("eventThis.$emit")
         // this.isInputShow = true
      },
      /** 查询列表 */
      getList () {
        this.loading = true;
        listUserDept(this.queryParams).then(
          (response) => {
            // console.log("response=======================",response);
            this.userDeptList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 取消按钮
      cancel() {
        this.open = false;
        eventThis.$emit("inputvalueEmpty", '')
        eventThis.$emit("isBigSearch", false)
        // this.reset();
      },
      // 表单重置
      reset () {
        this.form = {
          userIds: [],
          deptIds: []
        };
        this.clearDept();
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery () {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery () {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      getUserDeptId(e) {
        var arr = [];
        let node = this.$refs["cascaderUser"].getCheckedNodes();
        // 过滤子节点全选时被选中的父节点
        node = node.filter(option => ((option.hasChildren && !option.children[0].checked) || (!option.hasChildren)));
        if (node.length > 0) {
          for(var i = 0; i<node.length; i++) {
            arr.push(node[i].value)
          }
        }
        this.form.userIds = arr;
      },
      getDeptIds(e) {
        this.deptDs = e;
        var arr = [];
        let CheckedNodes = this.$refs["cascaderDeptArr"].getCheckedNodes();
        CheckedNodes = CheckedNodes.filter(option => !(option.parent && option.parent.checked));
        if (CheckedNodes.length > 0) {
          for(var i = 0; i<CheckedNodes.length; i++) {
            arr.push(CheckedNodes[i].value)
          }
        }
        this.form.deptIds = arr;
      },
      // 多选框选中数据
      handleSelectionChange (selection) {
        this.userIds = selection.map((item) => item.userId);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.rowData = {}
        this.loading2 = false
        this.isInputShow = true
        this.reset();
        this.userDeptVisible = false;
        this.action = 1;
        this.open = true;
        this.title = "添加用户查看部门";
      },
      async lazyLoad(node, resolve) {
        let level = node.level;
        let res;
        if (level == 0) {
          res = await getDeptInfo({
            isNeedUser: 1,
          })
          if (res.data.children) {
            resolve(res.data.children);
          } else {
            resolve([]);
          }
        } else {
          deptId = node.data.deptId
          res = await getDeptInfo({
            isNeedUser: 1,
            deptId: deptId
          });
          resolve((res.data.children.length != 0) ? res.data.children[0].children : [])
        }
      },

      /**
       * 1.回显数据的时候除了给v-model绑定的属性赋值以外，还要提供一个包含需要渲染的级联数据的options模板
       * 2.resolve(nodes) 返回的nodes为下一级要渲染的list列表数据，如果是回显已提供了options渲染模板但是不完整，则需要在后面动态加载options
       */
    async lazyLoad1(node, resolve) {
        // console.log("node=====================",node);
        let level = node.level;
        if (level == 0) {
          if(this.deptDs.length > 0) {
            this.formatting();
          } else {
            // 不存在就默认加载
            resolve(this.option);
          }
        } else {
          let list = this.deptDs;
          if(!node.data.children) {
            let res = await getDeptInfo({
              deptId: node.data.deptId
            });
            resolve((res.data.children.length != 0) ? res.data.children[0].children : [])
          } else {
            resolve([]);
          }
          setTimeout(() => {
            this.deptDs = [...new Set([...this.deptDs, ...list])];// 合并并且去重
          },250);
        }
      },
      async formatting() {
        // 根据 this.deptDs 动态加载options
        let parentsIds = [];
        this.deptDs.forEach(el => {
          el.forEach((a,index) => {
            if(index == el.length -1) {
              return
            }
            parentsIds.push(a);
          })
        });
        parentsIds = [...new Set(parentsIds)];
        for(let sitem of parentsIds) {
          await this.getOther(sitem);
        }
      },
      // 递归判断
      findItem(list, arr, id) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].deptId === id) {
            list[i].children = arr;
            return list;
          }
          if (list[i].children) {
            this.findItem(list[i].children, arr, id);
          }
        }
        return list;
      },

      async getChild(deptId) {
        let r = await getDeptInfo({deptId:deptId});
        if(deptId == -1) {
          return r.data.children
        } else {
          return r.data.children[0].children;
        }
      },
      //获取子集数据
      async getOther(value) {
        let arr = [];
        await getDeptInfo({deptId:value}).then((res) => {
          if(res.data.children[0].leaf == false) {
            (res.data.children[0].children).forEach(item => {
              arr.push({
                deptId: item.deptId,
                deptName: item.deptName,
                leaf: item.leaf
              });
            });
            this.option = this.findItem(this.option, arr, value);
            setTimeout(() => {
              this.deptOptions = this.option;
              this.loading2 = false
            }, 2000);
          }
        });
      },

      /** 修改按钮操作 */
      async handleUpdate(row) {
        // eventThis1.$emit("deptAnchor1",this.choseList)
        this.rowData = {}
        eventThis.$emit("isBigSearch", false)
        if (this.rowData) {
          this.loading2 = false;
        }
        this.isInputShow = false

        // var arr = []
        // this.deptOptions = [];
        await getCompleteInfo({
          userId: row.userId,
          deptIds: row.deptId
        }).then((res) => {
          // this.userDeptIds = [];
          // if(res.data.user) {
          //   this.userD = res.data.user
          // }
          if (res.data.dept) {
            this.deptDs = res.data.dept
            console.log("deptDs",this.deptDs);
            // if(this.deptDs.length > 0) {
            //   this.formatting();
            // }
          }
        })
        // this.userDeptVisible = true;
        // arr.push(row.userId);
        // this.form.userIds = arr;
        
        this.action = 2;
        this.title = "修改用户查看部门";
        this.open = true;
        console.log("row=======================", row);
        this.rowData = row
      },
      getDefaultData(value, result) {
        var data = [...value];
        var addArray = []
        for (var i = 0; i < data.length; i++) {
          if (null === result || result.length === 0) {
            return addArray;
          }
          let itemAdd = []
          if (result.indexOf(data[i].deptId) < 0) {
            itemAdd.push(data[i].deptId)
            if (data[i].children) {
              cartwheel(itemAdd, data[i].children)
            } else {
              itemAdd = []
              continue
            }
          } else {
            itemAdd.push(data[i].deptId);
            if(data[i].children) {
              getChild(addArray, itemAdd, data[i].children);
            } else {
              addArray.push(data[i].deptId);
              result.splice(result.indexOf(data[i].deptId), 1)
            }
          }
        }

        function cartwheel(itemAdd,data){
          for(var i=0;i<data.length;i++){
            if(itemAdd.indexOf(data[i].deptId)>-1 || result.length===0){
              return
            }
            itemAdd.push(data[i].deptId)
            if(result.indexOf(data[i].deptId)<0){
              if(data[i].children){
                cartwheel(itemAdd,data[i].children)
              }else{
                itemAdd.splice(itemAdd.length-1,1)
                continue
              }
            }else{
              var copy=JSON.stringify(itemAdd)
              if(data[i].children) {
                getChild( addArray, itemAdd, data[i].children);
              } else {
                addArray.push(JSON.parse(copy))
              }
              itemAdd.splice(itemAdd.length-1,1)
              result.splice(result.indexOf(data[i].deptId),1)
              continue
            }
          }
          itemAdd.splice(itemAdd.length-1,1)
        }

        function getChild(addArray, item, data) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].children) {
              item.push(data[i].deptId);
              getChild(addArray, item, data[i].children);
              item.splice(item.length - 1, 1)
            } else {
              item.push(data[i].deptId);
              var d = JSON.stringify(item);
              addArray.push(JSON.parse(d));
              item.splice(item.length - 1, 1)
            }
          }
        }
        return addArray
      },
      /** 提交按钮 */
      submit: function () {
        if (this.$refs.Jilian.choseListFn() != undefined && this.form.deptIds != undefined) {
          var label = "新增成功";
          if (this.action === 2) {
            label = "修改成功";
          }
          // console.log("this.form==================",this.form);
          addUserDept({
            userIds: this.$refs.Jilian.choseListFn(),
            deptIds: this.choseListFn1(),
          }).then((response) => {
            if (response.code === 200) {
              this.msgSuccess(label);
              this.open = false;
              this.getList();
              this.clearDept();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      },
      /** 删除按钮操作 */
      handleDelete (row) {
        var i = [];
        if(row.userId) {
          i.push(row.userId);
        } else {
          i = this.userIds;
        }
        this.$confirm(
          '是否确认删除当前数据项?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(function () {
          return delUserDept(i);
        })
          .then((res) => {
            if (res.code === 200) {
              this.getList();
              this.msgSuccess("删除成功");
            } else {
              this.msgError(res.msg);
            }
          })
          .catch(function () { });
      },
      clearDept(e) {
        this.deptOptions = [];
        this.deptDs = [];
        this.userDeptIds = [];
        this.userD = [];
        ++this.isRevert;
      },
      choseListFn1() {
        let arr = []
        this.choseList.forEach(item => {
          arr.push(item.deptId)
        })
        return arr
      },
      preventClose(event) {
          // 阻止点击事件向上冒泡
        event.stopPropagation()
      },
      async preventClose1(event) {
        // 阻止点击事件向上冒泡
        event.stopPropagation()
        eventThis.$emit("inputvalueEmpty", '')
        this.whetherToShow2 = false
        this.whetherItIsHidden = 'none'
        eventThis.$emit("showList", [])
        eventThis1.$emit("showList1", [])
        res = await getDeptInfo({})
        this.depaList = res.data.children
        this.whetherToShow = true
        this.whetherItIsHidden1 = 'block'
        // this.whetherItIsHidden1 = 'block'
      },
      preventClose2(event) {
        this.whetherToShow = false
        this.whetherItIsHidden1 = 'none'
        // 阻止点击事件向上冒泡
        event.stopPropagation()
      },
      //关闭弹窗
      close () {
        this.depaList = [];
        this.$emit("close");
        this.dialogVisible = false;
      },
      switchTab (type, update = true) {
        this.TabIndex = type;
        if (!update) return;
        this.update = false;
      },
      // 初始范围选人数据
      createdData () {
        Array.isArray(this.Vdata) &&
        this.Vdata.length > 0 &&
        this.Vdata.forEach(item => {
          if (item.visibleRange == 1) {
            //个人
            this.createdIt.push(item);
          } else {
            //公司
            this.corporateVirtualOrganization.push(item);
          }
        });
      },
      //深度遍历组织树，将userChildren的值转移到children里面,将树结构进行调整
      deepTraverse (data) {
        data.id = data.userId ? "u" + data.userId : "d" + data.deptId;
        data.label = data.nickName ? data.nickName : data.deptName;
        if (data.userChildren && data.children) {
          data.children = data.children.concat(data.userChildren);
          delete data.userChildren;
        }
        if (data.children) {
          data.childNodes = JSON.parse(JSON.stringify(data.children));
          delete data.children;
        }

        if (data.childNodes && data.childNodes.length) {
          data.childNodes.forEach(item => {
            this.deepTraverse(item);
          });
        }
        return data;
      },
      //递归将组织树中的人转换为值为username的数组
      dfsAndTransferArray (depaList) {
        let timArray = [];
        if (Array.isArray(depaList)) {
          depaList.forEach((item, index) => {
            if (item.userName) {
              timArray.push(item.userName)
            }
            else if (Array.isArray(item.childNodes) && item.childNodes.length) {
              timArray = timArray.concat(this.dfsAndTransferArray(item.childNodes))
            }
          })

        }

        return timArray;
      },
      /* 删除显示框里的 */
      del (i, o) {
        if (this.isBigSearch === true) {
          for (let k = 0; k < this.searchName.length; k++) {
            if (this.searchName[k].userId === o.userId) {
              this.searchName[k].isChoose = false;
            }
          }
        } else {
          this.choseList[i].isChoose = false;
        }
        this.delNode = this.choseList.splice(i, 1);
      },
      /* 组织架构数据树绘制 */
      findNode (data) {
        return data.filter(item => {
          if (item.isChoose) {
            item.isChoose = false;
            return item;
          } else if (!item.isChoose && item.indeterminacy && item.childNodes) {
            item.indeterminacy = false;
            item.childNodes = this.findNode(item.childNodes);
            return item;
          } else {
            return;
          }
        });
      },
      // handleResize() {
      //    this.$forceUpdate(); // 触发 updated() 钩子函数
      // },
  },
  mounted() {
    // window.addEventListener('resize', this.handleResize);
      if (this.action == 2) {
        const deptInfoStr = this.rowData.deptInfo
        const deptIdStr = this.rowData.deptId 
        const ParentIdStr = this.rowData.parentId 
        const deptInfoArr = deptInfoStr.split(",");
        const deptIdArr = deptIdStr.split(",");
        const ParentIdArr = ParentIdStr.split(",");
        for(let i = 0; i < deptIdArr.length; i++) {
           const obj = {};
           obj.nickName = deptInfoArr[i];
           obj.deptId = deptIdArr[i];
           obj.parentId = ParentIdArr[i];
           this.choseList.push(obj);
        }
        console.log("mounted",this.choseList);
        // eventThis1.$emit("deptAnchor1",this.choseList)
        // this.$emit("changeloading2", false)
        this.loading2 = false
      } else if (this.action == 1) {
        this.choseList = []
      }
  },
  watch: {
      rowData: {
        handler(newVal, oldVal) {
          this.choseList = []
          console.log("监听到了rowData newVal 部门===================", newVal);
          if (this.action == 2) {
            const deptInfoStr = this.rowData.deptInfo
           const deptIdStr = this.rowData.deptId 
           const ParentIdStr = this.rowData.parentId 
           const deptInfoArr = deptInfoStr.split(",");
           const deptIdArr = deptIdStr.split(",");
           const ParentIdArr = ParentIdStr.split(",");
        for(let i = 0; i < deptIdArr.length; i++) {
           const obj = {};
           obj.nickName = deptInfoArr[i];
           obj.deptId = deptIdArr[i];
           obj.parentId = ParentIdArr[i];
           this.choseList.push(obj);
        }
            // eventThis1.$emit("deptAnchor1",this.choseList)
            // this.$emit("changeloading2",false)
            this.loading2 = false
          } else if (this.action == 1) {
            this.choseList = []
          }
          console.log("监听到了rowData this.choseList 部门===================", this.choseList);
        },
        deep: true
    },
    choseList: {
        handler(newVal, oldVal) {
          console.log("监听到了choseList",this.choseList);
          if (this.choseList.length > 0) {
            console.log("当this.choseList存在时",this.choseList);
            this.inputPlaceholder = ''
          } else {
            console.log("当this.choseList不存在时",this.choseList);
            this.inputPlaceholder = '请选择'
          }
        },
        deep: true
      }, 
    },
  };
</script>
<style lang="scss" scoped>
  .menu_table {
    width: 601px;
    height: 647px;
    border-collapse: collapse;
    //background: #D8D8D8;
  }
  .loading1 {
    cursor: not-allowed;
    border-radius: 4px;
    width: 219px;
    height: 37px;
    border: 1px solid #DCDFE6;
  }
  .loading {
    margin-top: 7px;
    margin-left: 5px;
    width: 23px;
    height: 23px;
    border: 3px solid #DCDFE6;
    border-top-color: transparent;
    border-radius: 100%;
    animation: circle infinite 0.75s linear;
  }

// 转转转动画
  @keyframes circle {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .menu_border {
    border: 1px solid #d8d8d8;
  }

  .childrenClass {
    width: 12px;
    height: 12px;
    border-radius: 1px;
  }
  .fatherClass {
    width: 14px;
    display: inline-block;
    height: 14px;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
  }
  .fatherClasschecked {
    background-color: #1890ff;
    border-color: #1890ff;
    position: relative;

    div {
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(1);
      width: 4px;
      transform-origin: center;
    }
  }
  .fatherClassdetermined {
    position: relative;
    background: #fff !important;
    em {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #1890ff;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    div {
      display: none !important;
    }
  }
  .menu_text {
    height: 19px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #666666;
    line-height: 19px;
  }
  .menu_first {
    padding: 0px 21px;
  }
  .system_select {
    width: 280px;
    height: 40px;
    border-radius: 2px;
    border: 0px solid #e2e3e7;
  }
  .popupContent {
    max-height: 550px;
    overflow-y: auto;
    overflow-x: hidden;
    .dialog-footer {
      text-align: right;
      width: 500px;
    }
  }
  .el-dialog .el-dialog__header {
    text-align: left;
    border-bottom: 1px solid #e6e6e6;
    padding: 15px;
  }
  >>> .el-dialog .el-dialog__body {
    text-align: left;

    border-top: 2px solid #e6e6e6;
    padding: 15px 20px 19px;
    border-bottom: 2px solid #e6e6e6;
  }
  >>> .el-dialog .el-dialog__footer {
    padding: 15px 20px 15px 0;
  }
  .optionalTitle {
    font-weight: 700;
    margin-bottom: 10px;
  }
  .card {
    height: 198px;
    position: relative;
    position: fixed;
    z-index: 888;
    border-radius: 4px;
    margin-top: 10px;
    font-size: 14px;
    background: #fff;
    border: solid 1px #dfe4ed;
    box-shadow: 0 2px 0px 0 rgba(223,228,237, 10%);
    line-height: 1.15;
    animation: slide-down 0.1s ease-in-out forwards;
  }
  @keyframes slide-down {
    0% {
    opacity: 0;
    transform: translateY(-10px);
    }
    100% {
    opacity: 1;
    transform: translateY(0);
    }
  }
  .card::before{
  content: '';
  width: 0;
  height: 0;
  border: 5px solid;
  position: absolute;
  top: -10px;
  left: 30px;
  border-color:  transparent transparent #dfe4ed;
}
.card::after{
  content: '';
  width: 0;
  height: 0;
  border: 5px solid;
  position: absolute;
  top: -9px;
  left: 30px;
  border-color:  transparent transparent #fff;
}
  .top {
    padding: 10px 0 10px 20px;
    margin-bottom: 10px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
  }
  .search-header {
      display: flex; 
      flex-wrap: wrap; 
      width: 219px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      font-size: 12px;
      max-height: 200px; 
      overflow-y: auto;
      min-height: 38px;
      position: relative;
      .nick-name {
        background-color: rgba(240,242,245, 1);
      }
      .li-a {
        display: flex;
        align-items: center;
        width: 185px !important;
        height: 30px;
        color: #909399;
        position: relative;
        line-height: 30px;
        padding: 0 8px;
        border-radius: 2px;
        margin: 2px 0 2px 6px;
          .name {
             display: inline-block;
             width: 84px;
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
             margin-left: 6px;
             vertical-align: middle;
             margin-top: 3px;
          }
          .li-icon {
             position: absolute;
             right: 10px;
             top: -4px;
             cursor: pointer;
             margin-bottom: 3px;
          }
          .li-a:nth-child(5n) {
            margin: 0 0 10px 0;
          }
      }
      .search1 {
        height: 30px;
        margin-left: 10px;
        border: 1px solid white;
        font-size: 14px;
        width: 170px;
      }
      .search1::placeholder {
        color: #C6C9D1;      
      }
      .arrowDown {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 8px;
      }
      .arrowUp {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 8px;
      }
      >>> .el-input__icon {
        position: absolute;
        line-height: 24px;
        cursor: pointer;
        right: 14px;
      }
      .el-input__icon:after {
          content: '';
          height: 100%;
          width: 0;
          display: inline-block;
          vertical-align: middle;
      }
    }
    .search-header::before {
        content: attr(data-placeholder);
        position: absolute;
        top: 0;
        left: 0;
        color: #C6C9D1;
        // height: 30px;
        margin-left: 10px;
        // border: 1px solid white;
        font-size: 14px;
        width: 170px;
     }

.search-header:focus::before {
display: none;
}

  .memberbox {
    margin-top: 0px !important;
    height: 303px;
    text-align: left;
    overflow: hidden;
  }
  .li-b {
    display: inline-block;
    width: 160px;
    height: 33px;
    background: rgba(223, 237, 255, 1);
    line-height: 33px;
    margin-bottom: 5px;
  }
  .search-page {
    padding: 12px 20px;
    text-align: left;
    height: 100%;
    overflow: auto;
    .search-info {
      list-style: none;
      width: 100%;
      height: 48px;
      font-size: 12px;
      margin-bottom: 10px;
      > p {
        margin: 0 0 10px 0;

        height: 18px;
        line-height: 18px;

        .tags {
          display: inline-block;
          padding: 0 7px;
          text-align: center;
          vertical-align: middle;
          border: 1px solid #dcdcdc;
          border-radius: 2px;
          margin-left: 10px;
        }
      }
    }
  }
</style>
