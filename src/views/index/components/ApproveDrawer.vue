<template>
  <el-drawer
    :v-model="ApproveDrawerVisible"
    :title="processTitle"
    size="40%"
    :before-close="handleClose"
  >
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
      <br />
      <el-descriptions title="附件信息" />
      <el-upload
        v-model:file-list="attachmentFile"
        :on-preview="handlePreview"
        disabled
      >
      </el-upload>
    </div>
    <div>
      <el-form-item label="审批签字备注">
        <el-input
          type="textarea"
          v-model="stepOpLog.remark"
          class="stepOpLogRemark"
        ></el-input>
      </el-form-item>
      <el-button type="primary" @click="HandleUpdateStepStatusBtn(1)"
        >同意</el-button
      >
      <el-button type="warning" @click="HandleUpdateStepStatusBtn(2)"
        >拒绝</el-button
      >
      <el-button type="danger" @click="HandleUpdateStepStatusBtn(3)"
        >退回</el-button
      >
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { defineEmits, defineProps, ref, watch } from "vue";
import {
  GetStepListByProcessId,
  UpdateStepStatusBtn,
} from "@/api/approval/approval";
import store from "@/store";

const props = defineProps({
  processId: {
    type: String,
    default: "",
    required: true,
  },
  currentStepKeyId: {
    type: String,
    default: "",
    required: true,
  },

  noticeKeyId: {
    type: Number,
    default: -1,
    required: true,
  },
  ApproveDrawerVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});
const attachmentFile = ref([]);
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
//当前登录人信息
const currentUser = ref(store.getters.GET_USERINFO);
const token = ref(store.getters.GET_TOKEN);
//步骤操作日志对象
const stepOpLog = ref({
  token: token.value,
  username: currentUser.value.username,
  stepKeyId: "",
  processId: "",
  operateAction: 0,
  remark: "",
  createdBy: currentUser.value.username,
  updatedBy: currentUser.value.username,
  noticeKeyId: -1,
});
watch(
  () => props.ApproveDrawerVisible,
  () => {
    stepOpLog.value.stepKeyId = props.currentStepKeyId;
    stepOpLog.value.processId = props.processId;
    stepOpLog.value.noticeKeyId = props.noticeKeyId;
    console.log("watch监控processId=" + props.processId);
    console.log("watch监控noticeKeyId=" + props.noticeKeyId);
    console.log("watch监控currentStepKeyId=" + props.currentStepKeyId);
    if (props.processId != "1") {
      HandleGetCurrentProcessInfo(props.processId);
    }
  }
);

//附件预览/下载
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
  window.open(uploadFile.url);
};

//=====接口调用部分===========================================================

const HandleGetCurrentProcessInfo = async (processId) => {
  const result = await GetStepListByProcessId(processId);
  if (result.data.code == 200) {
    processTitle.value = result.data.processInfo.processName;
    processInfo.value = result.data.processInfo;
    attachmentFile.value = result.data.attachmentFile;
  }
};

const HandleUpdateStepStatusBtn = async (action) => {
  console.log("stepKeyId==", stepOpLog.value.stepKeyId);
  console.log("action==", action);
  console.log("approveSignRemark==", stepOpLog.value.remark);
  stepOpLog.value.operateAction = action;

  const result = await UpdateStepStatusBtn(stepOpLog.value);
  if (result.data.code == 200) {
    ElMessage.success("审批成功！");
    emits("HandleGetApprovalNoticeList");
    handleClose();
  }
};

//===========================================================================
const emits = defineEmits(["update:modelValue", "HandleGetApprovalNoticeList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};
</script>
<style>
.process_info {
  height: 600px;
}
.el-upload-list__item {
  line-height: 30px;
}
.stepOpLogRemark {
  height: 50px;
}
</style>