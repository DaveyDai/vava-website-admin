<template>
	<div class="home-conn">
		<!-- 配置banner* -->
		<div class="box-banner">
			<p class="title">配置Banner</p>
			<div class="item">
				<p class="name">Banner样式</p>
				<el-select v-model.lazy="jsonData.bannerType" @change="changeBanner"  placeholder="请选择">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
			</div>
			<div class="item" v-if="!isShow">
				<p class="name">Banner图列表:</p> 
				<div style="flex: 1">
					<div class="v-item" 
					v-for="(item,index) in jsonData.bannerImages" :key="index"> 
							<blog-upload :item="item" > </blog-upload>
							<el-input v-model="item.jumpUrl" style="width: 250px;" placeholder="http://"></el-input>
						</div>
				</div>
			</div>
		</div>

		<!-- 产品图 -->
		<div class="box-product">
			<p class="title">配置首页产品图*</p>
			<div class="item" v-for="(item,index) in jsonData.productImages" :key="index">
				<blog-upload :item="item" > </blog-upload>
            <el-input v-model="item.jumpUrl" style="width: 250px;" placeholder="http://"></el-input>
			</div>
		</div>

		<!-- 配置SOCIAL MEDIA图 -->
		<div class="box-social">、
			<div >
				<p class="title">配置SOCIAL MEDIA图*</p>
				<!-- 添加一组socaial -->
				<el-button type="text" @click="addSocial" style="font-size: 18px;padding-left: 20px;">添加SOCIAL MEDIA图</el-button>
			</div>
			<div class="item rel" v-for="(item,index) in jsonData.socialMediaImages" :key="index">
				<blog-upload :item="item" > </blog-upload>
        <el-input v-model="item.jumpUrl" style="width: 250px;" placeholder="http://"></el-input>
			  <div class="abs-del" @click="delSocial(index)">
					<i class="el-icon-delete"></i>
				</div>
			</div>
		</div>
		<!-- 提交保存 -->
		<div class="box-op">
		   <el-button type="primary" @click="saveHome">保存</el-button>
       <el-button>取消</el-button> 
		</div>
	</div>
</template>
<script >
import blogUpload from '../blog/blogUpload.vue'
 export default {
    watch: {
    },
    data () {
      return {
				value: '',
				isShow: false,
        options: [{
         value: 0,
         label: '无设置'
        }, {
         value: 1,
         label: '滚动式'
        }, {
         value: 2,
         label: '平铺式'
        }],
        jsonData: {
        	bannerImages: []
        }
      }
    },
    mounted: function() {
      // getMoreCatalog
      this.init()
    },
    methods: {
      init () {
        // 获取分类数据
        const apiData = {
          api: 'getHomeList',
          data: {
            languageCode: 'l_en'
          }
        }
        this.$store.dispatch('fetchGetAll', apiData).then(json => {
          this.jsonData = json;
          console.log(json);
        })
      },
      /**
       * [saveHome 保存]
       * @author luke 2019-03-22
       */
      saveHome () {
				// 无设置清空数组  不要清空
				// if (this.jsonData.bannerType === 0 ) {
				// 	this.jsonData.bannerImages = [];
				// }
				const apiData = {
          api: 'saveHome',
          data: {
            bannerType: this.jsonData.bannerType,
            languageCode: 'l_en',
            bannerImages: this.jsonData.bannerImages,
            productImages: this.jsonData.productImages,
            socialMediaImages: this.jsonData.socialMediaImages
          }
        }
        this.$store.dispatch('fetchAllList', apiData).then(json => {
        	this.$message({
	          message: '保存信息成功',
	          type: 'success'
	        });
          // 成功
          this.init()
        }).catch((json) => {
					this.$message({
						type: 'info',
						message: json.message
					})
				})
			},
			/**
			 * 下拉列表选择
			 */
			changeBanner () {
				let bannerType = this.jsonData.bannerType;
				this.isShow = bannerType === 0 ? true : false;
				if (bannerType === 0 ){
					// this.jsonData.bannerImages = [];
				} else if(bannerType === 2) {
					if (this.jsonData.bannerImages.length === 3) {
						// 不用添加
					} else {
						this.jsonData.bannerImages = [{
							jumpUrl: '',
							imageUrl: null
						},{
							jumpUrl: '',
							imageUrl: null
						},{
							jumpUrl: '',
							imageUrl: null
						}]
					}
					// this.jsonData.bannerImages.length = 3;
				} else {
					this.jsonData.bannerImages = [{
							jumpUrl: '',
							imageUrl: null
						},{
							jumpUrl: '',
							imageUrl: null
						},{
							jumpUrl: '',
							imageUrl: null
						},{
							jumpUrl: '',
							imageUrl: null
						},{
							jumpUrl: '',
							imageUrl: null
						}]
				}
			},
			addSocial () {
				this.jsonData.socialMediaImages.push({
					imageUrl: '',
					jumpUrl: ''
				})
			},
			delSocial (index) {
				this.jsonData.socialMediaImages.splice(index, 1)
			}
    },
    components: {
      "blog-upload": blogUpload
    }
    
  }
</script>
<style lang='scss'>
  .home-conn {
  	.title {
  		font-size: 24px;
  		font-weight: bold;
  		margin-left: 20px;
  	}
	  .box-banner {
	  	.item {
				width: 100%;
				display: flex;
	  		.name {
	  			width: 200px;
	  			text-align: right;
	  			margin-right: 4px;
					display: inline-block;
	  		}
				.v-item {
					width: 40%;
					display: inline-block;
					margin-bottom: 20px;
				}
	  	}
	  }
	  .box-product {
	  	padding: 10px;
	  	margin: 0 auto;
	  	.item {
	  		width: 48%;
	  		padding: 0px 10%;
	  		display: inline-block;
	  		margin-bottom: 20px;
	  	}
	  }

	  .box-social {
	  	padding: 10px;
	  	margin: 0 auto;
	  	.item {
	  		width: 48%;
	  		padding: 0px 10%;
	  		display: inline-block;
	  		margin-bottom: 20px;
	  	}
	  }
		.abs-del {
			position: absolute;
			right: 20px;
			top: 0px;
			cursor: pointer;
		}
	  .box-op {
      margin-top: 30px;
      text-align: center;
    }










 }
</style>