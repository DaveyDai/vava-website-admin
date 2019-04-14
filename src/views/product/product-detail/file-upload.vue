<template>
  <el-upload
    name="multipartFileName"
    :action="actionUrl"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="onError"
    :on-remove="handleRemove"
    :file-list="fileList"
    :headers="{token: token}"
    drag
    class="product-file-item-up"
  >
    <i class="el-icon-upload" /><div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>
</template>
<script>
import { getToken } from '@/utils/auth.js'
export default {
  props: {
    value: Array
  },
  data() {
    return {
      actionUrl: `${process.env.BASE_UPLOAD}/vava-file-center/file/upload/0`,
      fileList: this.value,
      token: getToken('token')
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.$emit('input', this.fileList)
    },
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 1024) {
        this.$message.warning('文件大小不能大于1GB')
        return false
      }
    },
    handleSuccess(data, file, fileList) {
      const fileTypeName = file.name.split('.')
      const fileType = fileTypeName[fileTypeName.length - 1].toLowerCase()
      this.fileList.push({ name: file.name, url: data.data.filePath, attachmentSuffix: fileType })
      this.$emit('input', this.fileList)
    },
    onError(err) {
      this.$message.error('上传图片失败')
    }
  }
}
</script>

<style lang="scss">
  .product-upload-file{
    .product-file-item{
      margin-bottom: 15px;
      display: flex;
      align-items: center;
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
