<template>
  <div class="myContainer">
    <!-- 游客页面 -->
    <div class="visitorContainer">
    <div class="topContainer">
      <div class="mobile-box">
        <img src="../../assets/loginmobile.png" class="imgClass" alt="">
      </div>
      <div class="loginInClass" @click="loginIn">登录/注册</div>
    </div>
    <!-- 收藏-历史 -->
    <van-grid :column-num="2">
      <van-grid-item icon="star-o" text="收藏" />
      <van-grid-item icon="clock-o" text="历史" />
    </van-grid>
    <!-- 消息-小智 -->
    <van-cell-group>
      <van-cell title="消息通知" is-link/>
      <van-cell title="小智同学" is-link/>
    </van-cell-group>
    </div>

    <!-- 我的页面 -->
    <div class="myContainer">
      <div class="visitorContainer">
        <div class="myTopContainer">
          <van-row type="flex" style="padding-top: 2.8rem; padding-left: 2.5rem">
            <van-col span="6">
              <van-image
              round
              width="4.5rem"
              height="4.5rem"
              src="https://img01.yzcdn.cn/vant/cat.jpeg"/>
            </van-col>
            <van-col span="6">
              <div>黑马小工具</div>
              <van-button round style="color: #479ef4;">申请认证</van-button>
            </van-col>
          </van-row>

          <van-row type="flex" justify="space-between" style="padding-left: 4rem;padding-top: 1.2rem;">
            <van-col span="6">          
              <ul>
                <li>8</li>
                <li>动态</li>
              </ul>
            </van-col>
            <van-col span="6">          
              <ul>
                <li>66</li>
                <li>关注</li>
              </ul>
            </van-col>
            <van-col span="6">          
              <ul>
                <li>88</li>
                <li>粉丝</li>
              </ul>
            </van-col>
          </van-row>
          <!-- 头像 -->
        </div>
    <!-- 收藏-历史 -->
      <van-grid :column-num="3">
        <van-grid-item icon="star-o" text="收藏" />
        <van-grid-item icon="clock-o" text="历史" />
        <van-grid-item icon="edit" text="作品" />
      </van-grid>
    <!-- 消息-认证 -->
      <van-cell-group>
        <van-cell title="消息通知" is-link/>
        <van-cell title="实名认证" is-link/>
      </van-cell-group>
    <!-- 用户反馈 -->
      <van-cell-group>
        <van-cell title="用户反馈" is-link/>
        <van-cell title="小智同学" is-link/>
        <van-cell title="系统设置" is-link/>
      </van-cell-group>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    loginIn() {
      
    }
  }
}
</script>

<style lang="less" scoped>
.topContainer{
  height: 12rem;
  justify-content: space-between;
  background-image: url(../../assets/login.png);
  color: #fff;
}
.myTopContainer{
  height: 12rem;
  justify-content: space-between;
  background-image: url(../../assets/login.png);
  color: #fff;
}
.mobile-box{
  display: flex;
}
.imgClass{
  width: 4rem;
  height: 4rem;
  margin: 2rem auto;
}
.loginInClass{
  position: relative;
  margin-left: 9.5rem;
  /* margin-top: 1rem; */
  color: #fff;
}

</style>