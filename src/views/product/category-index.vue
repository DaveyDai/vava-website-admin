<template>
  <!-- 分类管理 -->
  <div class="category">
    <div class="block">
      <h2 >分类列表 </h2>
      <div style="margin-bottom: 10px;">
        <el-button @click="setSort(1)">排序上移</el-button>
        <el-button @click="setSort(0)">排序下降</el-button>
        <el-button @click="getCheckedKeys(1)">开启状态</el-button>
        <el-button @click="getCheckedKeys(0)">关闭状态</el-button>
        <el-button @click="add">新建</el-button>
      </div>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        :data="jsonData"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        :filter-node-method="filterNode"
        ref="tree"
        :expand-on-click-node="true">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <!-- 状态是否开启 -->
          <span v-bind:style="{ color: data.state != 1 ? '#ccc' : '#606266' }" >{{ node.label }}
          </span>
          <span>
            <el-button
              type="text"ß
              size="mini"
              @click="() => handleNodeClick(data)">
               EDIT
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              DELETE
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>


    <!-- 修改 -->
    <div class="block" v-if="title !== ''">
      <!-- 标题 -->
      <h2 >{{ title }}</h2>
      <!-- 新增 -->
      <div class="item">
        <label>分类级别<i style="color: red;">*</i></label>
        <el-select v-model="currentData.chooseCategory" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
       
      </div>
      <div class="item" v-if="currentData.chooseCategory !== 0">
        <label>选择一级分类<i style="color: red;">*</i></label>
        <el-select v-model="currentData.parentId"   placeholder="请选择">
            <el-option
              v-for="item in mainCategoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id">
            </el-option>
        </el-select>
      </div>

      <div class="item">
        <label>
          分类名称<i style="color: red;">*</i>:
        </label>
        <el-input v-model="currentData.categoryName" maxlength="30" style="width: 250px" @change.native="enterProductName" ></el-input>
      </div>

      <!-- 增加分类Banner图片 手机 和移动端 -->
      <div class="item">
        <label>分类Banner:</label>
        <div class="desc">
          <!-- 上传 fileKeyPc -->
          <upload title="pc" @fileKey="setPcImg" @removeKey="removePcKey" :fileImgUrl="currentData.bannerUrl" ></upload>
          <!-- <upload title="m" @fileKey="setMImg" @removeKey="removeMKey" :fileImgUrl="appImgObj.appImg" ></upload> -->
        </div>
      </div>

      <div class="item">
        <label>
          分类描述:
        </label>
        <el-input v-model="currentData.remark" ></el-input>
      </div>
      <!-- <div class="item">
        <label>
          排序:
        </label>
        <el-input v-model="currentData.sort" ></el-input>
      </div> -->
      <div class="item">
        <label style="width: 100px;line-height: 32px;">
          状态:
        </label>
        <div>
          <el-switch
            v-model="currentData.state"
            :active-value = "1"
            :inactive-value = "0"
          >
          </el-switch>
        </div>
      </div>

      <!-- seo 信息 -->
      <div class="item">
        <label>
          Title:
        </label>
        <el-input v-model="currentData.title" ></el-input>
      </div>

      <div class="item">
        <label>
          Keywords:
        </label>
         <el-input v-model="currentData.keyword" ></el-input>
      </div>
      <div class="item">
        <label>
          Description:
        </label>
        <el-input v-model="currentData.description" ></el-input>
      </div>

      <div class="item" style="width: 400px; margin: 0 auto;">
         <div style="text-align: center;width: 100%;"> 
           <el-button type="primary" @click="saveCatalog" v-if="title === '修改'">保存</el-button>
           <!-- 新建保存 -->
           <el-button type="primary" @click="addCatalog" v-else >保存
           </el-button>
         </div>
         <!-- <el-button>取消</el-button> -->
      </div>
    </div>
  </div>
