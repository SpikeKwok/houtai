import request from '@/utils/request'
// 获取spu展示数据/admin/product/{page}/{limit}
// 这个接口可以传的数据有很多，路径上只有这两个，其他的可以用params传
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }})
// spu信息数据，row中的id就是要用的spuId,tmId是品牌id不要弄混
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })
// 品牌下拉框数据
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })
// 对应图片数据
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
// 销售属性下拉框数据
export const reqBaseSaleAttrlist = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })
// 修改和删除页面的保存按钮
export const reqAddOrUpdatesSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request({ url: `/admin/product/updateSpuInfo`, data: spuInfo, method: 'post' })
  } else {
    return request({ url: `/admin/product/saveSpuInfo`, data: spuInfo, method: 'post' })
  }
}
// 展示页删除spu的接口
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// skuForm模块

// 获取销售属性的数据
// /admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性的数据
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// skuForm保存按钮，添加SKU
// /admin/product/saveSkuInfo  post
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

// 获取SKU列表数据的接口
// GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })

