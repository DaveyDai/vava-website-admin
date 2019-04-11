<template>
  <div v-loading="loading" class="product-list">
    <div class="admin-page-card">
      <div class="admin-page-card-body product-operation">
        <el-input v-model="searchParam.condition.searchName" class="product-operation-input product-operation-item" placeholder="keywords" @change="searchKeyProduct" @keyup.native.enter="searchProduct" />
        <el-button class="product-operation-item" icon="el-icon-search" type="primary" @click="searchProduct">搜索</el-button>
        <router-link class="product-operation-item" to="/product-add"><el-button icon="el-icon-plus" type="warning">添加产品</el-button></router-link>
      </div>
    </div>
    <div class="admin-page-card">
      <div class="admin-page-card-body">
        <el-table :data="productListData.records" border>
          <el-table-column type="index" label="序号" width="50" align="center" />
          <el-table-column v-for="(columnItem, index) in listTableTitle" :key="index" :prop="columnItem.key" :label="columnItem.title" align="center" :width="columnItem.width">
            <template slot-scope="scope">
              <div v-if="columnItem.isStatus">
                <el-switch v-model="scope.row[columnItem.key]" active-color="#13ce66" inactive-color="#dcdfe6" @change="changeProStatus(scope.row)" />
              </div>
              <div v-else>{{ scope.row[columnItem.key] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div class="e-body-table-op">
                <span title="点击编辑" @click="showProductEdit(scope.row)">编辑</span>
                <span title="点击删除" @click="deleteProduct(scope.row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="productListData.total>0" class="admin-page-card-pagination">
          <el-pagination :page-size="searchParam.pageSize" :current-page="searchParam.pageNo" :total="productListData.total" :page-sizes="pageArrar" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSize" @current-change="handleCurrent" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageConfig from './product-config.js'
export default {
  data() {
    return {
      listTableTitle: pageConfig.listTableTitle,
      productListData: { records: [], total: 0 },
      pageArrar: [10, 50, 100, 200],
      searchParam: {
        condition: { searchName: '' },
        pageSize: 10,
        pageNo: 1
      },
      loading: false
    }
  },
  mounted() {
    // this.searchProduct()
  },
  methods: {
    searchProduct() {
      this.loading = true
      this.$store.dispatch('fetchAllList', { api: 'searchProduct', data: this.searchParam }).then(data => {
        this.productListData = data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        this.$message.error(error || '获取数据失败, 请尝试刷新重试')
      })
    },
    searchKeyProduct() {
      this.searchParam.pageNo = 1
      this.searchProduct()
    },
    handleSize(val) { // 切换条数
      this.searchParam.pageSize = val
      this.searchParam.pageNo = 1
      this.searchProduct()
    },
    handleCurrent(val) { // 切换页码
      this.searchParam.pageNo = val
      this.searchProduct()
    },
    changeProStatus(row) {
      this.$confirm(row.state ? '是否确定开启?' : '是否确定关闭?', '提示', { confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }).then(() => {
        const queryParam = { updateType: Number(row.state), ids: [row.id] }
        this.loading = true
        this.$store.dispatch('fetchAllList', { api: 'updateStateProductInfo', data: queryParam }).then(data => {
          this.$message.success('修改成功!')
          this.loading = false
        }).catch((err) => {
          row.state = !row.state
          this.$message.error(error || '修改失败')
          this.loading = false
        })
      }).catch(() => {
        row.state = !row.state
        this.$message.info('已取消')
      })
    },
    showProductEdit(row) {
      this.$router.push('/product-edit?id=' + row.id)
    },
    deleteProduct(row) {
      this.$confirm('是否确定删除?', '提示', { confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }).then(() => {
        const queryParam = { updateType: 2, ids: [row.id] }
        this.loading = true
        this.$store.dispatch('fetchAllList', { api: 'updateStateProductInfo', data: queryParam }).then(data => {
          this.$message.success('删除成功!')
          this.searchKeyProduct()
        }).catch((err) => {
          this.$message.error(error || '删除失败')
          this.loading = false
        })
      }).catch(() => { this.$message.info('已取消') })
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-list{
    width: 100;
    padding: 10px;
    .product-operation{
      display: flex;
      flex-wrap: nowrap;
      padding: 15px;
      .product-operation-input{
        width: 300px;
      }
      .product-operation-item{
        margin: 0 15px;
      }
    }
    .e-body-table-op span{
      color: #0000ee;
      text-decoration: underline;
      margin: 0 10px;
      cursor: pointer;
    }
  }
</style>
