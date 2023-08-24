<template>
  <div class="app-wrapper">
    <el-container>
      <el-header><Header /></el-header>
      <el-container>
        <el-aside width="200px" class="sidebar-container"><Menu /></el-aside>
        <el-container>
          <el-main
            ><Tabs />
            <router-view />
          </el-main>
          <el-footer><Footer /></el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>


<script setup>
import Menu from "@/layout/menu";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Tabs from "@/layout/tabs";
</script>


<style scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.sidebar-container {
  background-color: black;
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-header {
  padding-left: 0px;
  padding-right: 0px;
}

:deep(ul.el-menu) {
  border-right-width: 0px;
}
</style>











<!-- ---------------------------------------------------------------------------------------- -->

<!-- <template>
  <el-button type="danger" @click="testHandler">测试接口</el-button>
  <el-button type="primary" @click="testLogoutHandler"
    >测试logout接口</el-button
  >
</template>
 <script setup>
import requestUtil from "@/util/request";
const testHandler = async () => {
  let result = await requestUtil.get("test/user/list");
};
const testLogoutHandler = async () => {
  let result = await requestUtil.get("logout");
};
</script>
 <style scoped>
</style> -->