</template>
<script>
  import upload from './upload.vue'
  import { mapGetters } from 'vuex'
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    computed: {
      ...mapGetters([
        'langId',
        'brandId'
      ]),
      /**
       * 完整的urlkey
       */
      urlKeyTotal() {
        return `/c/${this.currentData.urlKey}.html`
      }
    },
    // 定义变量
    data() {
      return {
        title: '',
        jsonData: [],
        options: [{
          value: 0,
          label: '一级分类'
        }, {
          value: 1,
          label: '二级分类'
        }],
        currentData: {
          chooseCategory: 0, // 选择是否一级分类
          parentId: 0,
          normalImg: '', // 分类产品图片
          hoverImg: '' // 移动上去显示图片
        }, // 当前
        mainCategoryList: [],
        fileKeyPc: '', // pc版本图片
        pcImgObj: {}, // pc Banner图片对象
        parentDirectory: '', // 上级目录
        isMove: false, // 是否显示
        filterText: '',
        defaultProps: {
          children: 'child',
          label: 'categoryName'
        }
      }
    },
    mounted: function() {
      // getMoreCatalog
      this.init()
    },
    // 方法
    methods: {
      init() {
        const apiData = {
          api: 'getMoreCatalog',
          data: {
          }
        }
        this.$store.dispatch('fetchGetAll', apiData).then(json => {
          this.jsonData = json
        })
      },
      add() {
        this.title = '新建'
        this.parentDirectory = ''
        this.currentData = {
          parentId: 0,
          chooseCategory: 0,
          childFlag: 0,
          state: 1
        }
        // 获取一级分类数据
        this.getDetailCate();
      },
      remove(node, data) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 2 是删除
          const apiData = {
            api: 'updateStateInfo',
            data: {
              ids: [data.id],
              updateType: 2
            }
          }
          this.$store.dispatch('fetchAllList', apiData).then(json => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.parentDirectory = '';
            this.clearData();
            this.init()
          }).catch((json) => {
            this.$message({
              type: 'info',
              message: json.message
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      /**
       * 获取分类数据
       */
      getDetailCate () {
         // 获取一级分类数据
        let apiData = {
          api: 'findCategoryListById',
          data: {
            parentId: 0
          }
        }
        this.$store.dispatch('fetchGetAll', apiData).then(json => {
          this.mainCategoryList = json;
        })
      },
      // 获取状态
      async getCheckedKeys(status) {
        const ids = this.$refs.tree.getCheckedKeys()
        const apiData = {
          api: 'updateStateInfo',
          data: {
            ids: ids,
            updateType: status
          }
        }
        await this.$store.dispatch('fetchAllList', apiData)
        this.init()
      },
      /**
       * 上移和下移
       */
      async setSort (sid) {
        let id = this.$refs.tree.getCheckedKeys();
        if (id.length > 1 ){
          this.$message('只能选择1条数据进行排序')
          return false
        } 
        id = id[0]
        let arr = this.$refs.tree.children;
        // 兼容
        if (this.$refs.tree.getHalfCheckedNodes().length > 0) {
          arr = this.$refs.tree.getHalfCheckedNodes()[0].child;
        }
        let zIndex = 0;
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (element.id == id){
            zIndex = index;
          }
        }
        // 上移 1 下移0
        if(sid === 1) {
          zIndex = zIndex - 1;
        } else {
          zIndex =  zIndex + 1;
        }

        let targetId = arr[zIndex].id;
        // orderByCate
        const apiData = {
          api: 'orderByCate',
          data: {
            sourceId: targetId,
            targetId: id
          }
        }
        await this.$store.dispatch('fetchAllList', apiData);
        this.init()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      },
      /**
       * [handleNodeClick 编辑分类信息]
       * @author luke 2018-10-24
       */
      async handleNodeClick(data) {
        // 清空数据
        this.clearData()
        this.title = '修改'
        // 获取一级分类数据
        this.getDetailCate();
        const apiData = {
          api: 'getCatalogInfo',
          data: {},
          apiName: data.id
        }
        this.$store.dispatch('fetchGetById', apiData).then(json => {
          this.currentData = json
          // 如果是二级分类就展开
          if (this.currentData.parentId !== 0) {
            this.currentData.chooseCategory = 1;
          } else {
            this.currentData.chooseCategory = 0;
          }
        })
      },
      /**
       * [getCatList 获取产品分类接口]
       * @author luke 2018-10-24
       */
      async getCatList(data) {
        const apiCat = {
          api: 'getCatImgList',
          data: {
            categoryId: data.categoryId
          }
        }
        const json = await this.$store.dispatch('fetchGetAll', apiCat)
        // type: 0
        for (let i = 0; i < json.list.length; i++) {
          const ths = json.list[i]
          // 默认值
          if (ths.type === 0) {
            this.catList = ths
          }
          // 移动图片
          if (ths.type === 1) {
            this.catHover = ths
          }
        }
      },
      /**
       * [handleNode 新建树选择]
       * @author luke 2018-09-14
       */
      handleNode(data) {
        this.parentDirectory = data.categoryName
        let childFlag = 0
        if (data.childrenCatalogs && data.childrenCatalogs.length > 0) {
          childFlag = data.childrenCatalogs.length
        }
        this.currentData.parentId = data.categoryId
        this.currentData.childFlag = childFlag
        this.isMove = false
      },
      /**
       * [saveCatalog 修改菜单]
       * @author luke 2018-09-13
       */
      saveCatalog() {
        const c = this.currentData
        if (c.categoryName === '') {
          this.$message('分类标题不能为空');
          return ''
        }
        const apiData = {
          api: 'updateCatalog',
          data: {
            id: c.id,
            parentId: c.parentId,
            childFlag: c.childFlag,
            bannerUrl: c.bannerUrl,
            categoryName: c.categoryName,
            title: c.title,
            keyword: c.keyword,
            description: c.description,
            sort: c.sort,
            state: c.state,
            parentCategoryName: '',
            remark: c.remark
          }
        }
        this.$store.dispatch('fetchAllList', apiData).then(json => {
          // 清空数据
          this.clearData()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.init();
        }).catch((json) => {
					this.$message({
						type: 'error',
						message: json.message
					})
				})
      },
      /**
       * [clearData 清空图片地址]
       * @author luke 2018-10-25
       * @return {[type]} [description]
       */
      clearData() {
        this.pcImgObj = {
          pcImg: undefined
        } // pc Banner图片对象
        this.currentData = {}
        this.title = ''
      },
      /**
       * [addCatalog 添加菜单列表]
       * @author luke 2018-09-13
       */
      addCatalog() {
        const c = this.currentData
        if (c.categoryName === '' || c.categoryName === undefined) {
          this.$message('分类标题不能为空');
          return false
        }
        const apiData = {
          api: 'addCatalog',
          data: {
            id: c.id,
            parentId: c.parentId,
            childFlag: c.childFlag,
            bannerUrl: c.bannerUrl,
            categoryName: c.categoryName,
            title: c.title,
            keyword: c.keyword,
            description: c.description,
            sort: c.sort,
            state: c.state,
            parentCategoryName: '',
            remark: c.remark
          }
        }
        this.$store.dispatch('fetchAllList', apiData).then(json => {
          // this.jsonData = json
          // this.currentData.categoryId = json.category_id
          this.parentDirectory = ''
          // 清空数据
          this.clearData()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.init();
        }).catch((json) => {
					this.$message({
						type: 'error',
						message: json.message
					})
				})
      },
      filterNode(value, data) {
        if (!value) return true
        return data.categoryName.toLocaleUpperCase().indexOf(value.toLocaleUpperCase()) !== -1
      },
      /**
       * [setNormdal 设置上传的值]
       * @author luke 2018-10-24
       */
      setPcImg(obj) {    
        this.fileKeyPc = obj.filePath
        const c = this.currentData
        c.bannerUrl = obj.filePath
      },
      removePcKey(url) {
        const apiData = {
          api: 'delBanners',
          data: {
            ids: this.pcImgObj.id
          }
        }
        this.$store.dispatch('fetchGetAll', apiData)
      },
      // 输入产品名称
      enterProductName() {
        // const queryD = this.$route.query
        const re = /^\s*$/
        // 只有新增的时候自动带
        if (this.title !== '修改') {
          if (!re.test(this.currentData.categoryName)) {
            const urlKey = this.currentData.categoryName.trim().replace(/\s+/g, '-').toLowerCase()
            this.$set(this.currentData, 'urlKey', urlKey)
          } else {
            this.currentData.urlKey = ''
          }
        }
      }
    },
    components: {
      upload
    }
  }
</script>
<style lang='scss' scoped>
  .category{
    padding: 10px;
    display: flex;
    .block {
      width: 48%;
      padding: 20px;
      margin-right: 20px;
      background: #fff;
      box-shadow: 0 0 3px #bbb;
      border-radius: 4px;
      h2{
        margin: 0px;
        margin-bottom: 10px;
      }
      .item{
        padding: 8px;
        display: flex;
        label {
          width: 120px;
          text-align: right;
          margin-right: 4px;
          line-height: 32px;
          display: inline-block;
        }
      }
    }
  }
</style>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
