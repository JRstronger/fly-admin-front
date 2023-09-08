<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入流程名称..."
          v-model="queryForm.query"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initApprovalList"
        >搜索</el-button
      >
      <el-button type="success" :icon="DocumentAdd" @click="handleDialogValue()"
        >创建审批流</el-button
      >
    </el-row>

    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        prop="processName"
        label="流程名称"
        width="100"
        align="center"
        v-slot="scope"
      />
      <el-table-column
        prop="processStatus"
        label="流程状态"
        width="200"
        align="center"
        v-slot="scope"
      >
      </el-table-column>
      <el-table-column
        prop="applyUserId"
        label="流程发起者"
        width="200"
        align="center"
        v-slot="scope"
      >
        <el-tag size="small" type="warning">
          {{ scope.row.applyUserId }}</el-tag
        >
      </el-table-column>
      <el-table-column
        prop="currentStepId"
        label="当前步骤节点"
        width="200"
        align="center"
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
        width="200"
        align="center"
      />
      <el-table-column
        prop="createdDt"
        label="进度"
        width="150"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            @click="HandleShowSteps(scope.row.processId)"
            type="primary"
            style="margin-left: 16px"
          >
            查看进度
          </el-button>
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
  <Dialog
    v-model="dialogVisible"
    :dialogVisible="dialogVisible"
    :dialogTitle="dialogTitle"
    @initApprovalList="initApprovalList"
  />

  <el-drawer
    v-model="drawer"
    title="流程进度"
    size="40%"
    :before-close="handleCloseDrawer"
  >
    <div>
      <el-timeline>
        <el-timeline-item
          v-for="item in stepList"
          :key="item.stepKeyId"
          :timestamp="item.createdDt"
        >
          <el-card>
            <h2>
              <el-tag
                class="ml-2"
                type="primary"
                v-for="name in item.approveUserId.split(',')"
                :style="{ 'margin-right': '8px' }"
                >{{ name }}</el-tag
              >
            </h2>
            <br />
            <p>{{ item.stepName }}审批中...</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import requestUtil, { getServerUrl } from "@/util/request";
import {
  Search,
  Delete,
  DocumentAdd,
  Edit,
  Tools,
  RefreshRight,
  MoreFilled,
} from "@element-plus/icons-vue";
import Dialog from "./components/dialog";
import { ElMessage, ElMessageBox } from "element-plus";
import RoleDialog from "./components/roleDialog";
import {
  GetApprovalList,
  GetStepListByProcessId,
} from "@/api/approval/approval";

const drawer = ref(false);
const tableData = ref([{}]);

const total = ref(0);

const queryForm = ref({
  query: "",
  pageNum: 1,
  pageSize: 10,
});

const dialogVisible = ref(false);

const dialogTitle = ref("");

const id = ref(-1);

const delBtnStatus = ref(true);

const multipleSelection = ref([]);

const roleDialogVisible = ref(false);
const stepList = ref([
  {
    createdBy: "fly",
    updatedBy: "fly",
    createdDt: "2023-09-07T06:51:31.000+00:00",
    updatedDt: "2023-09-07T06:51:31.000+00:00",
    remark: null,
    stepKeyId: 1,
    stepName: "1级审批人",
    processId: "",
    isSkip: false,
    approveUserId: "[飞流3, 飞流1]",
    aboveStepKeyId: "",
    nextStepKeyId: "",
    operationAction: 0,
    orderNum: 0,
  },
]);

const handleSelectionChange = (selection) => {
  console.log("勾选了");
  console.log(selection);
  multipleSelection.value = selection;
  delBtnStatus.value = selection.length == 0;
};

//关闭抽屉
const handleCloseDrawer = (done: () => void) => {
  done();
};

//===调用接口部分=========================================================================

const HandleShowSteps = async (process_id) => {
  console.log("process_id==", process_id);
  const res = await GetStepListByProcessId(process_id);
  stepList.value = res.data.stepList;
  if (res.data.code == 200) {
    drawer.value = true;
  }
};

const initApprovalList = async () => {
  const res = await GetApprovalList(queryForm.value);
  tableData.value = res.data.approvalList;
  total.value = res.data.total;
};

//============================================================================
initApprovalList();

const handleSizeChange = (pageSize) => {
  queryForm.value.pageNum = 1;
  queryForm.value.pageSize = pageSize;
  initApprovalList();
};

const handleCurrentChange = (pageNum) => {
  queryForm.value.pageNum = pageNum;
  initApprovalList();
};

const handleDialogValue = (userId) => {
  dialogVisible.value = true;
};
</script>

<style lang="scss" scoped>
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

.el-tag--small {
  margin-left: 5px;
}
</style>
