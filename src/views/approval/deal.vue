<template>
  <div>
    <div
      v-for="iconName in iconNames"
      :key="iconName"
      @click="selectIcon(iconName)"
    >
      <SvgIcon :iconClass="iconName" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import iconNames from "@/icons";

const selectedIcon = ref("");

function selectIcon(iconName: string) {
  selectedIcon.value = iconName;
}
</script>
