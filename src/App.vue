<template>
  <router-view />
  <!-- <el-button type="primary" @click="handleLogin">测试登录</el-button>
  <el-button type="danger" @click="handleUserList">测试获取用户数据</el-button> -->
</template>

<script setup>
import requestUtil from "@/util/request";
import store from "./store";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const whitePath = ["/login", "/index", "/"];

const mounted = () => {
  this.$router.afterEach((to) => {
    document.title = "飞流工作室后台";
  });
};

watch(
  route,
  (to, from) => {
    console.log("to" + to.name);
    console.log(to.path);

    if (whitePath.indexOf(to.path) === -1) {
      console.log("to.path=" + to.path);
      let obj = {
        name: to.name,
        path: to.path,
      };

      store.commit("ADD_TABS", obj);
    }
  },
  { deep: true, immediate: true }
);
</script>
<style>
html,
body,
#app {
  height: 100%;
  font-family: DingTalkJinBuTi;
}

.app-container {
  font-family: DingTalkJinBuTi;
  padding: 20px;
}
</style>
