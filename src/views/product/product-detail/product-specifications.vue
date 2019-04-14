<template>
  <div class="procutc-specifications">
    <div v-for="(item, index) of currentValue" :key="index" class="procutc-specifications-input">
      <el-autocomplete v-model="item.specsKey" :fetch-suggestions="querySearch" :maxlength="50" placeholder="参数类型(1-50个字符)" class="specifications-inputkey" @input="changeSpecs" @select="changeSpecs" />
      ：<el-input v-model="item.specsValue" type="textarea" :rows="4" class="specifications-inputvalue" placeholder="参数内容(1-2000个字符)" maxlength="2000" @input="changeSpecs" />
      <el-button slot="append" title="点击删除" class="delete-item" icon="el-icon-minus" @click="opspec(false, index)" />
    </div>
    <el-button icon="el-icon-plus" @click="opspec" />
  </div>
</template>

<script>
export default {
  props: {
    value: Array
  },
  data() {
    return {
      currentValue: this.value,
      specKeyList: ['capacity', 'Dimensions', 'Projection System', 'Sudio', 'Interfaces', 'Connectivity', 'Power', 'Others', 'Accessory'].map(str => { return { value: str } })
    }
  },
  watch: {
    value(val) {
      if (val === this.currentValue) return
      this.currentValue = val
    }
  },
  methods: {
    changeSpecs() {
      this.$emit('input', this.currentValue)
    },
    opspec(type, index) {
      if (type) {
        this.currentValue.push({ specsKey: '', specsValue: '' })
      } else {
        this.$confirm('确定删除该参数?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          this.currentValue.splice(index, 1)
          this.$emit('input', this.currentValue)
        }).catch(() => { this.$message.info('已取消') })
      }
    },
    querySearch(queryString, cb) {
      const results = queryString ? this.specKeyList.filter(item => item.value.indexOf(queryString) !== -1) : this.specKeyList
      cb(results)
    }
  }
}
</script>

<style lang="scss" scoped>
  .procutc-specifications{
    .procutc-specifications-input{
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .specifications-inputkey{
        width: 200px;
      }
      .delete-item{
        margin-left: 10px;
      }
      .specifications-inputvalue{
        width: 60%;
        margin-left: 5px;
        .el-icon-minus{
          font-size: 20px;
        }
      }
    }
  }
</style>
