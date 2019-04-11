<template>
  <div class="overview">
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
      jsonData: {}
    }
  },
  mounted: function() {
    // this.init()
  },
  // 方法
  methods: {
    init() {
      const apiData = {
        api: 'getPandectTotalVo',
        data: {}
      }
      this.$store.dispatch('fetchGetAll', apiData).then(json => {
        console.log(json)
        this.jsonData = json
      })
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
