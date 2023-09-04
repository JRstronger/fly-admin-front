<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script lang="ts" setup>
import { computed, defineProps } from "vue";

const props = defineProps<{
  iconClass: string;
  className?: string;
  [prop: string]: unknown;
}>();

const iconName = computed(() => {
  return props.iconClass ? `#icon-${props.iconClass}` : "#icon";
});
const svgClass = computed(() => {
  return props.className ? `svg-icon ${props.className}` : "svg-icon";
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

