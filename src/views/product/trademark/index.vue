<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" style="margin:10px 0">添加</el-button>
    <!-- 表格 -->
    <!--
      data是表格要展示的数据，一定是数组类型的
      表格是一列一列的，每一列都是el-table-column，代表一列
      border是表格边框
      label是显示的标题字符串形式
      widt对应列的宽度
      align标题对其方式
    -->
    <el-table style="width=100%" border>
      <el-table-column label="序号" width="80px" align="center" />
      <el-table-column label="品牌名称" />
      <el-table-column label="品牌LOGO" />
      <el-table-column label="操作" />
    </el-table>
    <!-- 分页器 -->
    <el-pagination style="margin-top:20px; text-align: center;" :total="2" :current-page="6" :page-size="3" :page-sizes="[3,5,10]" layout="prev,pager,next,jumper,sizes,total" />
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$API)
  }
}
</script>

<style>

</style>
