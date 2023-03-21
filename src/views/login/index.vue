<template>
  <div class="loginContainer">
    <!-- 导航栏 -->
    <van-nav-bar title="标题"/>
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
      type="password" 
      name="密码" 
      :rules="userFormRules.code"
      maxlength="6"
      placeholder="请输入验证码" >
    <slot>
     
    </slot>
    </van-field>
  <div style="margin: 16px;">
    <!-- 提交按钮 -->
    <van-button type="info" native-type="onSubmit">登录</van-button>
  </div>
  </van-form>
</div>
</template>

<script>
// 引入api接口，将login解构出来
import {login }from '@/api/user'
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
    async onSubmit(values) { // 提交函数
      const user = this.user
      try {
        const res = await login(user)
        console.log('login success');
      } catch {
        if (err.response.status === 400) {
          console.log('login fail', err);
        }
      }
    console.log('submit', values)
    },

    // 登录函数
    async onLogin() {
      // 开始转圈圈
    this.$toast.loading({
      duration: 0, // 持续时间，0表示持续展示不停止
      forbidClick: true, // 是否禁止背景点击
      message: '登录中...' // 提示消息
    })

    // 2、请求登录
    try {
      const res = await request({
        method: 'POST',
        url: '/app/v1_0/authorizations',
        data: this.user
      })
      console.log('登录成功', res)
      // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
      this.$toast.success('登录成功')
    } catch (err) {
      console.log('登录失败', err)
      this.$toast.fail('登录失败，手机号或验证码错误')
    }
    }
  }
}

</script>

<style>
.loginContainer{
  padding-top: 20px;
}
.van-nav-bar__content{
  background-color: pink;
  height: 4rem;
}
</style>