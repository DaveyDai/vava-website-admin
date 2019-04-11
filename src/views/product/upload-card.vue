<template>
  <div class="upload-card" :class="(limit===1&&fileList.length>0) || (limit>1&&fileList.length>limit-1)?'is-hidden-upload':''">
    <el-upload
      name="multipartFileName"
      :action="actionUrl"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :on-error="onError"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="limit"
      :headers="{token: token}"
      :accept="accept"
      list-type="picture-card"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="" :visible.sync="centerDialogVisible" top="10vh" width="50%" center append-to-body>
      <div class="show-up-img">
        <img :src="diaUrl" class="upload-card-overview">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth.js'
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    },
    value: [String, Array]
  },
  data() {
    return {
      centerDialogVisible: false,
      fileList: [],
      actionUrl: `${process.env.BASE_UPLOAD}/vava-file-center/file/upload/0`,
      diaUrl: '',
      token: getToken('token'),
      filesType: ['gif', 'jpeg', 'jpg', 'png'],
      accept: 'image/gif,image/jpeg,image/png'
    }
  },
  watch: {
    value(val) {
      this.setFileList()
    }
  },
  created() {
    this.setFileList()
  },
  methods: {
    setFileList() {
      if (this.limit === 1) {
        this.fileList = this.value ? [{ name: '', url: this.value }] : []
      } else {
        this.fileList = this.value.map(url => { return { url: url } })
      }
    },
    handleRemove(file, fileList) {
      this.$emit('input', this.limit === 1 ? '' : fileList.map(item => item.url))
    },
    handlePreview(file) {
      this.diaUrl = file.url
      this.centerDialogVisible = true
    },
    beforeUpload(file) {
      const fileSize = file.size / 1024
      const isPassSize = this.limit === 1 ? 500 : 1024
      if (fileSize > isPassSize) {
        this.$message.warning('文件大小不能大于500KB')
        return false
      }
      const fileTypeName = file.name.split('.')
      const fileType = fileTypeName[fileTypeName.length - 1].toLowerCase()
      if (this.filesType.indexOf(fileType) === -1) {
        this.$message.warning('只支持gif,png,jpg,jpeg图片格式上传!')
        return false
      }
    },
    handleSuccess(response, file, fileList) {
      this.limit === 1 ? this.fileList = [{ name: response.data.fileName, url: response.data.filePath }] : this.fileList.push({ name: response.data.fileName, url: response.data.filePath })
      this.$emit('input', this.limit === 1 ? response.data.filePath : this.fileList.map(i => i.url))
    },
    onError(err) {
      this.$message.error('上传图片失败')
    }
  }
}
</script>

<style lang="scss">
  .show-up-img{
    width: 100%;
    max-height: 70vh;
    overflow: auto;
    .upload-card-overview{
      width: 100%;
    }
  }
  .is-hidden-upload .el-upload{ display: none; }
</style>

