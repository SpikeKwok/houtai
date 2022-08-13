import request from '@/utils/request'
// 三级菜单，写在全局组件
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1`, method: 'get' })
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })
// 父组件拿三个参数发请求展示属性
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
// 添加|修改属性
export const reqAddOrUpdateAttr = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'post', data })
