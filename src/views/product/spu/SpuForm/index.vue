<template>
  <div>
    <!-- label-width="80px"写在form的好处是里面的item都会继承宽度 -->
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <!-- v-model再把收集的数据双向到data对应存储位置 -->
        <el-select v-model="spu.tmId" placeholder="请选择品牌" :value="tradeMarkList">
          <!-- label是选中展示的数据 -->
          <!-- value是要收集的数据 -->
          <el-option v-for="(tm,index) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" :rows="4" placeholder="SPU描述">
        </el-input>
      </el-form-item>
      <!-- 这里用的是照片墙 -->
      <el-form-item label="SPU图片">
        <!-- action：图片上传的地址，前边用过，用一样的 -->
        <!-- file-list：上传的文件列表，是一个数组，这样可以一次长传多个 -->
        <!-- 注意数组中对象元素的属性是要对应的，name:,url:而我们的不对应 -->
        <!-- :on-preview :on-remove 预览 | 删除图片时触发的回调 -->
        <!-- on-success是上传成功的回调 -->
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList" :on-success="handlerSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- v-model的值为当前被选中的el-option的 value 属性值 -->
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectAttrList.length}项未选择`">
          <el-option v-for="unSelect in unSelectAttrList" :key="unSelect.id" :label="unSelect.name " :value="`${unSelect.id}:${unSelect.name}`">
          </el-option>
        </el-select>
        <!-- :disabled="!attrId",空串是false,所以加取反 -->
        <!-- disabled为true是启用隐藏，false是关闭隐藏 -->
        <el-button type="primary" size="small" icon="el-icon-plus" style="margin-left: 8px" :disabled="!attrIdAndAttrName" @click="addSaleAttr">
          添加销售属性
        </el-button>
        <el-table border :data="spu.spuSaleAttrList" style="margin-top:10px" width="width">
          <el-table-column type="index" label="序号" prop="" width="80px" align="center"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName" width="160px"></el-table-column>
          <el-table-column label="属性值名称列表" prop="" width="">
            <!-- 饿了么标签组件Tag -->
            <!-- closable:是否可关闭 -->
            <!-- :disable-transitions：是否用渐变动画 -->
            <!-- row是当前商品的销售属性,包括所有当前属性的属性值数组和当前属性名数据 -->
            <!-- row.spuSaleAttrValueList是当前商品的销售属性的属性值数组 -->
            <template #default="{row,$index}">
              <el-tag v-for="(tag,index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" style="margin-right:10px" @close="row.spuSaleAttrValueList.splice(index,1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" size="small" class="input-new-tag" @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">
                添加
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" width="160px">
            <template #default="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">
          保存
        </el-button>
        <el-button type="" @click="cancel">
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
      spu: {
        // 平台的id
        tmId: 0,
        // 三级分类id
        category3Id: 0,
        // 描述文本框数据
        description: 'string',
        // 'id': 0,添加时用不到，修改时又会自动添加，所以干掉
        // spu名称数据
        spuName: 'string',
        // 图片数据
        spuImageList: [
          {
            id: 0,
            imgName: 'string',
            imgUrl: 'string',
            spuId: 0
          }
        ],
        // 平台属性与属性值收集
        spuSaleAttrList: [
          // {
          // 'baseSaleAttrId': 0,
          // 'id': 0,
          // 'saleAttrName': 'string',
          // 'spuId': 0,
          // 'spuSaleAttrValueList': [
          //   {
          //     'baseSaleAttrId': 0,
          //     'id': 0,
          //     'isChecked': 'string',
          //     'saleAttrName': 'string',
          //     'saleAttrValueName': 'string',
          //     'spuId': 0
          //   }
          // ]
          // }
        ]
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      dialogImageUrl: '',

      dialogVisible: false,

      // 收集未选择的属性id,数据收集到哪里无所谓，只要能整理成服务器要的样子就行
      attrIdAndAttrName: ''
    }
  },
  computed: {
    // 属性未选择的个数：
    // saleAttrList是全部三个属性
    // spu.spuSaleAttrList是当前商品拥有的属性
    // 我们要对比这两个数组，筛选出一个新的数组给下拉框
    unSelectAttrList() {
      // 过滤三属性的数组返回一个新数组
      return this.saleAttrList.filter(item => {
        // 这里要返回true和false，利用every的返回值
        return this.spu.spuSaleAttrList.every(element => {
          return item.name !== element.saleAttrName
        })
      })
    }
  },
  methods: {
    // 修改按钮父组件调用的发请求函数
    async initSpuData(spu) {
      // console.log(spu)
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      // console.log(spuResult)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      // console.log(tradeMarkResult)
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 图片数据spu中是空的，数据在这个接口
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      // console.log(spuImageResult)
      if (spuImageResult.code === 200) {
        // 照片墙要的对象属性我们没有，所以要把拿到的数据处理一下再存储
        const listArr = spuImageResult.data
        // 把每个数组元素中都加两个属性为了照片墙
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 再把数据存储
        this.spuImageList = listArr
      }
      // 这个销售属性是一个全的属性只包括颜色尺码版本和对应id，spu中的是对应商品的信息
      const saleResult = await this.$API.spu.reqBaseSaleAttrlist()
      // console.log(saleResult)
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // file代表点击删除的当前图片信息，只要收集删除的图片信息就够了，其他的已经在data中了不用动直接带给服务器
    // fileList代表删除后剩余的图片
    handleRemove(file, fileList) {
      // 收集到原处，对于已有的图片我们是经过处理，有name和url属性的，而服务器不需要，提交之前要处理
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    // file代表预览的当前图片信息
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个属性
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },
    // 添加按钮，图片上传成功的回调，
    handlerSuccess(response, file, fileList) {
      console.log(fileList)
      this.spuImageList = fileList
    },
    // 属性名添加按钮收集 下拉框 选中的数据
    addSaleAttr() {
      // 把我们字符串数据进行分割,返回的是一个数组，我们解构出来，要与服务器要求的名字对应
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向spu对象的属性数组里添加,属性值在tag上，这一步还没有，先把坑弄好，之后再填
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 在把收集的数据置空
      this.attrIdAndAttrName = ''
    },
    // 属性值添加按钮
    addSaleAttrValue(row) {
      // console.log(row)
      // 给row绑响应式属性,控制显示隐藏
      this.$set(row, 'inputVisible', true)
      // v-model收集数据，存放在这里
      this.$set(row, 'inputValue', '')
    },
    // 属性名输入框blur事件
    handleInputConfirm(row) {
      // console.log(row)
      // 将收集的数据放到数组进行展示
      const { baseSaleAttrId, inputValue } = row
      // 判断输入的数据
      if (inputValue.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      // 判断重复也可以用some

      const result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== inputValue)
      if (!result) {
        this.$message('属性值不能重复')
        return
      }

      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    // 保存按钮
    async addOrUpdateSpu() {
      // 整理参数：spu是我们要带给服务器的，其中的一些数据已经是对的了，不用整理
      // 照片墙数据没有收集到spu，所以最后要整理到spu中，照片墙的图片已有的图片有两个属性imgurl和imgname，但新增的图片没有
      // 新图的imgname属性就是name属性，但imgurl不是url属性，url是图片本地地址，我们要的地址在response.data中
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imageName: item.name,
          // &&是做判断的前面真则执行后面，||也是判断，前面假则执行后面
          // ||前面是针对新图的操作，后面是针对原有的图片操作
          imageUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发请求：注意系统的数据是会报错的，可以换一个数据测试
      const result = await this.$API.spu.reqAddOrUpdatesSpu(this.spu)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        // 回到展示页面
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 父组件添加按钮调用的发请求函数
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      // console.log(tradeMarkResult)
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      const saleResult = await this.$API.spu.reqBaseSaleAttrlist()
      // console.log(saleResult)
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 取消按钮跳转，清空数据
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清理数据
      // Object.assign:es6中新增的方法可以合并对象
      // 组件实例this._data,可以操作data当中响应式数据
      // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      console.log(this._data)
      console.log(this.$options.data())
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style >
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
