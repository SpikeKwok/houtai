// 这个模块主要负责品牌管理的数据
// 获取品牌列表接口
// /admin/acl/user/{page}/{limit}
// 引入他二次封装的axios
import request from '@/utils/request'
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/acl/user/${page}/${limit}`, method: 'get' })
