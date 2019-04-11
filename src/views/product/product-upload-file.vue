<template>
  <div class="product-upload-file">
    <div v-for="(item, index) of currentValue" :key="index" class="product-file-item">
      <span class="el-icon-remove-outline" title="删除该类型所有附件" @click="deleteFiles(index)" />
      <i style="margin-right: 5px;color: red;">*</i>
      <el-select v-model="item.attachmentCode" class="product-edit-input">
        <el-option v-for="opitem in fileTypeData" :key="opitem.dicCode" :label="opitem.description" :value="opitem.dicCode" />
      </el-select>：
      <!-- <file-upload v-model="item.fileList"></file-upload> -->
      <ul class="upload-file-lists">
        <div v-for="(file, ii) of item.waringFiles" :key="ii" class="file-lists-item">
          <li class="file-name">{{ file.name }}</li><li class="file-size">{{ file.fileSize }}</li>
          <li class="file-status">
            {{ file.uploadStatus | setStatus }}
            <span v-if="file.uploadStatus===3||file.uploadStatus===4||file.uploadStatus===7">({{ file.progress }})</span>
          </li>
          <li class="file-operate"><i title="点击删除该文件" class="el-icon-close" @click="deleteItemFile(index, ii)" /></li>
          <div class="file-lists-progress progress progress-striped active">
            <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" :style="{width: file.progress}" />
          </div>
        </div>
        <webupload-file
          ref="webuploadFile"
          :upload-index="index"
          @onFileQueued="onFileQueued"
          @onMd5Progress="onMd5Progress"
          @onMd5FileSuccess="onMd5FileSuccess"
          @onProgress="onProgress"
          @uploadSuccess="uploadSuccess"
          @uploadError="uploadError"
        />
        <div :id="'uploadId'+index" class="web-upload-file-add" title="添加上传文件" />
      </ul>
    </div>
    <el-button @click="addProductFile">添加附件类型</el-button>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth.js'
