<template>
  <div class="web-upload-file">
    <!-- <template v-if="fileData.id">
      <li class="file-name">{{fileData.name}}</li><li class="file-size">{{fileData.fileSize}}</li>
      <li class="file-status">
        {{fileData.uploadStatus | setStatus}}<span v-if="fileData.uploadStatus===3||fileData.uploadStatus===4||fileData.uploadStatus===7" :id="'progress' + fileData.upLoadId + fileData.id">(0%)</span>
      </li>
      <div class="file-lists-progress progress progress-striped active">
        <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" :id="fileData.upLoadId + fileData.id" style="width: 0%;"></div>
      </div>
    </template>
    <div class="web-upload-file-add" v-show="fileData.uploadStatus === 1" :id="fileData.upLoadId"></div>
    <li class="file-operate"><i title="点击删除该文件" class="el-icon-close" @click="removeFile"></i></li> -->
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  props: {
    data: Object,
    uploadIndex: Number // 当前文件列表的index 非文件列表则不需要此参数
  },
  data() {
    return {
      chunkSize: 5 * 1024 * 1024, // 分片大小(5mb)
      uploader: null, // 上传组件对象
      baseUrl: process.env.BASE_UPLOAD,
      fileData: { name: '', fileSize: '' }
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.initUpload()
    })
  },
  methods: {
    initUpload() {
      this.uploader = WebUploader.create({ // 创建上传对象
        pick: { id: '#uploadId' + this.uploadIndex, label: '点击添加文件', multiple: false },
        formData: { uid: 0, md5: '', chunkSize: this.chunkSize },
        swf: '/static/web-uploader/js/Uploader.swf',
        chunked: true, // 是否分片
        chunkSize: this.chunkSize, // 分片大小
        threads: 3,
        server: `${this.baseUrl}/vava-file-center/file/fileUpload`,
        auto: false,
        // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
        disableGlobalDnd: true,
        fileNumLimit: 2048,
        fileSizeLimit: 2048 * 1024 * 1024, // 2gb
        fileSingleSizeLimit: 2048 * 1024 * 1024 // 2gb
      })
      this.uploader.on('fileQueued', file => { // 选择文件回调 上传状态 1未添加文件 2等待上传 3md5中 4上传中 5上传完成 6上传失败 7查询s3进度
        this.$emit('onFileQueued', file, this.uploadIndex)
        this.fileMD5Option(file) // MD5校验
      })
      this.uploader.on('uploadBeforeSend', (obj, data, headers) => { // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
        data.md5 = obj.file.md5 || ''
        data.uid = obj.file.uid
        headers.token = Cookies.get('token')
      })
      this.uploader.on('uploadProgress', (file, percentage) => { // 上传中
        this.$emit('onProgress', file.id, percentage, this.uploadIndex)
      })
      // this.uploader.on('beforeFileQueued', file => { // 添加队列前
      //   if (file.size > 2048 * 1024 * 1024) this.$message.warning('文件太大，不能超过2GB！')
      // })
      this.uploader.on('uploadSuccess', file => { // 上传返回结果
        this.queryUploadProgress(file)
      })
      this.uploader.on('uploadError', file => { // 提示重新传文件
        this.$message.error('文件上传失败')
        this.$emit('uploadError', file.id, this.uploadIndex)
      })
      this.uploader.on('error', message => { // 提示重新传文件
        if (message === 'Q_EXCEED_SIZE_LIMIT') this.$message.warning('文件太大，不能超过2GB！')
        if (message === 'F_DUPLICATE') this.$message.warning('该文件已经存在!')
      })
    },
    fileMD5Option(file) { // MD5处理函数
      this.uploader.md5File(file).progress(percentage => { // 根据文件内容来查询MD5,并及时显示进度
        this.$emit('onMd5Progress', file.id, percentage, this.uploadIndex)
      }).then(val => { // 完成
        file.md5 = val
        file.uid = WebUploader.Base.guid()
        this.queryAjax(`/vava-file-center/file/checkFileMd5/${val}`, data => {
          const fileStatus = data.data.fileStatus
          this.$emit('onMd5FileSuccess', file, this.uploadIndex)
          switch (fileStatus) {
            case 1: // 忽略上传过程，直接标识上传成功；
              this.uploader.skipFile(file)
              file.url = data.data.filePath
              this.$emit('uploadSuccess', file, this.uploadIndex)
              break
            case 2: // 文件不存在，那就正常流程
              this.uploader.upload(file)
              break
            case 3: // 部分已经上传到服务器了，但是差几个模块。
              file.missChunks = data.data.missChunkList
              this.uploader.upload(file)
              break
            case 4: // 正在s3上上传
              this.uploader.skipFile(file)
              this.queryUploadProgress(file)
              break
          }
        }, '', file.id)
      })
    },
    startUpload(file) { // 开始上传
      this.uploader.upload(file)
    },
    getFiles() { // 获取文件列表
      return this.uploader.getFiles()
    },
    queryAjax(url, callback, type, data) { // ajax请求
      const that = this
      $.ajax({
        type: type || 'POST',
        url: this.baseUrl + url,
        headers: { 'token': Cookies.get('token') },
        success: callback,
        error(err) {
          that.$message.error(err.responseJSON.message || '上传失败')
          if (data) that.$emit('uploadError', data, that.uploadIndex)
        }
      })
    },
    queryUploadProgress(file) { // 上传成功后查询s3获取下载地址
      this.queryAjax(`/vava-file-center/file/selectUploadProgressByMd5/${file.md5}`, data => {
        console.log('s3:', data)
        const fileStatus = data.data.fileStatus
        if (fileStatus === 1 || fileStatus === 5) {
          file.url = data.data.filePath
          this.$emit('uploadSuccess', file, this.uploadIndex)
        }
        if (fileStatus === 4) {
          this.queryUploadProgress(md5)
        }
      }, 'GET', file.id)
    },
    removeFile(fileId) { // 移除上传队列
      this.uploader.removeFile(fileId, true) // 在队列中移除文件
    }
  }
}
</script>
