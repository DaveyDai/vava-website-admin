<template>
  <!-- 上传组件 -->
  <div class="conn-upload">
    <el-upload
       list-type="picture-card"
       :action="uploadApi"
       :limit="1"
       name="multipartFileName"
       :headers= "{'token': token}"
       :multiple="false"
       :on-error="onError"
       :on-success="handleAvatarSuccess"
       :on-preview="handlePictureCardPreview"
       :before-upload="beforeAvatarUpload"
       :on-remove="handleRemove"
       :file-list="fileImgUrl !== '' && fileImgUrl !== null && fileImgUrl !== undefined ? [{ url: fileImgUrl }] : []"
       >
         <i class="el-icon-plus "></i>
         <span class="name">{{ title }}</span>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" >
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth.js'
export default {
  data() {
    let api = `${process.env.BASE_UPLOAD}/vava-file-center/file/upload/0`
    // console.log(this.getToken('brandId'));
    // console.log(api)
    let token = getToken('token');
    return {
      imgUrl: '',
      dialogVisible: false,
      uploadApi: api,
      token
    }
  },
  computed: {
    ...mapGetters([
      'langId',
      'brandId'
    ])
  },
  props: {
    title: {
      type: String
    },
    fileImgUrl: {
      type: String
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.fileKey = res.data.filePath
      this.$emit('fileKey', res.data)
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    handlePictureCardPreview(file) {
      this.imgUrl = file.url
      this.dialogVisible = true
    },
    /**
     * [handleRemove 删除]
     * @author luke 2018-10-24
     */
    handleRemove(file, fileList) {
      let data = {
        filePath: null
      }
      this.$emit('fileKey', data)
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt1M = file.size / 1024 / 1024 < 1
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过1MB!')
      }
      return isLt1M
    },
    /**
     * 上传报错是
     */
    onError(err) {
      this.$message({
        type: 'error',
        message: err
      })
    }
  }
}
</script>

<style lang='scss'>
  .conn-upload {
    margin-left: 8px;
    display: block;
    margin-bottom: 8px;
    .name {
      line-height: 20px;
      font-size: 14px;
      width: 80px;
      display: block;
      text-align: center;
      margin: 0 auto;
      margin-top: -44%;
    }
  }
</style>