<template>
  <el-drawer
    :v-model="ApprovalModuleDrawerVisible"
    title="审批模板"
    size="50%"
    :before-close="handleClose"
  >
    <el-descriptions title="基本信息" />
    <el-form ref="formRef" :model="form" label-width="80px">
      <el-form-item label="模板名称">
        <el-input
          v-model="form.templateName"
          placeholder="请输入模板名称..."
        ></el-input>
      </el-form-item>
      <el-form-item label="模板描述">
        <el-input
          v-model="form.templateDesc"
          placeholder="请输入模板描述..."
        ></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="form.applyUserId" disabled></el-input>
      </el-form-item>

      <el-form-item label="抄送至">
        <el-select
          v-model="form.copyUserId"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          placeholder="请选择抄送给..."
          style="width: 240px"
          @click="HandleGetUserListOption"
        >
          <el-option
            v-for="item in select_approver_options"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-descriptions title="审批节点" />
    <el-timeline>
      <!-- 编辑 -->
      <el-timeline-item
        v-for="item2 in CurrentApprovalModuleData"
        v-model="item2.stepName"
        :label="item2.stepName"
        :key="item2.stepName"
        :value="item2.stepName"
        class="step_node_line"
      >
        <el-row class="step_node_item">
          <el-col :span="10">
            <el-form-item
              v-model="item2.stepName"
              :label="item2.stepName"
              :key="item2.stepName"
              :value="item2.stepName"
            >
              <el-select
                v-model="item2.approveUserId"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="3"
                placeholder="请选择审批人..."
                style="width: 240px"
                @click="HandleGetUserListOption"
              >
                <el-option
                  v-for="item in select_approver_options"
                  v-model="item.value"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-radio-group v-model="item2.nodeSignType">
              <el-tooltip
                class="box-item"
                effect="light"
                content="所有人都同意即可"
                placement="top-start"
              >
                <el-radio label="1" border>会签</el-radio>
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="light"
                content="任意一个同意即可"
                placement="top-start"
              >
                <el-radio label="2" border>或签</el-radio>
              </el-tooltip>
            </el-radio-group>
            <el-switch
              v-model="item2.isSkip"
              class="main-el-switch"
              active-text="开启跳过"
            ></el-switch>
          </el-col>

          <el-col :span="4" class="step_node_add_del">
            <span>&nbsp;&nbsp;</span>

            <el-tooltip
              class="box-item"
              effect="light"
              content="在此下方添加审批节点"
              placement="top-start"
            >
              <el-button
                type="primary"
                :icon="Plus"
                circle
                @click="HandleAddOrDelApprovalNode(item2.keyId, 'add')"
              />
            </el-tooltip>
            <span>&nbsp;&nbsp;</span>

            <el-tooltip
              class="box-item"
              effect="light"
              content="删除当前审批节点"
              placement="top-start"
            >
              <el-button
                type="danger"
                :icon="Delete"
                circle
                @click="HandleAddOrDelApprovalNode(item2.keyId, 'del')"
              />
            </el-tooltip> </el-col
        ></el-row>
      </el-timeline-item>
    </el-timeline>

    <div>
      <el-button type="primary" @click="HandleSaveApprovalTemplate"
        >创建</el-button
      >
    </div>
  </el-drawer>
</template>


<script setup>
import {
  defineEmits,
  defineProps,
  reactive,
  ref,
  onBeforeMount,
  watch,
} from "vue";
import store from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";
import requestUtil, { getServerUrl } from "@/util/request";
import { getUserListOption, queryUserById } from "@/api/sys/user";
import {
  SaveApprovalTemplate,
  GetTemplateList,
  GetTemplateInfoByKeyId,
} from "@/api/approval/approval";
import {
  Edit,
  Plus,
  CircleClose,
  CirclePlus,
  UploadFilled,
  Delete,
} from "@element-plus/icons-vue";
import { v4 as uuid4 } from "uuid";

//页面挂载之前
onBeforeMount(() => {});

//选中新建、查看、编辑按钮暂存templateKeyId
const templateKeyId = ref("");
//选中新建、查看、编辑按钮动作action
const templateAction = ref("");

//组件传递参数
const props = defineProps({
  templateKeyId: {
    type: String,
    default: "",
    required: true,
  },
  templateAction: {
    type: String,
    default: "",
    required: true,
  },
  ApprovalTemplateDrawerVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});

