<template>
  <div>
    <div :class="[{'search-header': isInputShow},{'search-header1' : !isInputShow}]" @click.stop="preventClose1">
      <li v-for="(item, index) in choseList"
         :key="index"
         class="li-a nick-name"
         :style="{width: item.nickName.length*14 + 14*3 + 'px',height: '18px'}"
         >
         <span class="name">{{ item.nickName }}</span>
         <strong  class="li-icon" v-if="isInputShow" @click="del(index, item)">X</strong>
      </li>
      <input v-model="searchValue" v-if="isInputShow" :placeholder="inputPlaceholder" @input="searchApi" class="search1"/>
      <i class="el-icon-arrow-down arrowDown" v-if="!whetherToShow2 && isInputShow"></i>
      <i class="el-icon-arrow-up arrowUp" v-if="whetherToShow2" @click="preventClose2"></i>
      <!-- <i slot="suffix" v-if="isBigSearch == true" class="el-input__icon el-icon-close" @click="closeBigSearch"></i> -->
    </div>
      <!-- 组织架构 -->
      <div class="bottom card" v-show="whetherToShow2 && !isBigSearch" :style="{display: whetherItIsHidden}" @click="preventClose">
        <div class="memberbox" v-loading="loadingForOrg">
          <listJilian :noDepartChoose="noDepartChoose"
          :department="department"
          :Node="Node"
          :fixed="fixed"
          :list="depaList"
          :scopeSet="scopeSet"
          :range="setSwitchCommon"
          :deptId="deptId"
          :choseList="choseList"
          :isRadio="isRadio"
          :delNode="delNode"
          ref="list"></listJilian>
        </div>
      </div>
       <!-- 搜索 -->
      <div class="bottom card2" v-if="isBigSearch && !isBigSearchEmpty" :style="{display: whetherItIsHidden}">
        <div class="search-page" v-loading="loadingSearchName">
          <li v-for="(item, index) in searchName"
              :key="index"
              class="search-info">
            <p>
              <span v-if="item.disabled === 'true'"
                    style="pointer-events:none;">
                <svg-icon icon-class="chose"
                          v-if="item.isChoose "
                          style="background-color:#ccc" />
                <svg-icon icon-class="Nochose"
                          v-else-if="!item.isChoose"
                          style="background-color:#ccc" />
              </span>
              <span @click.stop="addChoseList(item)"
                    v-else>

                <svg-icon icon-class="chose"
                          v-if="item.isChoose"
                          style="background-color:inherit" />
                <svg-icon icon-class="Nochose"
                          v-else
                          style="background-color:inherit" />

              </span>
              {{ item.nickName }} 
            </p>
            <p style="color:#999">
              {{ item.deptName }}
              <span v-if="index != searchName.length - 1">/</span>
            </p>
          </li>
        </div>
      </div>
      <!-- 暂无数据 -->
      <div class="bottom card2"  v-if="isBigSearchEmpty" :style="{display: whetherItIsHidden}">
          <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);;">
             暂无数据
          </div>
      </div>
      <div slot="footer">
      </div>
  </div>
</template>

