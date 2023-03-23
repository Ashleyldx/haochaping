<!-- 我的页面 -->
<template>
  <div :class="horizontal ? 'list-horizontal' : 'base'">
    <div class="title"
         v-if="$slots.header">
      <div>
        <slot name="header"></slot>
      </div>
      <div>
        <slot name="eventment"></slot>
      </div>
    </div>

    <div class="wrap" :style="{'max-width': distance1 + 'px'}" ref="box">
      <ul v-for="(item, index) in showList"
          :key="index"
          style="height: 198px;width: 178px;padding-top: 5px;flex-shrink: 0;"
          :id="'ul' + index"
          ref="ul">
        <li v-for="(item1, index1) in item.child"
            :key="index1"
            @click="addUl(item1, index, index1)"
            class="li-b"
            ref="li">
          <span @click.stop="
              addUl(item1, index, index1);
              debouncechoose(item1, item1.isChoose, index);
            "
                v-if="
              ((!isRadio || (isRadio && item1.userName)) && item1.parentId != 0) && (!noDepartChoose || (item1.userName) )
            "
                :class="{
              nonePointerCss: item1.disabled == 'true',
              autoPointerCss: item1.disabled != 'true',
            }">
            <svg-icon icon-class="chose"
                      :class="{
                cccBackGroundCss: item1.disabled == 'true',
                inheritBackGroundCss: item1.disabled != 'true',
              }"
                      v-if="item1.isChoose" />
            <svg-icon icon-class="Nochose"
                      :class="{
                cccBackGroundCss: item1.disabled == 'true',
                inheritBackGroundCss: item1.disabled != 'true',
              }"
                      v-else />
          </span>
          <span>
            <span v-if="item1.nickName && item1.groupList == null">{{ item1.nickName }}
            </span>
            <span v-else-if="item1.groupName">{{ item1.groupName }}</span>
            <span v-else-if="item1.deptName">{{ item1.deptName }}<span class="loading" v-if="loading1 && loadingindex == item1"></span></span>
            
          </span>
        </li>
      </ul>
    </div>
    <CM-dialog ref="cmDialog"
               :popoverOption="dialogOption"
               :showModalconfirm="showDialog"
               @cancelButton="dialogCancel"
               @saveButton="dialogOk">
      <span slot="content">您确认要选择"
        <strong>{{ confirmText }}</strong>"吗?</span>
    </CM-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》'
