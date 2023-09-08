<template>
  <el-drawer :v-model="ApproveDrawerVisible" :title="processTitle" size="40%">
    <div class="process_info">
      <el-descriptions title="申请信息">
        <el-descriptions-item label="流程名称:">{{
          processInfo.processName
        }}</el-descriptions-item>
        <el-descriptions-item label="申请人:">{{
          processInfo.applyUserId
        }}</el-descriptions-item>
        <el-descriptions-item label="申请理由:">{{
          processInfo.applyReason
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div>
      <el-button type="primary">同意</el-button>
      <el-button type="warning">拒绝</el-button>
      <el-button type="danger">退回</el-button>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import { defineEmits, defineProps, ref, watch } from "vue";
import { GetStepListByProcessId } from "@/api/approval/approval";
const props = defineProps({
  processId: {
    type: String,
    default: "",
    required: true,
  },

  ApproveDrawerVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});
const processTitle = ref("");
const processInfo = ref({
  createdBy: "common",
  updatedBy: "common",
  createdDt: "2023-09-08T02:31:54.000+00:00",
  updatedDt: "2023-09-08T02:31:54.000+00:00",
  remark: null,
  processId: "7e59c09b-c34d-43a3-bc26-6f562d149c0d",
  processName: "从开始流程",
  applyUserId: "common",
  currentStepId: null,
  applyDt: "2023-09-08T02:31:54.000+00:00",
  processStatus: 0,
  applyReason: "不方便范冰冰的发表",
});

watch(
  () => props.ApproveDrawerVisible,
  () => {
    const processId = props.processId;
    console.log("watch监控processId=" + processId);
    if (processId != "1") {
      HandleGetCurrentProcessInfo(processId);
    }
  }
);

//=====接口调用部分===========================================================

const HandleGetCurrentProcessInfo = async (processId) => {
  const result = await GetStepListByProcessId(processId);
  if (result.data.code == 200) {
    processTitle.value = result.data.processInfo.processName;
    processInfo.value = result.data.processInfo;
  }
};

//===========================================================================
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("确定关闭吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>
<style>
.process_info {
  height: 600px;
}
</style>