<template>
  <el-select
    v-model="value"
    clearable
    placeholder="Select"
    @click="HandleGetUserListOption"
  >
    <el-option
      v-model="form"
      v-for="item in options"
      :key="item.tostring"
      :label="item.label"
      :value="item.tostring"
    />
  </el-select>
</template>

<script  setup>
import { reactive, ref } from "vue";
import requestUtil, { getServerUrl } from "@/util/request";
import { getUserListOption, queryUserById } from "@/api/sys/user";

const form = reactive([
  {
    value: "",
    label: "",
  },
]);
const value = ref([
  {
    value: "",
    label: "",
  },
]);
const options = ref([
  {
    label: "",
    value: "",
  },
]);

const HandleGetUserListOption = async () => {
  const result = await getUserListOption();
  options.value = result.data.userListForOptions;
  console.log("value.value==", value.value);
};
</script>