import { getDeptInfo } from "@/api/system/dept";
import { MemberChoice } from "./list";
import CMDialog from "@/components/DiaLog";
import { mapState } from "vuex";
import eventThis from '@/views/system/userDept/form-item-event.js'
//防抖
function debounce (func, wait = 300) {
  //可以放入项目中的公共方法中进行调用

  let timeout;
  return function (event) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.call(this, ...arguments);
    }, wait);
  };
}
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { CMDialog },
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //已选中的成员
    choseList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //删除
    delNode: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //动态样式
    horizontal: {
      type: Boolean,
      default: false,
    },
    //数据自己去打印
    Node: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //固定选人暂时没用
    fixed: {
      type: Boolean,
      default: false,
    },
    Vdata: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //部门
    department: {
      type: Boolean,
      default: false,
    },
    // isRadio: {
    //   type: Boolean,
    //   default: false,
    // },
    deptId: {
      type: Number | String,
      default: 0,
    },
    //自选范围,取消选中向上--全选,删除，无用
    range: {
      type: Boolean,
      default: false
    },
    noDepartChoose: {
      type: Boolean,
      default: false
    },
    //自选范围数据
    scopeSet: {
      type: Array,
      default: () => {
        return [];
      }
    },
    transferArr: {
      type: Array,
      default: () => {
        return [];
      }
    },
    transferArr1: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  computed: {
      ...mapState({
        userId: state => state.user.userId,
      }),
    },
  data () {
    // 这里存放数据
    return {
      maxLength: 0,
      // distance: '',
      distance1: '',
      isRadio: true,
      deptAnchor1: [],
      loading1: false,
      //组织树
      treeList: [],
      //展示到页面上的List
      showList: [{ child: [] }, { child: [] }],
      openList: [],
      listDelNode: [],
      confirmText: "",
      showDialog: false, //控制勾选我的公司/部门弹框确认
      //勾选我的公司/部门确认温馨提示弹出框
      dialogOption: {
        // width: "20%",
        title: "温馨提示:",
        showClose: true,
        showOkBtn: true,
        showCancelBtn: true,
        okBtn: "确认",
        cancelBtn: "取消",
      },
      // choseList: [],
      departObj: {},
    };
  },
  // 监控data中的数据变化
  watch: {
    delNode: {
      handler (n) {
        this.listDelNode = n;
      },
      immediate: true,
      deep: true,
    },
    listDelNode: {
      immediate: true,
      deep: true,
      handler(n) {
        if (!n.length) {
          for (var i = 0; i < this.showList.length; i++) {
            this.showList[i].child = this.showList[i].child.map(
              (item, index) => {
                this.checked(i, false, item);
                return item;
              }
            );
          }
          return;
        }
        for (var i = 0; i < this.showList.length; i++) {
          this.showList[i].child = this.showList[i].child.map((item, index) => {
            if (n[0].userId) {
              if (item.userId == n[0].userId) {
                item.isChoose = false;
              }
            } else if (!n[0].userId && n[0].deptId) {
              if (item.deptId == n[0].deptId) {
                item.isChoose = false;
                this.checked(i, false, item);
              }
            } else if (n[0].groupId) {
              if (item.groupId == n[0].groupId) {
                item.isChoose = false;
                this.checked(i, false, item);
              }
            }
            return item;
          });
        }
      },
    },
    list: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (this.scopeSet.length > 0) {
          if (newVal.length == 0) return;
          this.treeList.length = 0;
          this.treeList.push(...newVal);
          this.showList.splice(0);
          this.openList[0] = 0;
          this.showList.push({
            child: MemberChoice.createAddisChoose(this.treeList, this.choseList),
          });
          this.showList.push({
            child: MemberChoice.createAddisChoose(
              this.treeList[0].childNodes,
              this.choseList
            ),
          });
          for (var i = 0; i < this.treeList[0].childNodes.length; i++) {
            if (this.treeList[0].childNodes[i].deptId === this.deptId) {
              this.openList[1] = i;  //自动识别当前登录用户
              break;
            }
          }
          if (this.openList[1] != undefined) {
            this.showList.push({
              child: MemberChoice.createAddisChoose(
                this.treeList[0].childNodes[this.openList[1]].childNodes,
                this.choseList
              ),
            });
            if (
              document.getElementById("ul1") &&
              document.getElementById("ul1").getElementsByClassName("open")[0]
            ) {
              document
                .getElementById("ul1")
                .getElementsByClassName("open")[0]
                .scrollIntoView();
            }
        }
        } else {
          if (newVal.length == 0) return;
          this.treeList.length = 0;
          this.treeList.push(...newVal);
          this.showList.splice(0);
          this.openList[0] = 0;
          this.showList.push({
            child: MemberChoice.createAddisChoose(this.treeList, this.choseList),
          });
        }
      },
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  methods: {
    //当搜索的选人状态更新后，更新当前显示列表的选中状态
    updateShowList (choseArr) {
      this.showList.forEach((item) => {
        item.child = MemberChoice.createAddisChoose(item.child, choseArr);
      });
    },
    //获取cooike用户ID
    getCookie (name) {
      var strcookie = document.cookie; //获取cookie字符串
      var arrcookie = strcookie.split("; "); //分割
      //遍历匹配
      for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) {
          return arr[1];
        }
      }
      return "";
    },
    /*
     * 横向添加子层级
     * 当前层级选中,子层级皆是选中状态
     */
    async addUl(item, index, index1) {
      const box = this.$refs.box
      // console.log("document.body.clientWidth",document.body.clientWidth,box.offsetWidth,box.getBoundingClientRect().left);
      // this.distance = document.body.clientWidth - box.offsetWidth - box.getBoundingClientRect().left - 178
      // this.distance1 = document.body.clientWidth - box.getBoundingClientRect().left
    // console.log("distance==========",this.distance,window.innerWidth);
    // console.log("distance1==========",this.distance1);
      this.loading1 = true;
      this.loadingindex = item
      let childList = [];
        /* 组织架构
        userid  最后人员  没有下级 */
      if (item.userId || item.deptId == undefined) return;
        res = await getDeptInfo({
           isNeedUser: 1,
           deptId: item.deptId
        });
        this.treeList = (res.data.children.length != 0) ? res.data.children[0].children : []
        let child = JSON.parse(JSON.stringify(this.treeList));
        // console.log("child===============", child);
        this.maxLength = child.reduce((acc, cur) => {
        return acc > cur.deptName.length ? acc : cur.deptName.length;
        }, 0);
        console.log(this.maxLength,"this.maxLength"); // 7
        childList = MemberChoice.clickAddisChoose(
          child,
          this.choseList,
          item.isChoose,
          this.userId
        );
        this.loading1 = false
        // 从索引 index + 1 的位置开始删除所有元素
        this.showList.splice(index + 1);
        this.showList.push({ child: childList });
        this.openList.splice(index);
        // 索引是index，值是index1
      this.openList.push(index1);
      this.$nextTick(() => {
      //   console.log("item",item,index + 1);
      // console.log("this.$refs.ul", this.$refs.ul);
      // console.log("index + 1", index);
      // console.log("this.$refs.ul[index + 1]", this.$refs.ul[index + 1]);
        this.$refs.ul[index + 1].style.width = this.maxLength * 12 + 47 + 'px'
        this.distance1 = document.body.clientWidth - box.getBoundingClientRect().left
      // console.log("this.$refs.ul[index].style.width",this.$refs.ul[index + 1].style.width);
      // console.log("this.$refs.li",this.$refs.li);
      });
        return;
    },
    /* 防抖  怕多次切换  出偶现bug */
    debouncechoose: debounce(function (item, item2, index) {
      if (item.deptId == 100 || item.deptName == "深圳总公司") {
        this.departObj = item;
        if (!item2) {
          //触发弹框,进行二次确认
          this.showDialog = true;
          this.confirmText = item.deptName;
        }
      }
      this.choose(item, index);
    }),
    //弹框确认
    dialogCancel () {
      //取消执行
      this.showDialog = false;
      this.debouncechoose(this.departObj, true, 0);
    },
    dialogOk () {
      //确认执行  比如继续下一步跳转
      this.showDialog = false;
    },
    /*
      item 点击的对象
      index  展示数组的下标
      payload   不清楚了
    */
    async choose (item, index, payload) {
      //点击变为已选
      if (item.isChoose == false) {
        //已选列表没有就push
        this.choseList.push({
          index: index,
          ...MemberChoice.chosePush(item),
        });
        item.isChoose = true;
      } else {
        //点击变为未选
        item.isChoose = false;
          this.choseList.forEach((item1, index1, arr) => {
            if (item1.userId && item1.userId == item.userId) {
              arr.splice(index1, 1);
            } else if (
              !item1.userId &&
              item1.deptId &&
              item1.deptId == item.deptId
            ) {
              arr.splice(index1, 1);
            } else if (item1.groupId && item1.groupId == item.groupId) {
              arr.splice(index1, 1);
            }
          });
      }
    },
    //搜索同步
    searchSync (obj, check, onlyOne) {
      this.showList.filter((item, index) => {
        if (item.child && item.child.length > 0) {
          this.showList[index].child.filter((item1) => {
            if (item1.userId && item1.userId == obj.userId) {
              item1.isChoose = check != undefined ? check : true;
            } else {
              if (onlyOne === "onlyOne") {
                item1.isChoose = false;
              }
            }
          });
        }
      });
    },
  },
  mounted() { 
    eventThis.$on("showList", arr => {
      this.showList = arr
    })
  },
};
</script>

