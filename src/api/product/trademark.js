// 这个模块主要负责品牌管理的数据
// 获取品牌列表接口
// /admin/acl/user/{page}/{limit}
// 引入他二次封装的axios
import request from '@/utils/request'
// 获取管理用户分页列表
export const reqTradeMarkList = (page, limit) => request({ url: `admin/user/${page}/${limit}`, method: 'get' })
// 新增品牌，不用带id，所以带两个属性，品牌名称和logo
// 修改品牌，带上面三个，id要给服务器
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({ url: `/admin/product/baseTrademark/update`, data: tradeMark, method: 'put' })
  } else {
    return request({ url: `/admin/product/baseTrademark/save`, data: tradeMark, method: 'post' })
  }
}
// 删除品牌
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