//组件监听
watch(
  () => props.ApprovalTemplateDrawerVisible,
  () => {
    templateKeyId.value = props.templateKeyId;
    templateAction.value = props.templateAction;
    console.log("watch监控templateKeyId=" + templateKeyId.value);
    console.log("watch监控templateAction=" + templateAction.value);
    if (props.templateAction != "create") {
      console.log("templateAction.value", templateAction.value);
      HandleGetTemplateInfoByKeyId(templateKeyId.value);
    } else {
      resetFormData();
    }
  }
);

const selectedInput = ref([]);
//审批流程模版抽屉显示
const ApprovalModuleDrawerVisible = ref(false);

//当前登录人信息
const currentUser = ref(store.getters.GET_USERINFO);

//审批节点中审批类型
const approver_node_type_radio = ref("1");

//审批人列表选择项
const select_approver_options = ref([]);
const CurrentApprovalModuleData = ref([
  {
    keyId: uuid4(),
    stepName: "1级审批人",
    value: "node1",
    label: "1级审批人",
    isSkip: false,
    approveUserId: [],
    copyUserId: [],
    createdBy: currentUser.value.username,
    aboveStepKeyId: "",
    nextStepKeyId: "",
    orderNum: 0,
    nodeSignType: 1,
  },
]);
const form = reactive({
  keyId: "",
  templateName: "",
  templateDesc: "",
  applyUserId: currentUser.value.username,
  CurrentApprovalModuleData: [],
  copyUserId: [],
});
//======调用接口部分==========================================================
//获取用户列表options
const HandleGetUserListOption = async () => {
  const result = await getUserListOption();
  select_approver_options.value = result.data.userListForOptions;
};

//创建审批模板
const HandleSaveApprovalTemplate = async () => {
  renderApprovalModuleData();
  form.keyId = uuid4();
  form.CurrentApprovalModuleData = CurrentApprovalModuleData.value;
  console.log("form.value==", form);
  const result = await SaveApprovalTemplate(form);
  if (result.data.code == 200) {
    handleClose();
    ElMessage.success(result.data.msg);
    resetFormData();
  }
};

//通过模板keyId获取模板信息
const HandleGetTemplateInfoByKeyId = async (tKeyId) => {
  const result = await GetTemplateInfoByKeyId(tKeyId);
  form.keyId = result.data.templateInfo.keyId;
  form.templateName = result.data.templateInfo.templateName;
  form.templateDesc = result.data.templateInfo.templateDesc;
  CurrentApprovalModuleData.value = result.data.templateList;
  // form.copyUserId = result.data.templateInfo.copyUserId;
  // form.copyUserId = form.copyUserId.split(",");

  //由于后端存储的是字符串，故在这要转为数组，便于组件解析
  CurrentApprovalModuleData.value.forEach((element) => {
    element.approveUserId = element.approveUserId.split(",");
  });

  console.log("form.value ==", form);
  console.log(
    "CurrentApprovalModuleData.value==",
    CurrentApprovalModuleData.value
  );
};

//================================================================

//打开抽屉
const HandleShowDrawer = async () => {
  ApprovalModuleDrawerVisible.value = true;
};

// 下一步
const next = () => {
  if (active.value++ > 2) active.value = 0;
};
// 上一步
const back = () => {
  if (active.value-- <= 0) active.value = 0;
};
const handleChange = (value) => {
  console.log("value", value);
  CurrentApprovalModuleData.value = [];
  approval_module_data.forEach((e) => {
    if (e.value == value) {
      console.log(value + "等价value=", e.value);
      CurrentApprovalModuleData.value = e.approver_node;
      console.log("e.approver_node", e.approver_node);
    }
    console.log("CurrentApprovalModuleData", CurrentApprovalModuleData);
  });
};

