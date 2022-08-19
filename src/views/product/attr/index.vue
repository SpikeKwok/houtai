<template>
  <div>
    <!-- 三级选项卡片 -->
    <el-card style="margin-bottom:20px">
      <categorySelect :show="!isShowTable" @getCategoryId="getCategoryId"></categorySelect>
    </el-card>

    <!-- 属性显示，按钮切换卡片 -->
    <el-card>
      <!-- 属性显示 -->
      <div v-show="isShowTable">
        <!-- :disabled="category3Id?false:true"能实现按钮禁用，但不止这一个地方判断表格显示和隐藏，所以定义一个变量 -->
        <!-- :disabled="!category3Id"有数据则显示没有则隐藏 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">
          添加属性
        </el-button>
        <!-- 表格展示商品属性 -->
        <el-table border :data="attrList" :disabled="isShowTable" style="margin:20px 0">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column label="属性值列表" width="width">
            <!-- 这里用作用域插槽，el-table-column可以直接用data数据，但它的内容要用返回的数据 -->
            <template #default="{row,$index}">
              <!-- row是当前数组元素的数据 -->
              <el-tag v-for="(attrValueList,index) in row.attrValueList" :key="attrValueList.id" type="success" style="margin-right:10px">
                {{ attrValueList.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <!-- 两个按钮，也要用到id数据发请求，用插槽 -->
            <template #default="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加和修改按钮显示的页面 -->
      <div v-show="!isShowTable">
        <!-- 行内表单 -->
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <!-- 属性名收集 -->
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <!-- 两个按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">
          添加属性值
        </el-button>
        <el-button>取消</el-button>
        <!-- 添加的表格 -->
        <el-table border style="margin:20px 0" :data="attrInfo.attrValueList">
          <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{row,$index}">
              <!-- 自定义事件keyup要想绑enter要先变成原生事件 -->
              <!-- 绑定ref为$index,区分当前输入框 -->
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
              <span v-else style="display:block" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">
          保存
        </el-button>
        <el-button @click="isShowTable=true">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 控制输入框的显示和隐藏
      attrList: [],
      // 控制表格显示与隐藏的
      isShowTable: true,
      // 收集新增|修改属性使用的
      attrInfo: {
        // id:'', 属性名的id，每个属性名下的属性值，的id都跟属性名一致
        attrName: '', // 属性名
        categoryId: 0, // 三级分类的id,这里能不能写this.category3Id,不能，因为对象是无序存储，不知道谁先谁后
        categoryLevel: 3, // 服务器需要区分几级id
        attrValueList: [
          // 属性值，因为属性值可以有多个，所以用数组，每一个属性值都是一个对象，需要attrId,valueName
        ]
      }
    }
  },
  methods: {
    // 获取三个id
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
        this.getAttrList()
      }
    },
    // 三个id获取到之后发请求展示数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      // console.log(result)我们要的是一个对象数组，要把它存起来进行展示
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 添加|修改页面的 添加属性值 按钮
    addAttrValue() {
      // console.log(123)
      //  添加按钮应该向数组里面添加元素
      this.attrInfo.attrValueList.push({
        // 这里是添加属性名时的操作，属性名与属性值的id一致，我们自己写属性名就没有id，id是后端服务器生成的
        // 而修改时添加的是在原有的属性名上添加，他是有id的，所以这里添加的属性值也要和这里不能写undefined了
        // attrId: undefined,
        attrId: this.attrInfo.id,
        // 属性名由表单传入
        valueName: '',
        // 在创建时添加控制input的显示与隐藏
        flag: true
      })
      this.$nextTick(() => {
        // 获取相应的表单元素实现聚焦
        // console.log(this.$refs[index])
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 展示页面的 添加属性 按钮
    addAttr() {
      this.isShowTable = false
      // 清除添加页面的列表数据
      this.attrInfo = {
        attrName: '', // 属性名
        categoryId: this.category3Id, // 能点击按钮时代表三个id都有了，这个地方可以直接替换了
        categoryLevel: 3, // 服务器需要区分几级id
        attrValueList: [
          // 属性值，因为属性值可以有多个，所以用数组，每一个属性值都是一个对象，需要attrId,valueName
        ]
      }
    },
    // 展示页面的 修改 按钮
    updateAttr(row) {
      // console.log(row)row是点击的属性名数据，包含后台自带的属性名和属性值
      this.isShowTable = false
      // 将选中的属性赋值给attrinfo，不就直接在修改页展示要修改的数据了嘛
      // this.attrInfo = row
      // 但数据是双向绑定的，修改时即使点取消，也会修改
      // 复制一份给attrInfo供他展示
      // 用浅拷贝row的方式，属性名不会有影响了。但属性值会被影响，因为浅拷贝对于深层数据拷贝的是地址
      // 用深拷贝，引入loadash中的插件
      // 手写浅拷贝和深拷贝
      this.attrInfo = cloneDeep(row)
      // 点击修改按钮时，将相应属性值元素加上flag标记
      this.attrInfo.attrValueList.forEach(item => {
        // item.flag = false这样写不会生效，因为flag不是响应式数据
        // 用vue自带的一个方法：vue.$set:
        // 向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property
        // vue.$set(对象/数组，属性(字符串)/下标，值)
        this.$set(item, 'flag', false)
      })
    },
    // 属性值input的小细活，判断空输入，解决自带属性值没有flag，
    toLook(row) {
      // console.log(row)
      if (row.valueName.trim() === '') {
        this.$message('请输入一个正常属性名')
        return
      }
      // this.attrInfo.attrValueList是添加的所有属性值的数组
      // some一真即真，所以元素中有一项是相同即为真
      const repat = this.attrInfo.attrValueList.some(item => {
        // if的作用是将自己从数组中判断出去，只对比除自己之外的元素
        if (row !== item) {
          return item.valueName === row.valueName
        }
      })
      // console.log(repat)
      row.flag = false
    },
    // 解决切换显示input自动聚焦问题
    toEdit(row, index) {
      row.flag = true
      // console.log(this.$refs[index]) undefined
      // 获取不到，因为 ref 本身是作为渲染结果被创建的，在初始渲染的时候你不能访问它们 - 它们还不存在！$refs 也不是响应式的，因此你不应该试图用它在模板中做数据绑定。
      // 怎么办？用nextTick:页面渲染完成执行
      this.$nextTick(() => {
        // 获取相应的表单元素实现聚焦
        // console.log(this.$refs[index])
        this.$refs[index].focus()
      })
    },
    // ui的版本问题，新版本事件名是confirm，我们旧版本是onConfirm
    // 利用索引值删除属性值数组中的元素
    deleteAttrValue(index) {
      // 删除属性值操作不需要发请求
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮
    async addOrUpdateAttr() {
      // 先整理服务器需要的参数：属性值空的不要，flag属性不要
      // 过滤完的对象再存到data发给服务器
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 先过滤属性值为空的
        if (item.valueName !== '') {
          // 删除对象中属性的方法delete
          delete item.flag
          // 正常return后面是条件语句，我们条件用if做的操作，return一个turn给filter代表是符合条件的
          // 谁返回的ture谁就被执行操作了
          return true
        }
      })
      // 注意只能在个别属性名上成功，数据库数据是不让我们动的
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 再切换页面
        this.isShowTable = true
        // 提示保存成功
        this.$message({ type: 'success', message: '保存成功' })
        // 再获取数据
        this.getAttrList()
      } catch (error) {
        return this.$message('保存失败')
      }
    }
  }
}
</script>

<style>
</style>
