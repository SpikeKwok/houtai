<template>
  <div>
    <!-- inline代表一行可以放多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <!-- 一 -->
      <el-form-item label="一级菜单" style="margin-right:30px;">
        <!-- select数据可以用过v-model收集，但收集的是它的value -->
        <!-- 注意：这个change事件是自定义事件 ， 是ui自带的事件，选中值发生变化时触发-->
        <el-select v-model="cForm.category1Id" :disabled="show" placeholder="请选择" value="" @change="handler1(cForm.category1Id)">
          <el-option v-for="(c1,index) in list1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>

      <!-- 二 -->
      <el-form-item label="二级菜单" style="margin-right:30px;">
        <el-select v-model="cForm.category2Id" :disabled="show" placeholder="请选择" value="" @change="handler2(cForm.category2Id)">
          <el-option v-for="(c2,index) in list2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>

      <!-- 三 -->
      <el-form-item label="三级菜单">
        <el-select v-model="cForm.category3Id" :disabled="show" placeholder="请选择" value="" @change="handler3(cForm.category3Id)">
          <el-option v-for="(c3,index) in list3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList() {
      const result = await this.$API.attr.reqCategory1List()
      // console.log(result)
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    async handler1(id) {
      // 一级触发时，二三要清空
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 给父组件发一级id，先解构出来
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 获取到选中的id，用来发请求，获取二级数据
      const result = await this.$API.attr.reqCategory2List(id)
      // console.log(result)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    async handler2(id) {
      // 二级也是在变化时，三级置空
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      // 获取到选中的id，用来发请求，获取二级数据
      const result = await this.$API.attr.reqCategory3List(id)
      // console.log(result)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    async handler3() {
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style>

</style>
