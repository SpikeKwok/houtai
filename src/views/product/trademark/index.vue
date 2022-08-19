<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" style="margin:10px 0" @click="showDialog">
      添加
    </el-button>

    <!-- 表格 -->
    <!--
      data是表格要展示的数据，一定是数组类型的
      表格是一列一列的，每一列都是el-table-column，代表一列
      border是表格边框
      label是显示的标题字符串形式
      width对应列的宽度
      align标题对其方式
    -->
    <el-table style="width=100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column label="品牌名称" prop="name"></el-table-column>
      <el-table-column label="品牌LOGO" prop="headImg">
        <!--
        作用域插槽显示图片,直接写prop显示字符串路径，要用作用域插槽
        table组件会把响应数组里的数据进行回传
        table回传，这一列接收，这一列就成父级了，可以使用作用域插槽了
        row是数组中的每一条数据，
        $index是数组每个元素相应的索引值
        -->
        <template #default="{row,$index}">
          <img :src="row.headImg" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">
            修改
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- page-sizes:页面上更改每页显示条数的选项，类似下拉菜单，设定可选的条数值 -->
    <!-- size-change事件	pageSize 改变时会触发 -->
    <el-pagination style="margin-top:20px; text-align: center;" :total="total" :current-page="page" :page-size="limit" :page-count="7" :page-sizes="[3,5,10]" layout="prev,pager,next,jumper,sizes,total" @current-change="getPageList" @size-change="handlerSizeChange"></el-pagination>

    <!-- 对话框 -->
    <!-- :visible.sync控制对话框显示与隐藏 -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- 表单 -->
      <!-- :model="form"，1把表单数据收集到哪个对象身上，2将来表单验证也要用到 -->
      <!-- Form 组件提供了表单验证的功能，只需要通过 `rules` 属性传入约定的验证规则，并将 Form-Item 的 `prop` 属性设置为需校验的字段名即可。el-form必须要有model属性 -->
      <el-form ref="ruleForm" :model="tmForm" :rules="rules">
        <!-- 对话框input -->
        <el-form-item label="品牌名称" label-width="100px" style="width:80%" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 对话框图片上传 -->
        <!--
        :on-success="handleAvatarSuccess"图片上传成功的回调
        :before-upload="beforeAvatarUpload"图片上传之前的回调 -->
        <!-- label-width:就是input前面几个字区域的宽度 -->
        <el-form-item label="品牌LOGO" label-width="100px" style="width:80%" prop="logoUrl">
          <!-- 这里用的上传组件，不能使用v-model收集数据，因为不是表单元素 -->
          <!-- action	必选参数，上传的地址 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 点击隐藏 -->
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="addOrUpdataTradeMark">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // value用户输入进来的文本
    // rule规则
    // callback放行函数
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称2-10位'))
      } else {
        callback()
      }
    }
    return {

      page: 1, // 代表当前第几页
      limit: 3, // 代表一页展示的条数
      // 上面两个是要传给服务器的
      // 下面两个是服务器数据
      total: 0, // 总共数据条数
      list: [], // 列表展示的数据
      // 对话框的显示与隐藏
      dialogFormVisible: false,
      // imgUrl:''
      // 收集品牌信息,这里的数据要直接放请求体发给后端，所以名字要和后端一致
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        // 品牌名称验证规则
        // 属性名就是要校验的数据：tmName,logoUrl
        tmName: [
          // required必填，minmax：字符数的限制，trigger用户触发提示的事件
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          // 我们可以自己写规则
          { validator: validateTmName, trigger: 'change' }
        ],
        // 上传图片验证规则
        // 这不是表单，是上传组件，用户行为对他无效，可以去掉
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ]
      }
    }
  },
  mounted() {
    // console.log(this.$API)测试
    this.getPageList()
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager
      // 结构出参数
      const { page, limit } = this
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      console.log(result)
      if (result.code === 200) {
        // 获取总数据条数和数据
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // limit:分页器自带的，是当前页展示的条数3/5/10
    handlerSizeChange(limit) {
      // console.log(limit)
      this.limit = limit
      this.getPageList()
    },
    // 添加按钮，点击显示对话框
    showDialog() {
      this.dialogFormVisible = true
      // 解决关闭对话框下次打开数据依然存在的问题
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    // 修改品牌
    updateTradeMark(row) {
      // row是当前用户选中的信息
      // 将已有的品牌信息给tmform进行展示即可
      // 有个问题：写完点取消，页面数据一样被修改了。因为是双向绑定，在input输入相当于直接修改表格数据，怎么办？
      this.dialogFormVisible = true
      // this.tmForm = row
      // 浅拷贝：让tmForm接收一份拷贝，而不是直接拿服务器的对象
      this.tmForm = { ...row }
    },
    // 上传图片相关的回调
    // 图片上传成功，成功之后页面上显示的是一个img在展示
    // 标签上v-if控制img的显示和隐藏，是+号和图片的切换
    // res是返回的是图片在服务器真实的地址，vue开发者工具中看到图片是本地的地址
    // file是返回的是图片的一些数据
    handleAvatarSuccess(res, file) {
      // console.log(res)
      // 数据收集
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      // 判断格式和大小
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 对话框确认按钮（添加品牌|修改品牌）
    async addOrUpdataTradeMark() {
      this.$refs.ruleForm.validate(async(success) => {
        // 验证成功则执行业务
        if (success) {
          // 点击就先隐藏
          this.dialogFormVisible = false
          // 发请求。有可能是添加或修改
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          // console.log(result)
          if (result.code === 200) {
            // 请求成功都要弹出一个小小的信息弹框,饿了么中的一个小组件$message
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            // 如果添加品牌：停留在第一页，修改品牌应该留在当前页
            this.getPageList(this.page)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除按钮，有弹框组件，row是表格标签的数据
    deleteTradeMark(row) {
      // console.log(this.list)
      this.$alert(`确定删除${row.tmName}品牌？`, '提示', {
        // 两个按钮文本
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // 按钮类型
        type: 'warning'
        // 用户点击确定按钮时会触发
      }).then(async() => {
        const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          // 成功弹窗
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        // 再次发起列表数据请求,注意，如果删除就向前跳页则page-1，若删除不用变页则留在当前页
        this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        // 用户点击取消按钮时触发
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }

}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
