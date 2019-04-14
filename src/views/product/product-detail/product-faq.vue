<template>
  <div class="product-faq">
    <div><el-button type="primary" @click="addProductFqa">新增FAQ</el-button></div>
    <el-collapse v-if="currentValue.length>0" class="product-faq-data">
      <el-collapse-item v-for="(item, index) of currentValue" :key="index" :name="index+''">
        <div slot="title" class="product-faq-data-title"><span class="product-faq-delete" @click.stop="deleteFaq(index)">删除</span><span>{{ item.question }}</span></div>
        <el-form ref="faqList" :model="item" :rules="productFAQRules" label-width="100px" class="product-faq-content">
          <el-form-item label="问题：" prop="question">
            <el-input v-model="item.question" type="textarea" :rows="2" placeholder="不限制字数和字符格式" class="product-faq-textarea" />
          </el-form-item>
          <el-form-item label="回答：" prop="answer">
            <el-input v-model="item.answer" type="textarea" :rows="2" placeholder="不限制字数和字符格式" class="product-faq-textarea" />
          </el-form-item>
          <el-form-item label="顺序：" prop="sort">
            <el-input v-model="item.sort" placeholder="1-99数字，不可和其他分类排序重复" maxlength="2" class="product-faq-textarea" />
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="请填写FAQ信息" :visible.sync="dialogVisible" top="10vh" width="60%" center>
      <el-form ref="addFaq" :model="dialogData" :rules="productFAQRules" label-width="100px" class="product-faq-content">
        <el-form-item label="问题：" prop="question">
          <el-input v-model="dialogData.question" type="textarea" :rows="2" placeholder="不限制字数和字符格式" class="product-faq-textarea" />
        </el-form-item>
        <el-form-item label="回答：" prop="answer">
          <el-input v-model="dialogData.answer" type="textarea" :rows="2" placeholder="不限制字数和字符格式" class="product-faq-textarea" />
        </el-form-item>
        <el-form-item label="顺序：" prop="sort">
          <el-input v-model="dialogData.sort" placeholder="1-99数字，不可和其他分类排序重复" maxlength="2" class="product-faq-textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFaqData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageConfig from './product-config.js'
export default {
  props: {
    value: Array
  },
  data() {
    return {
      currentValue: this.value,
      dialogVisible: false,
      productFAQRules: pageConfig.productFAQRules,
      dialogData: {}
    }
  },
  watch: {
    value(val) {
      if (val === this.currentValue) return
      this.currentValue = val
    }
  },
  methods: {
    addFaqData() {
      this.$refs.addFaq.validate((valid) => {
        if (valid) {
          this.currentValue.push(Object.assign({}, this.dialogData))
          this.dialogVisible = false
          this.$emit('input', this.currentValue)
        } else {
          this.$message.warning('FAQ信息不完整，请检查!')
          return false
        }
      })
    },
    addProductFqa() {
      this.dialogData = {}
      if (this.$refs.addFaq) this.$refs.addFaq.resetFields()
      this.dialogVisible = true
    },
    checkProductFaq() { // 提供组件外校验方法
      let isPass = 0
      if (this.$refs.faqList && this.$refs.faqList.length > 0) {
        this.$refs.faqList.forEach(item => {
          item.validate(valid => {
            if (valid) {
            } else {
              isPass++
            }
          })
        })
      }
      return !isPass
    },
    deleteFaq(index) {
      this.$confirm('确定删除该FAQ信息?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.currentValue.splice(index, 1)
        this.$emit('input', this.currentValue)
      }).catch(() => { this.$message.info('已取消') })
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-faq{
    margin-top: 15px;
    .product-faq-data{
      margin-top: 10px;
      border-left: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
    }
    .product-faq-content{
      padding-right: 10px;
    }
    .product-faq-delete{
      color: #409EFF;
      text-decoration: underline;
      margin: 0 15px;
      cursor: pointer;
    }
  }
</style>
