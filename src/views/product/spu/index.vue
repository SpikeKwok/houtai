<template>
  <div>
    <el-card style="margin:20px 0">
      <categorySelect :show="scene != 0" @getCategoryId="getCategoryId"></categorySelect>
    </el-card>
    <!-- 下面的卡片有三个按钮会切换页面 -->
    <el-card>
      <!-- 展示页面 -->
      <div v-show="scene==0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">
          添加SPU
        </el-button>
        <el-table style="width=100%" border :data="records">
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称"></el-table-column>
          <el-table-column prop="description" label="SPU描述"></el-table-column>
          <el-table-column prop="prop" label="操作">
            <template #default="{row,$index}">
              <hint-button type="success" size="mini" icon="el-icon-plus" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" size="mini" icon="el-icon-edit" title="修改sku" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" size="mini" icon="el-icon-info" title="查看当前spu全部sku列表" @click="handler(row)"></hint-button>

              <el-popconfirm :title="`确定删除?`" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top:20px; text-align: center;" :total="total" :current-page="page" :page-sizes="[3,5,10]" :page-size="limit" layout="prev,pager,next,jumper,->,sizes,total" @current-change="getSpuList" @size-change="handleSizeChange"></el-pagination>
      </div>

      <SpuForm v-show="scene==1" ref="spu" @changeScene="changeScene"></SpuForm>

      <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
    <!-- 嵌套表格的对话框 -->
    <el-dialog :title="`${spu.spuName}`" :visible.sync="dialogTableVisible" @close="close">
      <el-table v-loading="loading" :data="skuList" border>
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格" width="200"></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column property="" label="默认图片">
          <template #default="{row,index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './SkuForm/index'
import SpuForm from './SpuForm/index'
export default {
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      page: 1, // 代表当前第几页
      limit: 3, // 代表一页展示的条数
      category1Id: '',
      category2Id: '',
      category3Id: '',

      records: [],
      total: 0,
      scene: 0,
      dialogTableVisible: false, // sku信息的显示和隐藏
      spu: {},
      // 存储的是sku列表的数据
      skuList: [],
      // 加载组件的控制
      loading: true

    }
  },
  methods: {
    // 三级联动自定义事件，可以把子组件响应的id传给父组件
    getCategoryId({ categoryId, level }) {
      // 测试看看能不能拿到
      // console.log(categoryId)
      // 能拿到，但只是个数字，父组件无法区分是几级id,子组件换成对象传参，加一个属性区分
      if (level === 1) {
        this.category1Id = categoryId
        // 和子组件一样，菜单变了要置空下面的菜单
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 下面的卡片已经有三个id了，在第三id确定时，请求数据
        this.getSpuList()
      }
    },
    // 获取spu列表数据,需要limit,page,3id当参数
    // 和之前的分页器一样，可以写到更新数据里,page被声明过了，这里定义一个pager
    async getSpuList(pager = 1) {
      this.page = pager
      const { limit, page, category3Id } = this
      const result = await this.$API.spu.reqSpuList(limit, page, category3Id)
      // console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 分页器自带当前页变化的事件
    // 和之前的分页器一样，可以写到更新数据里
    // handleCurrentChange(page) {
    //   // console.log(page)
    //   this.page = page
    //   this.getSpuList()
    // }
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      // 再发请求
      this.getSpuList()
    },
    // 添加按钮
    addSpu() {
      this.scene = 1
      // 用组件标签来调用子组件函数
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 操作的修改按钮
    updateSpu(row) {
      this.scene = 1
      // 获取spuform子组件,那就能拿到子组件的数据和方法
      // console.log(this.$refs.spu)
      this.$refs.spu.initSpuData(row)
    },
    // spuForm子组件取消按钮控制页面切换
    changeScene(scene, flag) {
      // console.log(scene)测试
      this.scene = scene
      // 修改还是添加跳转的页面是不一样的
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu按钮
    async deleteSpu(row) {
      // console.log(row)
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 操作的添加按钮sku发请求
    addSku(row) {
      this.scene = 2
      // 接口需要用到的父组件数据传递过去
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // skuForm子组件取消按钮控制页面切换
    changeScenes(scene) {
      // console.log(scene)测试
      this.scene = scene
      // 修改还是添加跳转的页面是不一样的
      // if (flag === '修改') {
      //   this.getSpuList(this.page)
      // } else {
      //   this.getSpuList()
      // }
    },
    // 查看sku按钮的回调
    async handler(spu) {
      // 点击显示
      this.dialogTableVisible = true
      // 把row存起来
      this.spu = spu
      // 发请求
      const result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
      }
      // 加载效果关闭
      this.loading = false
    },
    // 小细活，关闭对话框之前的回调
    close() {
      // 加载效果重置
      this.loading = false
      // 展示清空数据
      this.skuList = []
    }
  }
}
</script>

<style>

</style>
