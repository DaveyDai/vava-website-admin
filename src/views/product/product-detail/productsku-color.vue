<template>
  <div class="producsku-color">
    <el-tag v-if="currentValue.dicValue" closable type="info" class="producsku-color-item" @close="deleteColor">
      <span :style="{'background': currentValue.dicValue}" /> <i>{{ currentValue.description }}</i>
    </el-tag>
    <el-button v-else icon="el-icon-plus" circle @click="centerDialogVisible = true" />
    <el-dialog title="请选择颜色" :visible.sync="centerDialogVisible" width="40%" center append-to-body>
      <div class="dialog-color">
        <el-tag v-for="(item, index) of colorList" :key="index" type="info" class="producsku-color-item" @click.native="changeColor(item)">
          <span :style="{'background': item.dicValue}" /> <i>{{ item.description }}</i>
        </el-tag>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const colorData = JSON.parse(window.localStorage.getItem('treeVoListData')).filter(item => item.code === 'COLOUR_CODE_TYPE') // 从数据字段中获取颜色列表
export default {
  props: {
    value: String
  },
  data() {
    const colorValue = colorData[0].dicItemVos.filter(item => item.dicCode === this.value)
    return {
      centerDialogVisible: false,
      colorList: colorData[0].dicItemVos,
      currentValue: colorValue.length && colorValue[0] || {}
    }
  },
  watch: {
    value(val) {
      const colorValue = colorData[0].dicItemVos.filter(item => item.dicCode === val)
      this.currentValue = colorValue.length && colorValue[0] || {}
    }
  },
  methods: {
    deleteColor() {
      this.currentValue = {}
      this.$emit('input', '')
    },
    changeColor(item) {
      this.currentValue = item
      this.$emit('input', this.currentValue.dicCode)
      this.centerDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .producsku-color{
    height: 35px;
  }
</style>
<style lang="scss" scoped>
  .dialog-color{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .producsku-color-item{
    background-color: #FFF;
    height: 30px;
    line-height: 30px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    span{
      display: inline-block;
      width: 10px;
      height: 10px;
      border: 1px solid #dcdfe6;
    }
    i{
      font-style: normal;
    }
  }
</style>
