<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="black"
    class="el-menu-vertical-demo"
    text-color="#fff"
    router
    :default-active="activeIndex"
  >
    <el-menu-item link>
      <el-image
        style="width: 50px; height: 50px"
        :src="logoUrl"
        @click="isC"
      ></el-image>
    </el-menu-item>

    <el-menu-item index="/index">
      <el-icon><home-filled /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="/dashboard">
      <el-icon><DataAnalysis /></el-icon>
      <span>仪表盘</span>
    </el-menu-item>

    <el-sub-menu :index="menu.path" v-for="menu in menuList">
      <template #title>
        <el-icon><svg-icon :icon-class="menu.icon" /></el-icon>
        <span>{{ menu.name }}</span>
      </template>
      <el-menu-item
        :index="item.path"
        v-for="item in menu.children"
        @click="openTab(item)"
      >
        <el-icon><svg-icon :icon-class="item.icon" /></el-icon>
        <span>{{ item.name }}</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {
  HomeFilled,
  User,
  Tickets,
  Goods,
  DocumentAdd,
  Management,
  Setting,
  Edit,
  SwitchButton,
  Promotion,
  DataAnalysis,
} from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import store from "@/store";
import { getServerUrl } from "@/util/request";

const logoUrl = ref(getServerUrl() + "image/userAvatar/fly_logo.png");
const menuList = ref(store.getters.GET_MENULIST);

const openTab = (item) => {
  store.commit("ADD_TABS", item);
};

// const isCollapse = ref(false);
// const isC = () => {
//   isCollapse = !isCollapse;
// };
const activeIndex = ref("/index");

watch(
  store.state,
  () => {
    console.log("editableTabsValue=" + store.state.editableTabsValue);
    activeIndex.value = store.state.editableTabsValue;
    console.log("store.state.activeIndex=" + store.state.activeIndex);
    console.log("activeIndex.value=" + activeIndex.value);
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo .el-menu-item:hover {
  color: #ffd04b;
}
.el-menu-vertical-demo .el-sub-menu:hover {
  color: #ffd04b;
}
</style>
