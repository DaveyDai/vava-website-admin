<template>
  <div v-loading.fullscreen.lock="loading" class="product-edit">
    <div class="admin-page-card" style="width: 100%;">
      <div class="admin-page-card-title">填写基本信息<font color="red">*</font></div>
      <div class="admin-page-card-body">
        <el-form ref="productBaseForm" :model="productDetail" :rules="productBaseRules" label-width="160px" class="product-edit-base">
          <el-form-item label="选择所属分类：" prop="categoryData" class="product-base-item">
            <el-cascader v-model="productDetail.categoryData" :options="categoryInfo" change-on-select :props="{value: 'id', label: 'categoryName', children: 'child'}" clearable class="product-edit-input" />
          </el-form-item>
          <el-form-item label="产品Model：" prop="model" class="product-base-item">
            <el-input v-model="productDetail.model" maxlength="30" class="product-edit-input" placeholder="1-30字符" />
          </el-form-item>
          <el-form-item label="产品全名称：" prop="productName" class="product-base-item">
            <el-input v-model="productDetail.productName" maxlength="200" placeholder="1-200字符" class="product-edit-input" />
          </el-form-item>
          <el-form-item label="产品简称：" prop="shortName" class="product-base-item">
            <el-input v-model="productDetail.shortName" maxlength="30" placeholder="1-30字符" class="product-edit-input" />
          </el-form-item>
          <el-form-item label="产品主图：" prop="productMainUrl" class="product-base-item-line">
            <upload-card v-model="productDetail.productMainUrl" style="margin-top: 10px;margin-bottom: -6px;" />
            <font color="#ee8181">支持jpg，png，jpeg等常用图片格式，最多可添加1张；建议分辨率：800*400；不得大于500K；</font>
          </el-form-item>
          <div class="product-base-item-line" style="display: flex;">
            <el-form-item label="状态：" required>
              <el-switch v-model="productDetail.state" active-color="#13ce66" inactive-color="#dcdfe6" />
            </el-form-item>
            <el-form-item label="是否隐藏：" required>
              <el-switch v-model="productDetail.isHidden" active-color="#13ce66" inactive-color="#dcdfe6" />
            </el-form-item>
            <el-form-item label="标签：">
              <el-radio-group v-model="productDetail.labelCode">
                <el-radio label="LABEL_HOT">HOT</el-radio><el-radio label="LABEL_NEW">NEW</el-radio><el-radio label="">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="High Light：" class="product-base-item-line">
            <div v-for="(str, index) of productDetail.highLights" :key="index" style="margin-bottom: 15px;">
              <el-input v-model="productDetail.highLights[index]" class="product-edit-inpline" maxlength="500" placeholder="1-500字符">
                <el-button slot="append" icon="el-icon-minus" @click="opHighLight(false, index)" />
              </el-input>
            </div>
            <el-button icon="el-icon-plus" @click="opHighLight" />
          </el-form-item>
          <el-form-item label="Amazon Keywords：" prop="amazonKeyword"><el-input v-model="productDetail.amazonKeyword" maxlength="50" placeholder="1-50字符" class="product-edit-input" /></el-form-item>
          <el-form-item label="排序：" prop="sort" :required="!!productDetail.id"><el-input v-model="productDetail.sort" maxlength="4" placeholder="1-9999数字" style="width: 200px;" /></el-form-item>
        </el-form>
      </div>
    </div>
    <div class="admin-page-card" style="width: 100%;">
      <div class="admin-page-card-title">上传Overview图片（选填）</div>
      <div class="admin-page-card-body">
        <div style="color: #ee8181;margin-bottom: 15px;font-size:12px;">支持jpg，png，jpeg等常用图片格式；建议分辨率：1920**(宽1920高自适应)；不得大于1BM；</div>
        <upload-card v-model="productDetail.overviewImages" :limit="100" />
      </div>
    </div>
    <div class="admin-page-card" style="width: 950px;">
      <div class="admin-page-card-title">填写产品SKU信息 （选填）</div>
      <div class="admin-page-card-body">
        <product-sku ref="productSkuData" v-model="productDetail.productSkuDetailInfos" />
      </div>
    </div>
    <div class="admin-page-card" style="width: 730px;">
      <div class="admin-page-card-title">填写产品参数（选填）</div>
      <div class="admin-page-card-body">
        <specifications v-model="productDetail.productSpecsBos" />
      </div>
    </div>
    <div class="admin-page-card" style="width: 950px;">
      <div class="admin-page-card-title" style="display: flex;">添加附件（选填）<div style="color: #ee8181;margin-bottom: 15px;font-size:12px;margin-left: 15px;">支持各种文件格式，不得大于1GB；</div></div>
      <div class="admin-page-card-body">
        <product-upload-file ref="productUploadFile" v-model="productDetail.productAttachmentDetailBos" />
      </div>
    </div>
    <div class="admin-page-card product-page-card">
      <div class="admin-page-card-title">添加FAQ信息（选填）</div>
      <div class="admin-page-card-body">
        <!-- <el-button :type="productDetail.faqSyncAws===1?'primary':'info'" @click="productDetail.faqSyncAws=0">同步亚马逊FAQ</el-button> -->
        <!-- <el-button type="primary">手动维护FAQ</el-button> -->
        <product-faq ref="productFaq" v-model="productDetail.productFaqDetailBos" />
      </div>
    </div>
    <div class="admin-page-card product-page-card">
      <div class="admin-page-card-title">填写其他信息（选填）</div>
      <div class="admin-page-card-body">
        <el-form :model="productDetail" class="product-edit-base">
          <el-form-item label="是否将产品添加到USER MANUAL：" label-width="257px">
            <el-switch v-model="productDetail.userManual" active-color="#13ce66" inactive-color="#dcdfe6" />
          </el-form-item>
          <el-form-item label="SEO信息：" label-width="100px" style="width: 100%;">
            <div class="pro-from-title"><span class="pro-from-span">Title:</span><el-input v-model="productDetail.title" maxlength="500" placeholder="1-500个字符" class="product-edit-input" /></div>
            <div class="pro-from-title"><span class="pro-from-span">Keywords:</span><el-input v-model="productDetail.keyword" maxlength="500" placeholder="1-500个字符" class="product-edit-input" /></div>
            <div class="pro-from-title"><span class="pro-from-span">Description:</span><el-input v-model="productDetail.description" maxlength="500" placeholder="1-500个字符" class="product-edit-input" /></div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="product-edit-op">
      <el-button @click="cancelData">取消</el-button>
      <el-button @click="resetData">重置</el-button>
      <el-button type="primary" @click="checkProductData">保存提交</el-button>
      <!-- <el-button @click="copyData">复制</el-button> -->
    </div>
  </div>
