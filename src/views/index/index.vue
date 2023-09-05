<template>
  <el-select
    v-model="value"
    clearable
    placeholder="Select"
    @click="HandleGetUserListOption"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script  setup>
import { ref } from "vue";
import requestUtil, { getServerUrl } from "@/util/request";
import { getUserListOption, queryUserById } from "@/api/sys/user";
const value = ref("");
const options = ref([
  {
    label: "",
    value: "",
  },
]);

const HandleGetUserListOption = async () => {
  const result = await getUserListOption();
  options.value = result.data.userListForOptions;
};
</script>
