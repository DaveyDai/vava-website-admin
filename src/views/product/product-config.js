// const validateCategory = (rule, value, callback) => {
//   console.log(1, rule)
//   console.log(2, value)
//   callback(new Error('请再次输入密码'))
//   callback()
// }
const validateNumber = (rule, value, callback) => {
  if (value && !(/(^[1-9]\d*$)/.test(value))) {
    callback(new Error('需输入正整数!'))
  } else {
    callback()
  }
}
const validatePrice = (rule, value, callback) => {
  if (value && !(/^[1-9]{1}[0-9]{0,10}[.]{0,1}[0-9]{0,2}$/.test(value)) && !(/^[0]{1}[.]{1}[0-9]{1,2}$/.test(value))) {
    callback(new Error('金额输入有误，最多保留2位小数'))
  } else {
    callback()
  }
}

const validateChar = (rule, value, callback) => {
  const pattern = new RegExp('[`~!@#^*]')
  if (pattern.test(value)) {
    callback(new Error('不能包含（[`~!@#^*]）特殊字符'))
  } else {
    callback()
  }
}

export default {
  listTableTitle: [ // product-list 列表
    { title: '产品ID', key: 'id', width: 100 },
    { title: '产品名称', key: 'productName' },
    { title: '产品排序', key: 'sort', width: 100 },
    { title: '状态', key: 'state', width: 100, isStatus: true },
    { title: '创建时间', key: 'createTime', width: 200 }
  ],
  productBaseRules: { // 产品基础数据校验
    categoryData: [{ required: true, message: '请选择分类', trigger: 'change' }],
    productMainUrl: [{ required: true, message: '请上传产品主图', trigger: 'input' }],
    model: [{ required: true, message: '请输入产品model', trigger: 'blur' }],
    productName: [{ required: true, message: '请输入产品全名称', trigger: 'blur' }],
    shortName: [{ required: true, message: '产品简称', trigger: 'blur' }],
    // amazonKeyword: [{validator: validateChar, trigger: 'blur'}],
    sort: [{ validator: validateNumber, trigger: 'blur' }]
  },
  productSkuRules: { // 产品sku数据校验
    // skuId: [{required: true, message: '请输入SKU', trigger: 'blur'}],
    colourCode: [{ required: true, message: '请选择产品颜色', trigger: 'input' }],
    districtCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
    // asin: [{required: true, message: '请输入sku asin', trigger: 'blur'}],
    listingPrice: [{ validator: validatePrice, trigger: 'blur' }], // {required: true, message: '请输入挂牌价', trigger: 'blur'},
    sellPrice: [{ validator: validatePrice, trigger: 'blur' }],
    productSkuImages: [{ required: true, message: '请上传对应颜色的商品图片', trigger: 'input' }]
  },
  productFAQRules: { // 产品faq数据校验
    question: [{ required: true, message: '请输入问题', trigger: 'blur' }],
    answer: [{ required: true, message: '请输入回答', trigger: 'blur' }],
    sort: [{ required: true, message: '请输入顺序（1-99正整数）', trigger: 'blur' }, { validator: validateNumber, trigger: 'blur' }]
  }
}
