<template>
  <div>
    <!-- 子路由出口===这里为什么要加上子路由出口？？？看视频课 -->
    <router-view></router-view>
    <div class="tabBarContainer" route>
    <!-- 开启路由模式 -->
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="play-circle-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  components: {},
  props: {},
  data () {
    return {
      active: 0,
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script> 

<style lang="less" scoped>
.tabBarContainer{
  height: 80px;
}
</style>