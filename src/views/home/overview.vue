<template>
  <div class="overview" v-loading="loading">
    <div class="item">
      商品分类总数：<span class="num">{{ jsonData.categoryTotal }}</span> 个
    </div>
    <div class="item">
      产品总数：<span class="num">{{ jsonData.productTotal }}</span> 个
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      jsonData: {},
      loading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.$store.dispatch('api/getQuery', {api: 'getPandectTotalVo'}).then(json => { // 请求商品数量数据
        this.jsonData = json
        this.loading = false
      }).catch(err => { this.loading = false })
    }
  }
}
</script>
<style lang='scss' scoped>
  .overview {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    .item {
      line-height: 60px;
      padding: 20px;
      background-color: #ccc;
      margin-bottom: 10px;
      .num {
        color: #409EFF;
      }
    }
  }
</style>
