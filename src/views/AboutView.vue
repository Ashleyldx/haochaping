<template>
  <div class="aboutContainer">
  <!-- 时间选择器 -->  
  <van-cell-group inset>
    <van-cell title="选择单个日期" :value="date" @click="show = true" />
    <van-calendar v-model="show" @confirm="onConfirm" />
  </van-cell-group>

  <!-- 工单数 -->
  <van-cell-group inset>
    <van-cell title="工单数" style="font-size: 18px;"/>
    <van-row gutter="10">
      <van-col span="8">总件数</van-col>
      <van-col span="8">已完成</van-col>
      <van-col span="8">未完成</van-col>
    </van-row>
    <van-row gutter="10">
      <van-col span="8">100</van-col>
      <van-col span="8">95</van-col>
      <van-col span="8">5</van-col>
    </van-row>
  </van-cell-group>


  <!-- 及时率 -->
  <van-cell-group inset>
    <van-cell title="及时率" style="font-size: 18px;"/>
    <van-row gutter="10">
      <van-col span="12">及时</van-col>
      <van-col span="12">超时</van-col>
    </van-row>
    <van-row gutter="10">
      <van-col span="12">98%</van-col>
      <van-col span="12">2%</van-col>
    </van-row>
  </van-cell-group>


  <!-- 工单预警 -->
  <van-cell-group inset>
    <van-cell title="工单预警" style="color: red; font-size: 18px;"/>
    <van-cell title="1、X部门" value="向左滑动该项可催办"/>
    <van-cell title="2、X部门" value="向左滑动该项可催办"  />
    <van-cell title="3、X部门" value="向左滑动该项可催办"  />
  </van-cell-group>

  <!-- 工单部门热榜 -->
  <van-cell-group inset>
    <van-cell title="工单部门热榜" style="color: #f2aa3d; font-size: 18px;"/>
    <van-cell value="1、X部门" />
    <van-cell value="2、X部门" />
  </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: '2023-03',
      show: false,
    };
  },
  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.date = this.formatDate(date);
    },
  },
};
</script>

<style scoped>
.aboutContainer{
  /* margin: 10px; */
  background-color: #f8f9f9;
}

</style>