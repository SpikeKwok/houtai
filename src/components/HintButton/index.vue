<template>
  <!-- 不能加div，不然就竖排排列了 -->
  <a :title="title" style="margin:10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  // 鼠标移上来有提示，要父组件传
  props: ['title']
}
</script>

<style>

</style>
