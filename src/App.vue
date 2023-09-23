<template>
  <router-view />
</template>

<script setup>
import store from "./store";
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const whitePath = ["/login", "/index", "/"];

onMounted(() => {
  const router = useRouter();
  const route = useRoute();

  const updatePageTitle = () => {
    const pageTitle = route.meta.title || "飞流工作室后台";
    document.title = pageTitle;
  };

  router.afterEach(() => {
    updatePageTitle();
  });

  // 初始化时设置页面标题
  updatePageTitle();
});

onUnmounted(() => {
  const router = useRouter();
  router.afterEach(() => {}); // 移除afterEach钩子函数
});

const pageTitle = computed(() => {
  return document.title || "飞流工作室后台";
});
watch(pageTitle, (newTitle) => {
  document.title = newTitle;
});

watch(
  () => route.path,
  (to, from) => {
    console.log("to: ", to);
    console.log("from: ", from);

    if (whitePath.indexOf(to) === -1) {
      console.log("to.path=" + to);
      let obj = {
        name: route.name,
        path: route.path,
      };

      store.commit("ADD_TABS", obj);
    }
  },
  { immediate: true }
);

///=====================================================================================
// 解决:在vue3中使用element-plus页面重置报ResizeObserver loop completed with undelivered notifications.
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
};

///=====================================================================================
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
.el-button {
  font-family: DingTalkJinBuTi;
}
</style>
