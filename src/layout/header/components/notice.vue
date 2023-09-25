<template>
  <el-dropdown size="large" class="noticeIcon">
    <el-badge :value="12">
      <el-icon size="large"><Bell /></el-icon>
    </el-badge>

    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="通知" name="first">通知</el-tab-pane>
          <el-tab-pane label="代办" name="second">代办</el-tab-pane>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import { Bell } from "@element-plus/icons-vue";

import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";

const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>
<style>
.noticeIcon.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  width: 300px;
  height: 340px;
}
.noticeIcon .demo-tabs {
  border-bottom: 1px solid grey;
}
.noticeIcon {
  margin-right: 30px;
}
</style>