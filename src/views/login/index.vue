<template>
  <div class="loginContainer">
    <!-- 导航栏 -->
    <van-nav-bar title="标题" style="background-color: #1989fa;"/>
    <!-- 登录表单 -->
    <van-form @submit="onSubmit">
    <van-field 
      v-model="user.mobile" 
      left-icon="user-o" 
      style="padding-left: 20px;" 
      name="用户名" 
      :rule="userFormRules.mobile"
      type="number"
      maxlength="11"
      placeholder="请输入手机号"></van-field>
    <van-field 
      v-model="user.code" 
      left-icon="bag-o" 
      style="padding-left: 20px;" 
      type="password" 
      name="密码" 
      :rules="userFormRules.code"
      maxlength="6"
      placeholder="请输入验证码" >
    <template #button>
      <van-button size="small" type="default" style="background-color:#828383" @click="codeSend">发送验证码</van-button>
    </template>
    <!-- 关于倒计时组件的使用 -->
    </van-field>
  <div style="margin: 16px;">
    <!-- 提交按钮 -->
    <van-button block type="info" native-type="submit" style="border-radius: 5px;">登录</van-button>
  </div>
  </van-form>
</div>
</template>

<script>
// 引入api接口，将login解构出来
import { login } from '@/api/user'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code:''
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: { 
  // 1、完善表单提交函数
  // 声明用户，用try...catch捕获错误，声明结果的时候调取接口，状态码为400的时候登陆失败
  // 添加toast作为交互提示
    async onSubmit() {
      const user = this.user
      try {
        const res = await login(user)
        console.log('succes',res);
      } catch (err) {
        if (err.response.status === 400) {
          console.log(err);
        }
      }
    },
  async codeSend(){}
  }
}

</script>

<style scoped>
.loginContainer{
  padding-top: 20px;
}
.van-nav-bar__content{
  background-color: #3296fa;
  height: 4rem;
  font-size: 2rem;
  color: #fff;

}
</style>