</template>

<script>
import pageConfig from '..product-config'
import UploadCard from './upload-card.vue'
import Specifications from './product-specifications.vue'
import ProductSku from './product-sku.vue'
import ProductUploadFile from './product-upload-file.vue'
import ProductFaq from './product-faq.vue'
export default {
  components: { UploadCard, Specifications, ProductSku, ProductUploadFile, ProductFaq },
  data() {
    return {
      productDetail: {
        categoryData: [], // 分类信息
        firstCategoryId: '', // 一级分类id
        secondCategoryId: '', // 二级分类id
        productName: '', // 商品名称
        shortName: '', // 产品简称
        productMainUrl: '', // 产品主图
        state: false, // 状态(0-关闭 1-开启)(默认关闭)
        labelCode: '', // 标签code(来源字典数据)(多个用逗号隔开)
        highLights: [], // High Light列表(卖点)
        amazonKeyword: '', // Amazon Keywords(亚马逊搜索字段,预留)
        sort: '', // 排序
        isHidden: false, // 是否隐藏
        overviewImages: [], // Overview图片集合
        productSpecsBos: [], // 商品规格参数集合
        productSkuDetailInfos: [], // 商品sku详情信息集合
        productAttachmentDetailBos: [], // 商品附件集合
        productFaqDetailBos: [], // 商品faq集合
        userManual: true, // 是否将产品添加到USER MANUAL(0-否 1-是)(默认否)
        title: '', // 标题(seo)
        keyword: '', // keywords(seo)
        description: '', // 描述(seo)
        faqSyncAws: false, // 是否同步亚马逊faq数据 0-否 1-是(默认否)
        model: '', // model
        extendedWarrantyCode: 0, // 字典表延保时长code
        appIosDown: '', // ios的app下载地址
        appAndroidDown: '' // 安卓的app下载地址
      },
      loading: false,
      productBaseRules: pageConfig.productBaseRules,
      categoryInfo: [], // 分类信息
      isEdit: true
    }
  },
  mounted() {
    this.isEdit = true
    this.querySelectData()
  },
  methods: {
    async querySelectData() {
      this.loading = true
      const categoryInfo = await this.$store.dispatch('fetchGetAll', { api: 'findCategoryInfoTreeVo' }).catch(error => { // 一级分类
        this.$message.error(error.message || '获取数据失败, 请尝试刷新重试')
        return []
      })
      this.categoryInfo = categoryInfo
      this.loading = false
      if (this.$route.query.id && !this.$route.query.copy) this.queryProductData(this.$route.query.id)
    },
    queryProductData(id) {
      this.loading = true
      this.$store.dispatch('fetchGetAllUrl', { api: '/vava-pc-admin/product/getProductById/' + id, data: {}}).then(data => {
        data.categoryData = [data.firstCategoryId]
        if (data.categoryData) data.categoryData.push(data.secondCategoryId)
        this.productDetail = data
        this.edidData = JSON.stringify(this.productDetail)
        this.loading = false
      }).catch((error) => {
        this.loading = false
        this.$message.error(error.message || '获取数据失败, 请尝试刷新重试')
      })
    },
    opHighLight(type, index) {
      if (type) {
        if (this.productDetail.highLights.length >= 5) {
          this.$message.error('High Light 最多5条!')
          return
        }
        this.productDetail.highLights.push('')
      } else {
        this.$confirm('确定删除该条High Light?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          this.productDetail.highLights.splice(index, 1)
        }).catch(() => { this.$message.info('已取消') })
      }
    },
    checkProductData() {
      console.log(JSON.parse(JSON.stringify(this.productDetail)))
      let isPass = 0
      if (!this.$refs.productSkuData.checkProductSku()) {
        // this.$message.warning('SKU信息录入有误，请检查!')
        return false
      }
      if (!this.$refs.productUploadFile.getFileList()) {
        // this.$message.warning('附件信息录入有误，请检查!')
        return false
      }
      if (!this.$refs.productFaq.checkProductFaq()) {
        this.$message.warning('FAQ信息录入有误，请检查!')
        return false
      }
      if (this.productDetail.id && !this.productDetail.sort) {
        this.$message.warning('编辑产品时，排序不能为空!')
        return false
      }
      const isPassSpe = []
      this.productDetail.productSpecsBos.forEach(ii => {
        if (isPassSpe.indexOf(ii.specsKey) !== -1) {
          isPass++
          this.$message.warning('产品参数不能重复!')
        } else {
          isPassSpe.push(ii.specsKey)
        }
      })
      // this.productDetail.highLights.forEach(ii => {
      //   let pattern = new RegExp("[`~!@#^*]")
      //   if (pattern.test(ii)) {
      //     this.$message.warning('产品high lights不能包含特殊字符!')
      //     isPass++
      //   }
      // })
      if (isPass) {
        return false
      }
      this.productDetail.productAttachmentDetailBos = this.$refs.productUploadFile.getFileList()
      this.$refs.productBaseForm.validate((valid) => {
        if (valid) {
          const param = JSON.parse(JSON.stringify(this.productDetail))
          param.firstCategoryId = param.categoryData[0]
          param.secondCategoryId = param.categoryData[1] || ''
          this.$confirm('是否确定更新该产品数据？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            this.saveProductData(param)
          }).catch(() => { this.$message.info('已取消') })
        } else {
          this.$message.warning('基础信息录入不完整，请检查!')
          return false
        }
      })
    },
    saveProductData(data) {
      this.loading = true
      this.$store.dispatch('fetchAllList', { api: data.id ? 'updateProductInfo' : 'saveProductInfo', data: data }).then(data => {
        this.$message.success('产品更新成功')
        const view = this.$store.state.tagsView.visitedViews.filter(item => item.name === 'productEdit')[0]
        if (view) {
          this.$store.dispatch('delVisitedViews', view).then((views) => {
            this.$router.push('/product-list')
          })
        }
        this.isEdit = false
        this.loading = false
      }).catch((error) => {
        this.loading = false
        this.$message.error(error.message || '获取数据失败, 请尝试刷新重试')
      })
    },
    copyData() {
      const param = JSON.parse(JSON.stringify(this.productDetail))
      param.firstCategoryId = param.categoryData[0]
      param.secondCategoryId = param.categoryData[1] || ''
      delete param.id
      window.sessionStorage.setItem('copyData', JSON.stringify(param))
      window.open('/product-add?copy=true')
    },
    cancelData() {
      this.$router.push('/product-list')
    },
    resetData() {
      this.$confirm('该操作将清空所有数据，是否继续？', '提示', { confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }).then(() => {
        this.productDetail = {
          id: this.$route.query.id,
          categoryData: [], // 分类信息
          firstCategoryId: '', // 一级分类id
          secondCategoryId: '', // 二级分类id
          productName: '', // 商品名称
          shortName: '', // 产品简称
          productMainUrl: '', // 产品主图
          state: true, // 状态(0-关闭 1-开启)(默认关闭)
          labelCode: '', // 标签code(来源字典数据)(多个用逗号隔开)
          highLights: [], // High Light列表(卖点)
          amazonKeyword: '', // Amazon Keywords(亚马逊搜索字段,预留)
          sort: '', // 排序
          isHidden: false, // 是否隐藏
          overviewImages: [], // Overview图片集合
          productSpecsBos: [], // 商品规格参数集合
          productSkuDetailInfos: [], // 商品sku详情信息集合
          productAttachmentDetailBos: [], // 商品附件集合
          productFaqDetailBos: [], // 商品faq集合
          userManual: true, // 是否将产品添加到USER MANUAL(0-否 1-是)(默认否)
          title: '', // 标题(seo)
          keyword: '', // keywords(seo)
          description: '', // 描述(seo)
          faqSyncAws: false, // 是否同步亚马逊faq数据 0-否 1-是(默认否)
          model: '', // model
          extendedWarrantyCode: 0, // 字典表延保时长code
          appIosDown: '', // ios的app下载地址
          appAndroidDown: '' // 安卓的app下载地址
        }
      }).catch(() => { this.$message.info('已取消') })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isEdit) {
      this.$confirm('该产品信息修改尚未保存提交，是否确定离开？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        const view = this.$store.state.tagsView.visitedViews.filter(item => item.name === 'productEdit')[0]
        if (view) {
          this.$store.dispatch('delVisitedViews', view).then((views) => {
            next()
          })
        } else {
          next()
        }
      }).catch(() => { next(false) })
    } else {
      next()
    }
  }
}
</script>

<style lang="scss">
  .product-edit{
    width: 100%;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .product-edit-base{
      display: flex;
      flex-wrap: wrap;
      .product-base-item{
        width: 560px;
      }
      .product-base-item-line{
        width: 100%;
      }
      .product-edit-input{
        width: 400px;
      }
      .product-edit-inpline{
        width: 800px;
      }
    }
    .product-page-card{
      width: 49%;
    }
    .product-edit-op{
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      text-align: center;
      background-color: rgba(140, 140, 140, 0.8);
      padding: 15px 0;
      z-index: 50;
      margin-bottom: 0;
    }
    .pro-from-title{
      margin-top: 35px;
      display: flex;
      margin-left: -100px;
      .pro-from-span{
        display: inline-block;
        width: 80px;
        text-align: right;
        margin-right: 10px;
      }
    }
  }
</style>
