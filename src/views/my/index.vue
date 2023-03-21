<template>
  <div class="myContainer">
    <!-- 背景板 -->
    <div class="topContainer">
      <div class="mobile-box">
        <!-- 引入图片 -->
        <img src="../../assets/loginmobile.png" class="imgClass" alt="">
      </div>
      <div claass="loginInClass">登录/注册</div>
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
    
  }
}

</script>
<style>
.topContainer{
  height: 10rem;
  background-image: url(../../assets/login.png);
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
  margin: auto;
  color: #fff;
}

</style>