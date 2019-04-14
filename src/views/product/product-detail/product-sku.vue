<template>
  <div class="product-sku">
    <el-collapse v-if="currentValue.length>0" class="product-sku-data">
      <el-collapse-item v-for="(item, index) of currentValue" :key="index" :name="index+''">
        <template slot="title"><div class="collapse-title">{{ item.skuId }}<i class="title-icon el-icon-delete" title="删除该sku信息" @click.stop="deleteProSku(index)" /></div></template>
        <el-form ref="productSkuForm" :model="item" :rules="productSkuRules" label-width="120px" class="product-sku-data-item">
          <el-form-item label="SKU ID：" prop="skuId" class="product-base-item">
            <el-input v-model="item.skuId" maxlength="50" class="product-edit-input" placeholder="1-50个字符" />
          </el-form-item>
          <el-form-item label="选择产品配色：" prop="colourCode" class="product-base-item">
            <productsku-color ref="productskuColor" v-model="item.colourCode" />
          </el-form-item>
          <el-form-item label="选择产品地区：" prop="districtCode" class="product-base-item">
            <el-select v-model="item.districtCode" class="product-edit-input" placeholder="请选择地区">
              <el-option v-for="opitem in countryData" :key="opitem.dicCode" :label="opitem.description" :value="opitem.dicCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="ASIN：" prop="asin" class="product-base-item">
            <el-input v-model="item.asin" maxlength="50" class="product-edit-input" placeholder="1-50个字符" />
          </el-form-item>
          <el-form-item label="挂牌价：" prop="listingPrice" class="product-base-item">
            <el-input v-model="item.listingPrice" maxlength="20" class="product-edit-input" placeholder="1-20位数字（包含小数）" />
          </el-form-item>
          <el-form-item label="售价：" prop="sellPrice" class="product-base-item">
            <el-input v-model="item.sellPrice" maxlength="20" class="product-edit-input" placeholder="1-20位数字（包含小数）" />
          </el-form-item>
          <el-form-item label="对应颜色的商品图片：" prop="productSkuImages">
            <upload-card v-model="item.productSkuImages" :limit="5" style="margin-top: 10px;margin-bottom: -6px;" />
            <font color="#ee8181" style="line-height: 1.3;display: inline-block;margin-top: 10px;font-size: 12px;">支持jpg，png，jpeg等常用图片格式，最多可添加5张；建议分辨率：720*720；不得大于1MB；</font>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-button @click="addProductSku">添加SKU信息</el-button>
    <el-dialog title="请填写SKU信息" :visible.sync="dialogVisible" top="10vh" width="60%" center>
      <el-form ref="productAddSkuForm" :model="dialogData" :rules="productSkuRules" label-width="200px">
        <el-form-item label="SKU ID：" prop="skuId">
          <el-input v-model="dialogData.skuId" maxlength="50" class="product-edit-input" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="选择产品配色：" prop="colourCode">
          <productsku-color v-model="dialogData.colourCode" />
        </el-form-item>
        <el-form-item label="选择产品地区：" prop="districtCode" placeholder="请选择地区">
          <el-select v-model="dialogData.districtCode" class="product-edit-input">
            <el-option v-for="opitem in countryData" :key="opitem.dicCode" :label="opitem.description" :value="opitem.dicCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="ASIN：" prop="asin">
          <el-input v-model="dialogData.asin" maxlength="50" class="product-edit-input" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="挂牌价：" prop="listingPrice">
          <el-input v-model="dialogData.listingPrice" maxlength="50" class="product-edit-input" placeholder="1-20位数字（包含小数）" />
        </el-form-item>
        <el-form-item label="售价：" prop="sellPrice">
          <el-input v-model="dialogData.sellPrice" maxlength="50" class="product-edit-input" placeholder="1-20位数字（包含小数）" />
        </el-form-item>
        <el-form-item label="对应颜色的商品图片：" prop="productSkuImages">
          <font color="#ee8181">支持jpg，png，jpeg等常用图片格式，最多可添加5张；建议分辨率：720*720；不得大于1MB；</font>
          <upload-card v-model="dialogData.productSkuImages" :limit="5" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSkuData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageConfig from './product-config.js'
import UploadCard from './upload-card.vue'
import ProductskuColor from './productsku-color.vue'
export default {
  components: { UploadCard, ProductskuColor },
  props: {
    value: Array
  },
  data() {
    const countryData = JSON.parse(window.localStorage.getItem('treeVoListData')).filter(item => item.code === 'DISTRICT_CODE_TYPE') // 从数据字段中获取国家列表
    return {
      currentValue: this.value,
      dialogVisible: false,
      productSkuRules: pageConfig.productSkuRules,
      countryData: countryData[0].dicItemVos,
      dialogData: { productSkuImages: [] }
    }
  },
  watch: {
    value(val) {
      if (JSON.parse(JSON.stringify(this.currentValue)) === JSON.parse(JSON.stringify(val))) return
      this.currentValue = val
    }
  },
  methods: {
    addProductSku() {
      this.dialogData = { productSkuImages: [] }
      this.dialogVisible = true
    },
    addSkuData() {
      this.$refs.productAddSkuForm.validate((valid) => {
        if (valid) {
          this.currentValue.push(JSON.parse(JSON.stringify(this.dialogData)))
          this.dialogVisible = false
          this.$refs.productAddSkuForm.resetFields()
          this.$emit('input', this.currentValue)
        } else {
          this.$message.warning('提交信息不完整，请检查!')
          return false
        }
      })
    },
    checkProductSku() { // 提供组件外校验方法
      let isPass = 0
      const checkSku = []
      const checkColor = []
      this.currentValue.forEach((item, index) => {
        item.districtfName = this.countryData.filter(i => i.dicCode === item.districtCode)[0].description
        item.colourName = this.$refs.productskuColor[index].currentValue.dicValue
        if (checkSku.indexOf(item.skuId) !== -1) {
          this.$message.warning('SKU不能重复，请检查!')
          isPass++
          return false
        }
        if (item.skuId) checkSku.push(item.skuId)
        if (checkColor.indexOf(this.$refs.productskuColor[index].currentValue.dicCode) !== -1) {
          this.$message.warning('SKU颜色不能重复，请检查!')
          isPass++
          return false
        }
        checkColor.push(this.$refs.productskuColor[index].currentValue.dicCode)
      })
      if (this.$refs.productSkuForm && this.$refs.productSkuForm.length > 0) {
        this.$refs.productSkuForm.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              this.$message.warning('SKU必填项输入有误，请检查!')
              isPass++
              return false
            }
          })
        })
      }
      return !isPass
    },
    deleteProSku(index) {
      this.$confirm('确定删除该SKU信息?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.currentValue.splice(index, 1)
        this.$emit('input', this.currentValue)
      }).catch(() => { this.$message.info('已取消') })
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-sku{
    .product-sku-data{
      padding: 0 10px;
      margin-bottom: 15px;
      border-left: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      .collapse-title{
        font-size: 20px;
        font-weight: bold;
        .title-icon{
          font-size: 20px;
          margin-left: 25px;
          &:hover{
            color: #409EFF;
          }
        }
      }
      .product-sku-data-item{
        display: flex;
        flex-wrap: wrap;
        .product-base-item{
          width: 450px;
        }
      }
    }
    .product-edit-input{
      width: 300px;
    }
    .dialog-footer{
      display: flex;
      justify-content: center;
    }
  }
</style>
<style lang="scss">
  .product-sku {
    .el-upload-list--picture-card .el-upload-list__item, .el-upload--picture-card{
      // width: 120px;
      // height: 120px;
      // line-height: 120px;
    }
  }
</style>
