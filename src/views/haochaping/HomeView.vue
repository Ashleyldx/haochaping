<template>
  <!-- 好差评 -->
  <div class="homeContainer">
    <!-- 选择日期 -->
    <van-cell-group inset>
      <van-cell title="选择单个日期" :value="date" @click="show = true" />
      <van-calendar v-model="show" @confirm="onConfirm" />
    </van-cell-group>
    <!-- 评价率 -->
  <van-cell-group inset>
    <van-cell title="评价率" style="font-size: 18px;"/>
    <van-circle v-model="currentRateFirst" :rate="95"  layer-color="#fafafa" color="#07c060" :speed="100" :text="好评" />
    <van-circle v-model="currentRateSecond" :rate="5"  layer-color="#fafafa" color="#1988f8" :text="中评" />
    <van-circle v-model="currentRateThird" :rate="0"  layer-color="#fafafa" color="#ee0a24" :text="差评" />
  </van-cell-group>

    <!-- 评分统计 -->
    <van-cell-group inset>
      <van-cell title="评分统计" style="font-size: 18px;"/>
      <zhuCharts></zhuCharts>
    </van-cell-group>
    
    <!-- 评分排行榜-好评 -->
    <van-cell-group inset>
      <van-cell title="评分排行榜-好评" style="font-size: 18px;"/>
      <van-cell value="1、惠东县行政服务中心" size="large" />
      <van-cell value="2、平山街道" size="large" />
      <van-cell value="3、X街道" size="large" />
      <van-cell value="4、XX街道" size="large"  />
    </van-cell-group>

  </div>
</template>

<script>
import zhuCharts from '@/components/zhuCharts.vue'
export default {
  name: 'HomeView',
  components: {zhuCharts},
  data() {
    return {
      // 时间选择
      date: '2023-03',
      show: false,

      // progress进度
      currentRateFirst:0,
      currentRateSecond:0,
      currentRateThird:0,
    }
  },
  computed: {
    text() {
      return this.currentRateFirst.toFixed(0) + '%';
      return this.currentRateSecond.toFixed(0) + '%';
      return this.currentRateThird.toFixed(0) + '%';
    },
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
}
</script>

<style scoped>
.homeContainer{
  background-color: #f7f8fa;
}
</style>