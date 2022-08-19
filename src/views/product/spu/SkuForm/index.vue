<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="(attr,index) in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <!-- 收集平带属性要带给服务器的数据 -->
              <el-option v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.saleAttrIdAndValueId" placeholder="请选择">
              <el-option v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!-- selection-change事件	当选择项发生变化时会触发该事件 有一个参数 -->
        <el-table style="width:100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column label="" width="80" type="selection"></el-table-column>
          <el-table-column label="图片">
            <template #default="{row,$index}">
              <img :src="row.imgUrl" style="width:100px">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #default="{row,$index}">
              <!-- 点击则变按钮 -->
              <el-button v-if="row.isDefault === 0" type="primary" size="mini" @click="changeDefault(row)">
                设为默认
              </el-button>
              <el-button v-else type="" size="mini">
                默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">
          保存
        </el-button>
        <el-button @click="cancel">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 父组件发请求的数据
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      spu: {},
      // 要发给服务器的大汇总，我们自己写的data
      skuInfo: {
        // 不用带给服务器的
        // 'createTime': '2022-08-18T03:16:45.474Z',
        // 'id': 0,添加操作不用id
        // 'isSale': 0,

        // 1、父组件给了的：
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 2、需要v-model收集的，初始值为空
        skuName: '', // sku名称
        price: 0, // 商品价格
        skuDefaultImg: '', // 商品默认展示图片
        skuDesc: '', // 商品描述
        weight: '', // 商品重量
        // 3、需要自己书写代码的，先写成空数组
        // 平台属性
        skuAttrValueList: [
          {
            // attrId: 0,
            // valueId: 0
            // 只要收集上面两个就行
            // 'attrName': 'string',
            // 'id': 0,
            // 'skuId': 0,
            // 'valueName': 'string'
          }
        ],
        // 图片信息
        skuImageList: [
          // {
          //   'imgName': 'string',
          //   'imgUrl': 'string',
          //   'isDefault': 'string',
          //   'spuImgId': 0
          //    只要收集上面两个就行
          //   'id': 0,
          //   'skuId': 0,
          // }
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   'saleAttrId': 0,
          //   'saleAttrValueId': 0,
          //    只要收集上面两个就行
          //   'id': 0,
          //   'saleAttrName': 'string',
          //   'saleAttrValueName': 'string',
          //   'skuId': 0,
          //   'spuId': 0
          // }
        ]
      },
      // 父组件传过来的row
      // 收集的图片数据：
      imageList: []
    }
  },
  methods: {
    // 获取sku数据，sku一共要获取三个
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 图片数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      // console.log(spuImageResult)
      if (spuImageResult.code === 200) {
        const list = spuImageResult.data
        list.forEach(element => {
          element.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性数据
      // 这个销售属性是一个全的属性只包括颜色尺码版本和对应id，spu中的是对应商品的信息
      const saleResult = await this.$API.spu.reqSpuSaleAttrList(spu.id)

      if (saleResult.code === 200) {
        this.spuSaleAttrList = saleResult.data
      }
      // 平台属性数据
      const skuResult = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)

      if (skuResult.code === 200) {
        this.attrInfoList = skuResult.data
      }
    },
    // 表格复选框，当选择项发生变化时会触发该事件
    handleSelectionChange(params) {
      // 参数返回的是一个对象数组，每点击一个商品，就向数组添加一个商品对象，对象中有图片数据但不全,
      // 少一个isDefault属性，可以在发请求数据时给图片信息加上
      // console.log(params)
      this.imageList = params
    },
    // 设为默认按钮，排他思想
    changeDefault(row) {
      // 先让全部isDefault变为0
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      // 点击的置1
      row.isDefault = 1
      // skuInfo里面有默认图片属性，是收集来的，我们这里点击默认按钮就是在收集数据，然后给skuInfo
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮
    cancel() {
      // 切换页面
      this.$emit('changeScenes', 0)
      // 清空子组件数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮
    async save() {
      // 整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // 方法一：
      // const arr = []
      // attrInfoList.forEach(item => {
      //   if (item.attrIdAndValueId) {
      //     // 变量赋值操作：
      //     const [attrId, valueId] = item.attrIdAndValueId.split(':')
      //     // 两个变量可以直接用
      //     const obj = { attrId, valueId }
      //     arr.push(obj)
      //   }
      // })
      // skuInfo.skuAttrValueList = arr
      // 方法二：
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        // console.log(prev)每一次循环就向prev里加一个对象，注意return
        return prev
      }, [])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        // console.log(prev)每一次循环就向prev里加一个对象，注意return
        return prev
      }, [])
      // 勾选的图片我们整理到了imageList这个属性中，现在整理到spuInfo
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      const result = await this.$API.spu.reqAddSku(skuInfo)
      console.log(result)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        // 切换页面
        this.$emit('changeScenes', 0)
      }
    }
  }
}
</script>

<style>
</style>
