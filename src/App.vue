<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
  #app{
    min-width: 1366px;
    overflow: auto;
  }
  .admin-page-card{
    background-color: #FFF;
    border: 1px solid #e5e5e5;
    margin-bottom: 15px;
    .admin-page-card-title{
      width: 100%;
      height: 28px;
      line-height: 28px;
      background-color: #d7d7d7;
      font-size: 14px;
      font-weight: bold;
      color: #383737;
      padding-left: 30px;
    }
    .admin-page-card-body{
      padding: 10px;
      .card-from-input-width{
        width: 200px;
      }
      .table-op-icon{
        color: #f39c12;
        font-size: 18px;
        cursor: pointer;
      }
      .table-op-icon{
        margin:0 5px;
      }
    }
    .admin-page-card-pagination{
      margin-top: 10px;
      padding-left: 10px;
    }
  }
</style>
