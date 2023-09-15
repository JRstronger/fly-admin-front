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
      :key="item.label"
      :label="item.label"
      :value="item.value"
    />
  </el-select>

  <el-row :gutter="10" style="margin-right: 0px">
    <el-col :span="4">
      <el-card shadow="always" @click="HandleGetApprovalNoticeList">
        <h1 class="top_num_list">12</h1>
        Always
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card shadow="hover">
        <h1 class="top_num_list">6</h1>
        Hover
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card shadow="never">
        <h1 class="top_num_list">3</h1>
        Never
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card shadow="never">
        <h1 class="top_num_list">23</h1>
        Never
      </el-card>
    </el-col>
  </el-row>

  <!-- 待处理 -->
  <el-card class="to_do_box_card">
    <template #header>
      <div class="card-header">
        <p>
          <el-icon><Memo /></el-icon>
          <span>&nbsp;&nbsp;代办流程</span>
        </p>
      </div>
    </template>
    <el-timeline class="to_do_box_card_timeline">
      <el-timeline-item
        v-for="item in noticeApprovalList"
        :key="item.keyId"
        :timestamp="item.sendDt"
        class="approval_item"
      >
        {{ item.title }}
        <el-button
          round
          size="small"
          style="float: right"
          @click="HandleToApprove(item.processId, item.stepKeyId, item.keyId)"
          >去审批</el-button
        >
      </el-timeline-item>
    </el-timeline>
  </el-card>

  <ApproveDrawer
    v-model="ApproveDrawerVisible"
    :ApproveDrawerVisible="ApproveDrawerVisible"
    :processId="processId"
    :currentStepKeyId="currentStepKeyId"
    :noticeKeyId="noticeKeyId"
    @HandleGetApprovalNoticeList="HandleGetApprovalNoticeList"
  />
</template>

<script  setup>
import { reactive, ref, watch } from "vue";
import requestUtil, { getServerUrl } from "@/util/request";
import { getUserListOption, queryUserById } from "@/api/sys/user";
import { Memo } from "@element-plus/icons-vue";
import { GetApprovalNoticeList } from "@/api/index/index";
import store from "@/store";
import ApproveDrawer from "./components/ApproveDrawer";
import { onMounted, onBeforeMount } from "vue";

//页面挂载之前
onBeforeMount(() => {
  HandleGetApprovalNoticeList();
});

//审批流程抽屉显示
const ApproveDrawerVisible = ref(false);

//根据审批流程的id打开抽屉
const processId = ref("");
//流程名称
const processTitle = ref("");
//步骤id
const currentStepKeyId = ref("");
const noticeKeyId = ref(-1);
//审批流程通知列表
const noticeApprovalList = ref([
  {
    keyId: "",
    stepKeyId: "",
    processId: "",
    type: "",
    sendUserId: 0,
    sendUsername: "飞流",
    receiveUserId: "",
    receiveUsername: "",
    title: "【刘亦菲】提交了【采样血液A23】流程",
    sendDt: "2023-08-15 12:34.56",
    status: 0,
  },
]);

//当前登录人信息
const currentUser = ref(store.getters.GET_USERINFO);
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

//=====接口调用部分===========================================================

const HandleGetUserListOption = async () => {
  const result = await getUserListOption();
  options.value = result.data.userListForOptions;
  console.log("value.value==", value.value);
};

const HandleGetApprovalNoticeList = async () => {
  const result = await GetApprovalNoticeList(currentUser.value.username);
  if (result.data.code == 200) {
    noticeApprovalList.value = result.data.noticeList;
    console.log("noticeApprovalList.value==", noticeApprovalList.value);
  }
};

const HandleToApprove = async (process_id, stepKeyId, nKeyId) => {
  console.log("process_id==", process_id);
  console.log("stepKeyId==", stepKeyId);
  console.log("noticeKeyId==", noticeKeyId);
  noticeKeyId.value = nKeyId;
  currentStepKeyId.value = stepKeyId;
  ApproveDrawerVisible.value = true;
  processId.value = process_id;
};

//================================================================
</script>
<style>
.top_num_list {
  font-size: 30px;
  color: blue;
  margin-bottom: 5px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.to_do_box_card {
  width: 480px;
}
.to_do_box_card_timeline {
  padding-top: 10px;
  padding-right: 8px;
  height: 400px;
  overflow-y: auto;
}
.approval_item:hover {
  color: rgb(19, 71, 212);
  font-weight: bold;
}
</style>