<style lang="scss" scoped>
//@import url(); 引入公共css类
.list-horizontal {
  display: table-cell;
  width: 50%;
  border-right: 1px solid #f4f4f4;

  height: 100%;
}
.list-horizontal:nth-last-child(1) {
  border: none;
}
.base {
  height: 198px;
}
.title {
  height: 40px;
  font-size: 12px;
  color: #333333;
  border-top: 1px solid #f4f4f4;
  border-bottom: 1px solid #f4f4f4;
  padding: 0;
  margin: 0;
  line-height: 40px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
}
.wrap {
  // height: 18px;
  display: flex;
  // float: left;
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  .li-b:hover {
    background-color: rgba(242, 242, 242, 0.6);   
  }
}
// .list-horizontal .wrap {
//   // display: flex;
//   // height: 263px;
//   // overflow: hidden;
// }
.list-horizontal ul:nth-last-child(1) {
  border: none;
}
ul {
  width: 160px;
  border-right: 1px solid #e6e6e6;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  min-width: 178px;
  max-width: 251px;
}

.open {
  background-color: #dfedff;
}
li:last-child {
  padding-bottom: 8px;
}
li {
  min-height: 33px;
  line-height: 33px;
  padding-left: 20px;

  span:first-child {
    display: inline-block;
    // border: 1px solid rgb(93, 93, 107);
    // width: 12px;
    // height: 12px;
    // vertical-align: middle;
    // line-height: 12px;
    cursor: pointer;
  }
  span:last-child {
    vertical-align: middle;
    font-size: 12px;
    cursor: default;
  }
  &:hover {
    background-color: rgba(223, 237, 255, 0.6);
  }
}
.inheritBackGroundCss {
  background-color: inherit;
}
.cccBackGroundCss {
  background-color: #ccc;
}
.nonePointerCss {
  pointer-events: none;
}
.autoPointerCss {
  pointer-events: auto;
}
.svg-icon {
  vertical-align: -0.25em;
}
.loading {
    margin-top: 1px;
    margin-left: 4px;
    width: 16px;
    height: 16px;
    border: 2px solid #DCDFE6;
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
</style>