<script>
  // 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
  // 例如：import 《组件名称》 from '《组件路径》'
  import listJilian from "./listJilian.vue";
  import ListVirtual from "./list_virtual.vue";
  import VirtualList from "./VirtualList";
  import { getDeptInfo } from "@/api/system/dept";
  import { searchNameApiKazuizhi,  listDepartment } from "@/api/process";
  import { mapState } from "vuex";
  import eventThis from '@/views/system/userDept/form-item-event.js'
  function debounce (func, wait = 300) {
    //可以放入项目中的公共方法中进行调用
    let timeout;
    return function (event) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.call(this, event);
      }, wait);
    };
  }
  export default {
    // import引入的组件需要注入到对象中才能使用
    components: { listJilian, ListVirtual, VirtualList },
    props: {
      whetherToShow2: {
        type: Boolean,
        default: false
      },
      isInputShow: {
        type: Boolean,
        default: false
      },
      rowData: {
        type: Object,
        default: {}
      }, 
      action: {
        type: Number,
        default: ""
      },
      whetherItIsHidden: {
        type: String,
        default: 'block'
      },   
      //弹窗提示标题
      title: {
        type: String,
        default: "审批人"
      },
      //需要选人页面回显已选人数据
      dataList: {
        type: Array,
        default: () => {
          return [];
        }
      },
      //自选范围数据
      scopeSet: {
        type: Array,
        default: () => {
          return [];
        }
      },
      mode: [String, Array],
      /* 发起人自选开关*/
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
      //没用
      Odata: {
        type: Array,
        default: () => []
      },
      Vdata: {
        type: Array,
        default: () => []
      },
      seek: {
        type: String,
        default: ""
      },
      //组织树 部门
      department: {
        type: Boolean,
        default: false
      },
      isRadio: {
        type: Boolean,
        default: false
      },
      //需要被置灰不可选的人员
      memberSetShenpi: {
        type: Array,
        default: () => {
          return [];
        }
      },
      noDepartChoose: {
        type: Boolean,
        default: false
      }
    },
    data () {
      // 这里存放数据
      return {
        depaList: [],
        inputPlaceholder: '请选择',
        //控制设置各节点选人组织树的弹窗
        dialogVisible: false,
        isBigSearchEmpty: false,
        loadingSearchName: false,
        TabIndex: "",
        //input
        //搜索选人
        searchValue: "",
        //控制搜索框大小，默认为小
        isBigSearch: false,
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
        //控制虚拟组织管理弹窗的显示
        isVirtualList: false,
        //更新走不走接口
        update: true,
        Node: [],
        systemGroup: [],
        loadingForOrg: false,
        loadingForVir: false
      };
    },
    // 监听属性 类似于data概念
    computed: {
      ...mapState({
        deptId: state => state.user.deptId,
        companyId: state => state.user.companyId
      })
    },
    // 监控data中的数据变化
    watch: {
      //监听当前审批人数据实时更新
      memberSetShenpi: {
        handler (newVal, oldVal) {
          this.memberSetShenpi = newVal;
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
      rowData: {
        handler(newVal, oldVal) {
          console.log("监听到了人==============================",newVal);
          if (this.action == 2) {
            this.choseList = [{
                          "userName": newVal.userName,
                          "userId": newVal.userId,
                          "deptId": `${newVal.userId}`,
                          "nickName": newVal.nickName
            }]
            this.$emit("changeloading2",false) 
          } else if (this.action == 1) {
            this.choseList = []
          }
        },
        deep: true
      },
  },
  mounted() {
    console.log("mounted 人",this.rowData);
    if (this.action == 2) {
      this.choseList = [{
                    "userName": this.rowData.userName,
                    "userId": this.rowData.userId,
                    "deptId": `${this.rowData.userId}`,
                    "nickName": this.rowData.nickName
                 }]
      this.$emit("changeloading2",false)               
    } else if (this.action == 1) {
      this.choseList = []
      eventThis.$on("inputvalueEmpty", val => {
        console.log("触发了inputvalueEmpty",val);
        this.searchValue = val
      })
      eventThis.$on("isBigSearch", val => {
        console.log("触发了isBigSearch",val);
        this.isBigSearch = val
      })
    }
  },
  methods: {
    choseListFn() {
      let arr = []
      this.choseList.forEach(item => {
        arr.push(item.userId.toString())
      })
      console.log("arr=====================",arr);
      return arr
    },
    preventClose(event) {
        // 阻止点击事件向上冒泡
      event.stopPropagation()
    },
    async preventClose1(event) {
      if (!this.searchValue) {
        this.isBigSearch = false
      }
      if (this.action == 1) {
        this.$emit('change1', 'none')
        this.$emit('change2', false)
        res = await getDeptInfo({
          isNeedUser: 1,
        })
        this.depaList = res.data.children
        this.$emit("whetherToShowFn",true)
        this.$emit("changeInputShow",false)
        this.$emit('change', 'block')
        // console.log(this.depaList,"this.depaList");
        // this.$emit('change', 'block')
        // 阻止点击事件向上冒泡
        // event.stopPropagation()
      }
    },
      preventClose2(event) {
        this.$emit("whetherToShowFn",false)
        this.$emit('change', 'none')
        // 阻止点击事件向上冒泡
        event.stopPropagation()
      },
      //关闭弹窗
      close () {
        this.depaList = [];
        this.$emit("close");
        this.dialogVisible = false;
      },
      closeVirLi (e) {
        this.isVirtualList = false;
        /* 虚拟组织添加完之后的查询 */
        if (e) {
          this.getsystem();
        }
      },

      switchTab (type, update = true) {
        this.TabIndex = type;
        if (!update) return;
        if (type === "virtual") {
          this.getsystem();
        }
        this.update = false;
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
      /* 关闭长搜索 */
      closeBigSearch () {
        this.isBigSearch = false;
        this.searchValue = "";
        this.searchName = [];
      },
      /* 搜索接口 */
      searchTimeOut(e) {
        this.isBigSearchEmpty = false
        this.loadingSearchName = true
        if (this.searchValue === "") {
          this.$emit("whetherToShowFn",true)
          this.isBigSearch = false;
          return 
        }
        searchNameApiKazuizhi(this.searchValue).then(res => {
          if (res.code === 200 && res.msg ==  "查询成功") {
            console.log("进来了200");
            this.searchName = res.data;
            this.loadingSearchName = false
            this.isBigSearchEmpty = false
          } else {
            this.searchName = []
            this.loadingSearchName = false
            this.isBigSearchEmpty = true;
          }
        });
      },
      /* 防抖 */
      searchApi: debounce(function () {
        this.isBigSearch = true
        this.searchTimeOut();
      }),
      /* 搜索人之后的操作 忘了当时的逻辑*/
      //添加已选人
      addChoseList (item) {
        console.log(item);
        if (!item.isChoose) {
          item.isChoose = !item.isChoose;
          this.choseList.push(item);
          let el = this.choseList.find((item1, index) => {
            if (
              item1.userId &&
              item1.deptId === item.deptId &&
              item1.userId != item.userId
            ) {
              return item1;
            }
          });
          if (el != undefined) {
            this.$refs.list.upchecked(el.index, {
              type: "searchT",
              data: item
            });
          } else {
            this.$refs.list.searchSync(item);
          }
        } else {
          item.isChoose = !item.isChoose;
          this.choseList.filter((item1, index, arr) => {
            if (item1.userId && item1.userId === item.userId) {
              arr.splice(index, 1);
            } else if (!item1.userId && item1.deptId === item.deptId) {
              this.delNode.splice(0, 1, arr[index]);
              arr.splice(index, 1);
              listDepartment({ deptId: item.deptId }).then((res) => {
                if (res.code === 200) {
                  for (var i in res.data.users) {
                    if (res.data.users[i].userId === item.userId) {
                      continue
                    } else {
                      arr.push(res.data.users[i])
                    }
                  }

                  this.$refs.list.updateShowList(arr);
                }
              })
            }

          });

        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  //@import url(); 引入公共css类
  >>> .el-dialog .el-dialog__header {
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
.card2 {
    width: 178px;
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
  .card2::before{
  content: '';
  width: 0;
  height: 0;
  border: 5px solid;
  position: absolute;
  top: -10px;
  left: 30px;
  border-color:  transparent transparent #dfe4ed;
}
.card2::after{
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
      display: flex;
      align-items: center;
      .nick-name {
        background-color: rgba(240,242,245, 1);
      }
      .li-a {
        display: flex;
        align-items: center;
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
    .search-header1 {
      user-select: none;
      cursor: not-allowed;
      display: flex; 
      flex-wrap: wrap; 
      width: 219px;
      // height: 37px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      font-size: 12px;
      max-height: 200px; 
      overflow-y: auto;
      min-height: 38px;
      background-color: #F9F9F9;
      position: relative;
      .li-a {
        display: flex;
        align-items: center;
        height: 30px;
        color: #909399;
        margin: 0 10px 10px 0;
        position: relative;
        line-height: 30px;
        padding: 0 8px;
        border-radius: 2px;
        position: absolute; top: 50%; transform: translateY(-50%);
        color: #333333;
          .name {
             display: inline-block;
             width: 84px;
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
             margin-left: 6px;
             vertical-align: middle;
          }
          .li-icon {
             position: absolute;
             right: 10px;
             top: 0px;
          }
          .li-a:nth-child(5n) {
            margin: 0 0 10px 0;
          }
      }
      .search1 {
        height: 30px;
        margin-left: 20px;
        border: 1px solid white;
        width: 170px;
      }  
      >>> .el-input__icon {
        line-height: 24px;
        cursor: pointer;
      }
      .el-input__icon:after {
          content: '';
          height: 100%;
          width: 0;
          display: inline-block;
          vertical-align: middle;
      }
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