//在此节点下添加新的审批节点 / 删除当前审批节点
const HandleAddOrDelApprovalNode = (keyId, type) => {
  console.log("keyId==", keyId);
  let current_index = 0;
  for (let index = 0; index < CurrentApprovalModuleData.value.length; index++) {
    if (CurrentApprovalModuleData.value[index].keyId == keyId)
      current_index = index;
  }
  if (type == "add") {
    const obj = {
      keyId: uuid4(),
      stepName: current_index + "级审批人",
      value: "node" + current_index,
      approveUserId: ref([]),
      copyUserId: [],
      isSkip: false,
      createdBy: currentUser.value.username,
      aboveStepKeyId: keyId,
      nextStepKeyId: "",
      orderNum: -1,
    };
    CurrentApprovalModuleData.value.splice(current_index + 1, 0, obj);
    ElMessage.success("添加成功！");
  }
  if (type == "del") {
    console.log(
      "CurrentApprovalModuleData.value.length=",
      CurrentApprovalModuleData.value.length
    );
    console.log(
      "CurrentApprovalModuleData.value[0].keyId=",
      CurrentApprovalModuleData.value[0].keyId
    );
    console.log("keyId=", keyId);
    //如果当前只剩下一个审批节点，则不允许删除
    if (
      CurrentApprovalModuleData.value.length == 1 &&
      CurrentApprovalModuleData.value[0].keyId == keyId
    ) {
      console.log("必须保留一个审批节点！", keyId);
      ElMessage.error("必须保留一个审批节点！");
    } else {
      CurrentApprovalModuleData.value.splice(current_index, 1);
      ElMessage.success("节点删除成功！");
    }
  }
  renderApprovalModuleData();
  console.log(
    "CurrentApprovalModuleData.value===",
    CurrentApprovalModuleData.value
  );
};

//重新渲染审批节点顺序
const renderApprovalModuleData = () => {
  for (let index = 0; index < CurrentApprovalModuleData.value.length; index++) {
    CurrentApprovalModuleData.value[index].orderNum = index + 1;
    CurrentApprovalModuleData.value[index].stepName = index + 1 + "级审批人";
    CurrentApprovalModuleData.value[index].value = index + 1 + "级审批人";
    CurrentApprovalModuleData.value[index].label = index + 1 + "级审批人";
    //第1个节点,默认设置为当前审批节点
    if (index == 0) {
      //只剩下一个节点时,下一节点为当前节点
      if (CurrentApprovalModuleData.value.length == 1) {
        CurrentApprovalModuleData.value[index].nextStepKeyId =
          CurrentApprovalModuleData.value[index].keyId;
      } else {
        CurrentApprovalModuleData.value[index].nextStepKeyId =
          CurrentApprovalModuleData.value[index + 1].keyId;
      }
      CurrentApprovalModuleData.value[index].aboveStepKeyId =
        CurrentApprovalModuleData.value[index].keyId;
    }
    //第2个审批节点开始-->倒是第2个节点，保存当前的上一级节点、下一级节点
    else if (index >= 1 && index < CurrentApprovalModuleData.value.length - 1) {
      CurrentApprovalModuleData.value[index].aboveStepKeyId =
        CurrentApprovalModuleData.value[index - 1].keyId;
      CurrentApprovalModuleData.value[index].nextStepKeyId =
        CurrentApprovalModuleData.value[index + 1].keyId;
      //最后一个节点
    } else if (index == CurrentApprovalModuleData.value.length - 1) {
      CurrentApprovalModuleData.value[index].aboveStepKeyId =
        CurrentApprovalModuleData.value[index - 1].keyId;
      CurrentApprovalModuleData.value[index].nextStepKeyId = "";
    }
  }
};
const emits = defineEmits(["update:modelValue", "HandleGetApprovalNoticeList"]);

const handleClose = () => {
  emits("update:modelValue", false);
  resetFormData();
};

//重置表单
const resetFormData = () => {
  form.keyId = "";
  form.templateName = "";
  form.templateDesc = "";
  form.applyUserId = currentUser.value.username;
  form.CurrentApprovalModuleData = [];
  form.copyUserId = [];

  console.log("form重置后=", form);
  CurrentApprovalModuleData.value = [
    {
      keyId: uuid4(),
      stepName: "1级审批人",
      value: "node1",
      label: "1级审批人",
      isSkip: false,
      approveUserId: [],
      copyUserId: [],
      createdBy: currentUser.value.username,
      aboveStepKeyId: "",
      nextStepKeyId: "",
      orderNum: 0,
      nodeSignType: 1,
    },
  ];

  console.log(
    "CurrentApprovalModuleData.value重置后=",
    CurrentApprovalModuleData.value
  );
};
</script>

<style scoped>
.step_node_item {
  box-shadow: -5px 7px 48px -3px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  height: 120px;
  width: auto;
  padding-top: 25px;
  padding-left: 20px;
}
.step_node_line {
  margin-left: 10px;
}
</style>