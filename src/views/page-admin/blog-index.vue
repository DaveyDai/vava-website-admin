<template>
  <div class="main-blog">
    <h1>配置Banner*</h1>
    <div class="box-banner">
      <div class="item"> 
        <el-button type="text" @click="addBanner">添加Banner图</el-button>
      </div>
      <div class="item">
        <p class="name">图片列表展示:</p>
        <div class="banner">
          <div class="v-item rel" v-for="(item,index) in fileList" :key="index"> 
            <blog-upload :item="item" > </blog-upload>
            <el-input v-model="item.jumpUrl" style="width: 250px;" placeholder="http://"></el-input>
            <div class="abs-del" @click="delBanner(index)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- 下面配置板块内容 --> 
    <div class="box-plate">
       <p>配置板块内容（至少增加一个版块内容)<i style="color: red;">*</i></p>
       <!-- 新增版本内容 -->
       <el-button type="text"  @click="dialogFormVisible = true">新增版块内容</el-button>

       <!-- 弹出框编辑 fullscreen -->
        <el-dialog title="填写板块信息"  width="60%" :visible.sync="dialogFormVisible" label-width="180px" center >
          <el-form  ref="dynamicValidateForm">
            <el-form-item label="板块标题:"
              :rules="[
               { required: true, message: '请输入板块标题', trigger: 'blur' }
              ]">
              <el-input v-model="form.moduleTitle" autocomplete="off" style="width: 300px;"></el-input>
            </el-form-item>

            <el-form-item label="板块顺序:"
               :rules="[
               { required: true, message: '请输入板块顺序', trigger: 'blur' }
              ]" >
              <el-input type="number" v-model.number="form.sort" autocomplete="off" style="width: 300px;"></el-input>
            </el-form-item>

            <!-- 会有多个item -->
            <!-- 添加一个列表 -->
            <el-button type="primary" @click="addBlogList">添加一组列表</el-button>

            <div class="item rel" v-for="(item, index) in form.blogManagerModuleDetailVos" :key="index">
              <el-form-item :label="'板块'+ (index+1) + '主图片:'" >
                <!-- imageUrl -->
                <blog-upload :item="item" > </blog-upload>
              </el-form-item>

              <el-form-item label="图片标签:" >
                <el-radio v-model="item.labelCode" label="LABEL_NEW">New</el-radio>
                <el-radio v-model="item.labelCode" label="LABEL_SPECIAL">Special</el-radio>
                <el-radio v-model="item.labelCode" label="">Null</el-radio>
              </el-form-item>

              <el-form-item label="板块标题:"
                :rules="[
                { required: true, message: '请输入板块顺序', trigger: 'blur' }
                ]"
              >
                <el-input v-model="item.title" placeholder="请输入内容" style="width: 300px;"></el-input>
              </el-form-item>

             <el-form-item label="板块描述:" 
             :rules="[
               { required: true, message: '请输入板块顺序', trigger: 'blur' }
              ]"
               >
                <el-input v-model="item.description" placeholder="请输入内容" style="width: 300px;"></el-input>
              </el-form-item>

              <el-form-item label="跳转链接:" 
              :rules="[
               { required: true, message: '请输入板块顺序', trigger: 'blur' }
              ]">
                <el-input v-model="item.jumpUrl" placeholder="http://" style="width: 300px;"></el-input>
              </el-form-item>
              <div class="abs-del" @click="delManager(index)">
                <i class="el-icon-delete"></i>
              </div>
            </div>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </div>
        </el-dialog>

       <!-- 新增版块内容 -->
       <div class="plate-list">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="moduleTitle"
              label="标题">
            </el-table-column>
            <el-table-column
              prop="sort"
              label="顺序">
            </el-table-column>

            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="updateBlog(scope.$index, scope.row)"
                  type="text"
                  size="small">
                  修改
                </el-button>
                <el-button
                  @click.native.prevent="delBlog(scope.$index, scope.row)"
                  type="text"
                  size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>

          </el-table>
       </div>

       <div class="box-operating">
          <el-button type="primary" @click="saveBlog">保存</el-button>
          <el-button>取消</el-button>
       </div>
    </div>
  </div>
