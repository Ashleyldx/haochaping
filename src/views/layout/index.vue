<template>
  <div class="tabBarContainer">
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" to="home">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="play-circle-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script> 
<style>
.tabBarContainer{
  background-color: aqua;
  height: 80px;
}
</style>