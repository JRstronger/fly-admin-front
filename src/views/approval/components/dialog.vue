<template>
  <el-dialog width="80%" @close="handleClose">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="填写申请信息"></el-step>
      <el-step title="步骤 2" description="选择审批人/抄送人"></el-step>
      <el-step title="步骤 3" description="发起审批"></el-step>
    </el-steps>
    <br />
    <br />
    <br />
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form ref="formRef" :model="form" label-width="80px">
          <el-form-item label="流程名称">
            <el-input
              v-model="form.process_name"
              placeholder="请输入流程名称..."
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input v-model="form.apply_user_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="申请理由">
            <el-input type="textarea" v-model="form.apply_reason"></el-input>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 步骤2 -->
      <el-col :span="10">
        <el-form-item label="选择审批模板">
          <el-select
            v-model="approval_module_value"
            placeholder="请选择审批模版..."
            @change="handleChange(approval_module_value)"
            @click="HandleGetUserListOption"
          >
            <el-option
              v-for="item in approval_module_data"
              v-model="item.value"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="item2 in current_approval_module_data"
          v-model="item2.value"
          :label="item2.label"
          :key="item2.value"
          :value="item2.value"
        >
          <el-select
            v-model="item2.approver_input_selected"
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
          <span>&nbsp;</span>
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button type="primary" :icon="Edit" circle size="small" />
            </template>
            <div>
              <el-radio-group v-model="approver_node_type_radio">
                <el-radio label="1" border>会签（所有人都同意即可）</el-radio>
                <br />
                <el-radio label="2" border>或签（任意一个同意即可）</el-radio>
              </el-radio-group>
              <br />
              <el-form-item label="抄送至">
                <el-select
                  v-model="item2.copy_input_selected"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="3"
                  placeholder="请选择抄送给..."
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in select_approver_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-popover>
          <span>&nbsp;&nbsp;</span>
          <el-form-item>
            <el-tooltip
              class="box-item"
              effect="light"
              content="在此下方添加审批节点"
              placement="top-start"
            >
              <el-icon
                @click="HandleAddOrDelApprovalNode(item2.key_id, 'add')"
                size="large"
                ><CirclePlus
              /></el-icon>
            </el-tooltip>
          </el-form-item>
          <span>&nbsp;&nbsp;</span>
          <el-form-item>
            <el-tooltip
              class="box-item"
              effect="light"
              content="删除当前审批节点"
              placement="top-start"
            >
              <el-icon
                @click="HandleAddOrDelApprovalNode(item2.key_id, 'del')"
                size="large"
                ><CircleClose
              /></el-icon>
            </el-tooltip>
          </el-form-item>
        </el-form-item>
        <br />
        <el-button style="margin-top: 50px; margin-left: 80px" @click="back"
          >上一步</el-button
        >
        <el-button style="margin-top: 50px" @click="next">下一步</el-button>
        <el-button style="margin-top: 50px" @click="CreateApproveProcess"
          >創建流程</el-button
        >
      </el-col>
      <el-col :span="6">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="3"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">点击上传附件</el-button>
          <template #tip> </template> </el-upload
      ></el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref } from "vue";
import store from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import requestUtil, { getServerUrl } from "@/util/request";
import { getUserListOption, queryUserById } from "@/api/sys/user";
import { AddApproveProcess } from "@/api/approval/approval";
import { Edit, Plus, CircleClose, CirclePlus } from "@element-plus/icons-vue";
import { v4 as uuid4 } from "uuid";

const formRef = ref(null);

//当前登录人信息
const currentUser = ref(store.getters.GET_USERINFO);
//当前选择的审批模板
const approval_module_value = ref("");
//审批模板列表选择项
const approval_module_options = [
  {
    value: "Option1",
    label: "默认模板",
  },
  {
    value: "Option2",
    label: "二级审批",
    disabled: true,
  },
  {
    value: "Option3",
    label: "三级审批",
  },
];
//审批节点中审批类型
const approver_node_type_radio = ref("1");
//当前选择的审批人
const approver_input_selected = ref([]);
//审批人列表选择项
const select_approver_options = ref([
  {
    value: 1,
    label: "飞流1",
  },
  {
    value: 1,
    label: "飞流2",
  },
  {
    value: 3,
    label: "飞流3",
  },
  {
    value: 4,
    label: "飞流4",
  },
]);
const current_approval_module_data = ref([
  {
    key_id: uuid4(),
    value: "node1",
    label: "1级审批人",
    is_skip: false,
    approver_input_selected: [],
    copy_input_selected: [""],
    created_by: currentUser.value.username,
    above_step_key_id: "",
    next_step_key_id: "",
    order_num: 0,
  },
]);
//审批模板数据
const approval_module_data = [
  {
    value: "module1",
    label: "默认模板",

    approver_node: [
      {
        value: "node1",
        label: "1级审批人",
        approver_input_selected: [
          {
            value: "飞流1",
            label: "飞流1",
          },
        ],
      },
    ],
  },

  {
    value: "module2",
    label: "二级审批",
    approver_node: [
      {
        value: "node1",
        label: "1级审批人",
        approver_input_selected: [
          {
            value: "飞流3",
            label: "飞流3",
          },
        ],
      },
      {
        value: "node2",
        label: "2级审批人",
        approver_input_selected: [
          {
            value: "飞流1",
            label: "飞流1",
          },
          {
            value: "飞流2",
            label: "飞流2",
          },
        ],
      },
    ],
  },
];
//表单字段变量
const form = reactive({
  process_id: "",
  apply_reason: "",
  process_name: "",
  apply_user_id: currentUser.value.username,
  current_approval_module_data: [{}],
});
const active = ref(0);
const emits = defineEmits(["update:modelValue", "initApprovalList"]);