</template>
<script>
 import blogUpload from './blogUpload.vue'
 export default {
    watch: {
    },
    data () {
      return {
        fileList: [],
        tableData: [],
        dialogFormVisible: false,
        form: {
          moduleTitle: '',
          sort: '',
          blogManagerModuleDetailVos: [{
            imageUrl: '',
            jumpUrl: '',
            title: '',
            labelCode: '',
            description: '' 
          },{
            imageUrl: '',
            jumpUrl: '',
            title: '',
            labelCode: '',
            description: '' 
          },{
            imageUrl: '',
            jumpUrl: '',
            title: '',
            labelCode: '',
            description: '' 
          }]
        },
        delBlogById: '' // 是否有删除对象
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
          api: 'getBlogMannager',
          data: {
            languageCode: 'l_en'
          }
        }
        this.$store.dispatch('fetchGetAll', apiData).then(json => {
          this.fileList = json.blogManagerBannerVos;
          this.tableData = json.blogManagerModuleVos;
        })
      },
      setImgUrl (file) {
        this.fileList.push(file);
      },
      /**
       * [addBanner 添加banner]
       * @author luke 2019-03-22
       */
      addBanner () {
        this.fileList.push({
          imageUrl: null,
          jumpUrl: ''
        })
      },
      /**
       * [addBlogList 添加博客里面主图]
       * @author luke 2019-03-22
       */
      addBlogList () {
        this.form.blogManagerModuleDetailVos.push({
          description: '',
          imageUrl: '',
          jumpUrl: '',
          labelCode: '',
          title: ''
        })
      },
      /**
       * 添加blog 列表
       */
      submitForm () {
        if (this.form.moduleTitle === '') {
          this.$message('请输入板块名称');
          return false;
        }
        if (this.form.sort === '') {
          this.$message('请输入板块排序');
          return false;
        }
        if (this.form.sort < 0) {
          this.$message('请输入板块排序要大于0');
          return false;
        }
        // 空值判断
        let managerList= this.form.blogManagerModuleDetailVos
        // if (managerList.length < 4) {
        //   this.$message('板块列表不能少于4组数据');
        //   return false;
        // }
        for (let index = 0; index < managerList.length; index++) {
          const ths = managerList[index];
          if (ths.imageUrl === '' || ths.jumpUrl === '' 
          || ths.description === '' || ths.title === '') {
            this.$message('请补充板块'+ (index + 1) + '信息');
            return false;
          }
        }
        // 判断是否是修改；
        if (this.delBlogById !== '') {
          this.tableData.splice(this.delBlogById, 1)
        }
        this.tableData.push(this.form);
        // 添加成功清除一下
        this.form = {
          moduleTitle: '',
          sort: '',
          blogManagerModuleDetailVos: [{
            imageUrl: null,
            jumpUrl: '',
            title: '',
            labelCode: '',
            description: '' 
          }]
        }
        // 关闭弹出框
        this.dialogFormVisible = false
      },
      delBlog (index, item) {
        this.tableData.splice(index, 1)
      },
      updateBlog (index, item) {
        this.delBlogById = index;
        this.form = item;
        // 打开弹出框
        this.dialogFormVisible = true;
      },
      /**
       * [saveBlog 最后保存]
       * @author luke 2019-03-21
       */
      saveBlog () {
        const apiData = {
          api: 'saveBlogManager',
          data: {
            languageCode: 'l_en',
            blogManagerBannerVos: this.fileList,
            blogManagerModuleVos: this.tableData
          }
        }
        this.$store.dispatch('fetchAllList', apiData).then(json => {
          // 成功
          this.$message({
            message: '保存信息成功',
            type: 'success'
          });
          this.init()
        }).catch((json) => {
					this.$message({
						type: 'info',
						message: json.message
					})
				})
      },
      delBanner (index) {
        this.fileList.splice(index, 1)
      },
      delManager (index) {
        this.form.blogManagerModuleDetailVos.splice(index, 1)
      } 
    },
    components: {
      "blog-upload": blogUpload
    }
 }
</script>

<style lang='scss'>
  .main-blog {
    width: 100%;
    padding: 15px;
    .box-banner {
      .item{
         display: flex;
        .name {
          width: 200px;
          text-align: right;
          display: inline-block;
          line-height: 32px;
          font-size: 14px;
          margin-right: 4px;
        }
        .banner {
          width: 1000px;
        }
        .v-item {
          width: 50%;
          display: inline-block;
          margin-right: 10px;
          margin-bottom: 40px;
          .file-img {
            width: 250px;
            height: 150px;
            border: 1px solid #c0ccda;
            border-radius: 6px;
            box-sizing: border-box;
            cursor: pointer;
          }
        }
        
      }
      
    }
    .box-plate {
      border-top: 1px solid #ccc;
      .item {
        margin-top: 15px;
        padding-top: 20px;
        border-top: 1px solid #ccc; 
      }
    }
    .el-form-item__label {
      width: 150px;
      text-align: right;
    }
    .box-operating {
      margin-top: 30px;
      text-align: center;
    }
    .abs-del {
			position: absolute;
			right: 20px;
			top: 20px;
			cursor: pointer;
		}
  }
</style>