import fileUpload from './file-upload.vue'
import WebuploadFile from './web-upload-file.vue'
export default {
  components: { fileUpload, WebuploadFile },
  filters: {
    setStatus(val) {
      return val === 2 && '等待上传' || val === 3 && 'MD5计算中' || val === 4 && '文件上传中' || val === 5 && '上传成功' || val === 7 && '正在查询下载地址' || val === 6 && '上传失败' || ''
    }
  },
  props: {
    value: Array
  },
  data() {
    const fileTypeData = JSON.parse(window.localStorage.getItem('treeVoListData')).filter(item => item.code === 'ATTACHMENT_CODE_TYPE') // 从数据字段中获取文件类型列表
    return {
      fileTypeData: fileTypeData[0].dicItemVos,
      currentValue: []
    }
  },
  watch: {
    value(val) {
      this.setCurrentValue()
    }
  },
  created() {
    this.registerFunc() // 注册上传组件全局钩子
    this.setCurrentValue()
  },
  destroyed() {
    WebUploader.Uploader.unRegister('beforeSend') // 销毁WebUploader注册的全局钩子
  },
  methods: {
    setCurrentValue() { // 格式化文件列表一个文件类型对应多个文件  fileList存放最终上传后的有效文件 waringFiles文件列表区域操作数据
      const cuValue = {}
      this.value.forEach(item => {
        cuValue.hasOwnProperty(item.attachmentCode)
          ? cuValue[item.attachmentCode].push({ name: item.attachmentName, url: item.attachmentUrl, attachmentSuffix: item.attachmentSuffix })
          : cuValue[item.attachmentCode] = [{ name: item.attachmentName, url: item.attachmentUrl, attachmentSuffix: item.attachmentSuffix }]
      })
      this.currentValue = []
      for (const i in cuValue) {
        this.currentValue.push({ attachmentCode: i, fileList: cuValue[i], waringFiles: JSON.parse(JSON.stringify(cuValue[i])) })
      }
    },
    getFileList() { // 获取组件附件数据
      const fileList = []
      let errorStatus = 0
      this.currentValue.forEach(item => { // 转换数据格式，后台需要按文件list
        const waringFiles = item.waringFiles.filter(file => {
          if (file.uploadStatus && file.uploadStatus !== 5 || !file.url) errorStatus = 1
          return file.url && file.name
        })
        fileList.push(...waringFiles.map(ii => {
          return { attachmentCode: item.attachmentCode, attachmentName: ii.name, attachmentUrl: ii.url, attachmentSuffix: ii.attachmentSuffix || ii.ext }
        }))
        if (!item.attachmentCode) errorStatus = 2 // 附件类型必填
      })
      if (errorStatus !== 0) this.$message.warning(errorStatus === 1 ? '请删除未成功上传的附件！' : '请选择附件类型')
      return errorStatus === 0 ? fileList : false
    },
    // 选择文件回调 上传状态 1未添加文件 2等待上传 3md5中 4上传中 5上传完成 6上传失败 7查询s3进度
    onFileQueued(file, index) { // 添加文件队列回调
      file.fileSize = WebUploader.Base.formatSize(file.size)
      this.currentValue[index].waringFiles.push({ name: file.name, fileSize: file.fileSize, id: file.id, ext: file.ext, uploadStatus: 3, progress: '0%' })
    },
    onMd5Progress(fileId, percentage, index) { // MD5进度
      this.currentValue[index].waringFiles.forEach(item => {
        if (item.id === fileId) item.progress = (percentage * 100 * 0.3).toFixed(2) + '%'
      })
    },
    onMd5FileSuccess(file, index) { // MD5成功
      this.currentValue[index].waringFiles.forEach(item => {
        if (item.id === file.id) item.uploadStatus = 4
      })
    },
    onProgress(fileId, percentage, index) { // 上传中
      this.currentValue[index].waringFiles.forEach(item => {
        if (item.id === fileId) item.progress = (30 + percentage * 100 * 0.6).toFixed(2) + '%'
      })
    },
    uploadSuccess(file, index) { // 上传成功
      this.currentValue[index].waringFiles.forEach(item => {
        if (item.id === file.id) {
          item.uploadStatus = 5
          item.url = file.url
          item.progress = '100%'
        }
      })
    },
    uploadError(fileId, index) {
      this.currentValue[index].waringFiles.forEach(item => {
        if (item.id === fileId) item.uploadStatus = 6
      })
    },
    addProductFile() {
      this.currentValue.push({ attachmentCode: '', fileList: [], waringFiles: [] })
    },
    addFileData(item, index) { // uploadStatus 上传状态 1未添加文件 2等待上传 3md5中 4上传中 5上传完成 6上传失败 7查询s3进度
      item.waringFiles.push({ uploadStatus: 1 })
    },
    deleteItemFile(index, ii) { // 删除文件
      this.$confirm('该操作将移除该文件（再次添加可继续上传），是否确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        const fileId = this.currentValue[index].waringFiles[ii].id
        if (fileId) this.$refs.webuploadFile[index].removeFile(fileId)
        this.currentValue[index].waringFiles.splice(ii, 1)
      }).catch(() => { this.$message.info('已取消操作') })
    },
    deleteFiles(index) {
      this.$confirm('是否确定删除该类型所有附件？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.currentValue.splice(index, 1)
      }).catch(() => { this.$message.info('已取消') })
    },
    registerFunc() { // HOOK 这个必须要再uploader实例化前面  注册上传钩子（坑爹的只有全局钩子）
      WebUploader.Uploader.register({ 'before-send': 'beforeSend' }, {
        name: 'beforeSend',
        beforeSend(block) { // 上传之前检查缺失分片
          const file = block.file
          const missChunks = file.missChunks
          const blockChunk = block.chunk
          const task = new $.Deferred()
          console.log(blockChunk, file)
          console.log('当前分块：' + blockChunk + '====当前缺失分片:' + JSON.stringify(missChunks))
          // 如果已经上传过 且在缺失的分片中不存在当前分片 则直接跳过 否则上传当前分片
          Object.prototype.toString.call(missChunks) === '[object Array]' && missChunks.indexOf(blockChunk.toString()) === -1 ? task.reject() : task.resolve()
          return $.when(task)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-upload-file{
    .product-file-item{
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      .upload-file-lists{
        padding: 10px;
        border: 1px dashed #dcdfe6;
        width: 800px;
        min-height: 32px;
        border-radius: 4px;
        .file-lists-item{
          position: relative;
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          height: 35px;
          line-height: 35px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          align-items: center;
          padding-right: 34px;
          li{
            position: relative;
            list-style: none;
            z-index: 99;
            padding: 0 10px;
            display: flex;
            align-items: center;
            .upload-file-start{
              height: 28px;
              padding: 6px 15px;
              margin-right: -5px;
            }
          }
          .file-name{
            width: 50%;
          }
          .file-operate i{
            cursor: pointer;
          }
          .file-lists-progress{
            position: absolute;
            width: 100%;
            z-index: 0;
            opacity: 0.4;
            margin-bottom: 0;
            height: 33px;
          }
          .file-operate{
            position: absolute;
            right: 0px;
          }
        }
        .upload-file-add{
          font-size: 20px;
          cursor: pointer;
        }
      }
      .el-icon-remove-outline{
        font-size: 20px;
        margin-right: 10px;
        cursor: pointer;
        &:hover{
          color: #409EFF;
        }
      }
      .product-file-item-up{
        margin-left: 20px;
        display: flex;
        align-items: center;
        .el-upload{
          margin-right: 20px;
        }
        .el-upload-dragger{
          width: 300px;
          height: 150px;
        }
      }
    }
  }
</style>
<style lang="scss">
  .web-upload-file-add{
    height: 33px;
    .webuploader-pick{
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
    }
    .webuploader-element-invisible{
      height: 32px;
    }
    label{
      margin-bottom: 0;
    }
  }
</style>