const handleClose = () => {
  formRef.value.resetFields();
  emits("update:modelValue", false);
};

//======调用接口部分==========================================================
const HandleGetUserListOption = async () => {
  const result = await getUserListOption();
  select_approver_options.value = result.data.userListForOptions;
  console.log(
    "approver_input_selected.value===",
    approver_input_selected.value
  );
};

//创建流程
const CreateApproveProcess = async () => {
  form.process_id = uuid4();
  form.apply_user_id = currentUser.value.username;
  form.current_approval_module_data = current_approval_module_data.value;
  const result = await AddApproveProcess(form);
  if (result.data.code === 200) {
    handleClose();
    formRef.value.resetFields();
    emits("initApprovalList");
    ElMessage.success("流程创建成功！");
  }
};

//================================================================
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
  current_approval_module_data.value = [];
  approval_module_data.forEach((e) => {
    if (e.value == value) {
      console.log(value + "等价value=", e.value);
      current_approval_module_data.value = e.approver_node;
      console.log("e.approver_node", e.approver_node);
    }
    console.log("current_approval_module_data", current_approval_module_data);
  });
};

//在此节点下添加新的审批节点 / 删除当前审批节点
const HandleAddOrDelApprovalNode = (key_id, type) => {
  let current_index = 0;
  for (
    let index = 0;
    index < current_approval_module_data.value.length;
    index++
  ) {
    if (current_approval_module_data.value[index].key_id == key_id)
      current_index = index;
  }
  if (type == "add") {
    const obj = {
      key_id: uuid4(),
      label: current_index + "级审批人",
      value: "node" + current_index,
      approver_input_selected: ref([]),
      copy_input_selected: [],
      is_skip: false,
      created_by: currentUser.value.username,
      above_step_key_id: key_id,
      next_step_key_id: "",
      order_num: -1,
    };
    current_approval_module_data.value.splice(current_index + 1, 0, obj);
  }
  if (type == "del") {
    current_approval_module_data.value.splice(current_index, 1);
  }
  renderApprovalModuleData();
  console.log(
    "current_approval_module_data.value===",
    current_approval_module_data.value
  );
};

//重新渲染审批节点顺序
const renderApprovalModuleData = () => {
  for (
    let index = 0;
    index < current_approval_module_data.value.length;
    index++
  ) {
    current_approval_module_data.value[index].order_num = index + 1;
    current_approval_module_data.value[index].value = index + 1 + "级审批人";
    current_approval_module_data.value[index].label = index + 1 + "级审批人";
    //第1个节点
    if (index == 0) {
      current_approval_module_data.value[index].above_step_key_id =
        current_approval_module_data.value[index].key_id;
      current_approval_module_data.value[index].next_step_key_id =
        current_approval_module_data.value[index + 1].key_id;
    }
    //第2个审批节点开始-->倒是第2个节点，保存当前的上一级节点、下一级节点
    else if (
      index >= 1 &&
      index < current_approval_module_data.value.length - 1
    ) {
      current_approval_module_data.value[index].above_step_key_id =
        current_approval_module_data.value[index - 1].key_id;
      current_approval_module_data.value[index].next_step_key_id =
        current_approval_module_data.value[index + 1].key_id;
      //最后一个节点
    } else if (index == current_approval_module_data.value.length - 1) {
      current_approval_module_data.value[index].above_step_key_id =
        current_approval_module_data.value[index - 1].key_id;
      current_approval_module_data.value[index].next_step_key_id = "";
    }
  }
};

const fileList = ref<UploadUserFile[]>([
  {
    name: "element-plus-logo.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg",
  },
  {
    name: "element-plus-logo2.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg",
  },
]);

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};
</script>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>