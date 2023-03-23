<template>
  <div class="home-container">
    <van-search 
      v-model="value" 
      class="topSearch"
      shape="round"
      background="#3196fa" 
      placeholder="搜索" 
      @search="onSearch"/>
    </div>
</template>

<script>
export default {
  name: 'HomePage',
  components: {},
  props: {},
  data () {
    return {
      value: '',
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearch() {
      
    }
  }
}
</script>

<style scoped>
.topSearch{
  align-items: center;
  background-color: #5babfb;
}
</style>