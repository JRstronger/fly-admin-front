<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入模板名称..."
          v-model="queryForm.query"
          clearable
          @change="initGetTemplateList"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initGetTemplateList"
        >搜索</el-button
      >
      <el-button
        type="success"
        :icon="DocumentAdd"
        @click="HandleShowDrawer('TEMPLATE', 'create')"
        >创建审批模板</el-button
      >
    </el-row>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        prop="templateName"
        label="审批模板名称"
        width="400"
        align="center"
        v-slot="scope"
      />
      <el-table-column
        prop="templateDesc"
        label="模板描述"
        width="400"
        align="center"
        v-slot="scope"
      />

      <el-table-column
        prop="createdBy"
        label="创建人"
        width="200"
        align="center"
      />
      <el-table-column
        prop="createdDt"
        label="创建时间"
        width="400"
        align="center"
      />
      <el-table-column
        prop="createdDt"
        label="操作"
        width="300"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            @click="HandleShowDrawer(scope.row.keyId, 'look')"
            type="primary"
            style="margin-left: 16px"
          >
            查看
          </el-button>
          <el-button
            @click="HandleShowDrawer(scope.row.keyId, 'edit')"
            type="primary"
            style="margin-left: 16px"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="您确定要删除这个模版吗？"
            @confirm="HandleDeleteTemplateById(scope.row.keyId)"
          >
            <template #reference>
              <el-button type="primary" style="margin-left: 16px">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="queryForm.pageNum"
      v-model:page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <ApprovalTemplateDrawer
    v-model="ApprovalTemplateDrawerVisible"
    :ApprovalTemplateDrawerVisible="ApprovalTemplateDrawerVisible"
    :templateKeyId="templateKeyId"
    :templateAction="templateAction"
  />
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref } from "vue";
import store from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";
import requestUtil, { getServerUrl } from "@/util/request";
import { getUserListOption, queryUserById } from "@/api/sys/user";
import {
  GetTemplateList,
  DeleteTemplateByKeyId,
} from "@/api/approval/approval";
import {
  Edit,
  Plus,
  CircleClose,
  CirclePlus,
  UploadFilled,
  Delete,
  Search,
} from "@element-plus/icons-vue";
import { v4 as uuid4 } from "uuid";
import ApprovalTemplateDrawer from "./components/ApprovalTemplateDrawer";

const tableData = ref([{}]);

const total = ref(0);

const queryForm = ref({
  query: "",
  pageNum: 1,
  pageSize: 10,
});

//选中新建、查看、编辑按钮暂存templateKeyId
const templateKeyId = ref("");
//选中新建、查看、编辑按钮动作action
const templateAction = ref("");

//审批流程模版抽屉显示
const ApprovalTemplateDrawerVisible = ref(false);

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
const select_approver_options = ref([]);
const current_approval_module_data = ref([
  {
    key_id: uuid4(),
    value: "node1",
    label: "1级审批人",
    is_skip: false,
    approver_input_selected: [],
    copy_input_selected: [],
    created_by: currentUser.value.username,
    above_step_key_id: "",
    next_step_key_id: "",
    order_num: 0,
  },
]);
const form = reactive({
  process_id: "",
  apply_reason: "",
  process_name: "",
  apply_user_id: currentUser.value.username,
  current_approval_module_data: [{}],
  current_step_id: "",
  attachment_list: [],
});
//======调用接口部分==========================================================
const initGetTemplateList = async () => {
  const res = await GetTemplateList(queryForm.value);
  tableData.value = res.data.templateList;
};

const HandleDeleteTemplateById = async (id) => {
  const res = await DeleteTemplateByKeyId(id);
  if (res.data.code == 200) {
    initGetTemplateList();
    ElMessage.success("删除成功！");
  }
};

//================================================================
initGetTemplateList();

const handleSizeChange = (pageSize) => {
  queryForm.value.pageNum = 1;
  queryForm.value.pageSize = pageSize;
  initGetTemplateList();
};

const handleCurrentChange = (pageNum) => {
  queryForm.value.pageNum = pageNum;
  initGetTemplateList();
};
//打开抽屉
const HandleShowDrawer = async (keyId, action) => {
  templateKeyId.value = keyId;
  templateAction.value = action;
  ApprovalTemplateDrawerVisible.value = true;
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
    ElMessage.success("添加成功！");
  }
  if (type == "del") {
    console.log(
      "current_approval_module_data.value.length=",
      current_approval_module_data.value.length
    );
    console.log(
      "current_approval_module_data.value[0].key_id=",
      current_approval_module_data.value[0].key_id
    );
    console.log("key_id=", key_id);
    //如果当前只剩下一个审批节点，则不允许删除
    if (
      current_approval_module_data.value.length == 1 &&
      current_approval_module_data.value[0].key_id == key_id
    ) {
      console.log("必须保留一个审批节点！", key_id);
      ElMessage.error("必须保留一个审批节点！");
    } else {
      current_approval_module_data.value.splice(current_index, 1);
      ElMessage.success("节点删除成功！");
    }
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
    //第1个节点,默认设置为当前审批节点
    if (index == 0) {
      //只剩下一个节点时,下一节点为当前节点
      if (current_approval_module_data.value.length == 1) {
        current_approval_module_data.value[index].next_step_key_id =
          current_approval_module_data.value[index].key_id;
      } else {
        current_approval_module_data.value[index].next_step_key_id =
          current_approval_module_data.value[index + 1].key_id;
      }
      current_approval_module_data.value[index].above_step_key_id =
        current_approval_module_data.value[index].key_id;

      form.current_step_id = current_approval_module_data.value[index].key_id;
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
</script>
<style   scoped>
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}

.el-pagination {
  float: right;
  padding: 20px;
  box-sizing: border-box;
}

::v-deep th.el-table__cell {
  word-break: break-word;
  background-color: #f8f8f9 !important;
  color: #515a6e;
  height: 40px;
  font-size: 13px;
}
.step_node_add_del {
  padding-top: 10px;
}
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