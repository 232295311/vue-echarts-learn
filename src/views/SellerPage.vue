<!-- 
    针对于/sellerpage这条路由显示出来的
    在这个组件中，通过子组件注册的方法，要显示出seller.vue组件
-->
<template>
  <div class="com-page">
    <seller></seller>
  </div>
</template>

<script>
import Seller from '@/components/Seller'
export default {
  data() {
    return {}
  },
  components: {
    seller: Seller
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
