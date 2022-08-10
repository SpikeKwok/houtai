// 将四个模块的请求接口函数统一向外暴露，方便后期组件中使用
import * as trademark from './product/trademark'
import * as spu from './product/spu'
import * as sku from './product/sku'
import * as attr from './product/attr'

// 对外暴露
// 可以挂载到vue原型上，这样可以在任意的组件中使用这些函数
export default {
  trademark,
  sku,
  spu,
  attr

}
