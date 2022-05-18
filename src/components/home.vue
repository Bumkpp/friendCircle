<template>
  <div>
    <router-view />
    <van-tabbar
      route
      fixed
      placeholder
    >
      <van-tabbar-item
        replace
        to="/homepage"
        icon="wap-home"
      >首页</van-tabbar-item>
      <van-tabbar-item
        replace
        to="/help"
        icon="friends"
      >求助</van-tabbar-item>
      <van-tabbar-item
        replace
        to="/self"
        icon="manager"
      >个人</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
</script>

<style scoped>
.van-tabbar {
  height: 6% !important;
  background-color: #eee;
}
</style>
