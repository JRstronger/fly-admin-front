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
      <el-button type="primary" :icon="Search" @click="initUserList"
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
        prop="process_name"
        label="流程名称"
        width="100"
        align="center"
      />
      <el-table-column
        prop="process_status"
        label="流程状态"
        width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="apply_user_id"
        label="流程发起者"
        width="200"
        align="center"
      />
      <el-table-column
        prop="current_step_id"
        label="当前步骤节点"
        width="200"
        align="center"
      />
      <el-table-column
        prop="created_by"
        label="创建人"
        width="200"
        align="center"
      />
      <el-table-column
        prop="created_dt"
        label="创建时间"
        width="200"
        align="center"
      />
      <el-table-column
        prop="created_dt"
        label="进度"
        width="150"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            @click="drawer = true"
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
  />

  <el-drawer title="我是外面的 Drawer" :visible.sync="true" size="50%">
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import requestUtil, { getServerUrl } from "@/util/request";
import {
  Search,
  Delete,
  DocumentAdd,
  Edit,
  Tools,
  RefreshRight,
} from "@element-plus/icons-vue";
import Dialog from "./components/dialog";
import { ElMessage, ElMessageBox } from "element-plus";
import RoleDialog from "./components/roleDialog";
import {
  getUserList,
  deleteUserById,
  resetPassword,
  updateStatus,
} from "@/api/sys/user";

const drawer = ref(false);
const tableData = ref([]);

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

const sysRoleList = ref([]);

const roleDialogVisible = ref(false);

const handleSelectionChange = (selection) => {
  console.log("勾选了");
  console.log(selection);
  multipleSelection.value = selection;
  delBtnStatus.value = selection.length == 0;
};

const handleRoleDialogValue = (userId, roleList) => {
  console.log("userId=" + userId);
  id.value = userId;
  sysRoleList.value = roleList;
  roleDialogVisible.value = true;
};

const initUserList = async () => {
  // const res = await requestUtil.post("sys/user/list", queryForm.value);
  const res = await getUserList(queryForm.value);
  tableData.value = res.data.userList;
  total.value = res.data.total;
};

initUserList();

const handleSizeChange = (pageSize) => {
  queryForm.value.pageNum = 1;
  queryForm.value.pageSize = pageSize;
  initUserList();
};

const handleCurrentChange = (pageNum) => {
  queryForm.value.pageNum = pageNum;
  initUserList();
};

const handleDialogValue = (userId) => {
  dialogVisible.value = true;
};

const handleDelete = async (id) => {
  var ids = [];
  if (id) {
    ids.push(id);
  } else {
    multipleSelection.value.forEach((row) => {
      ids.push(row.id);
    });
  }
  // const res = await requestUtil.post("sys/user/delete", ids);
  const res = await deleteUserById(ids);
  if (res.data.code == 200) {
    ElMessage({
      type: "success",
      message: "执行成功!",
    });
    initUserList();
  } else {
    ElMessage({
      type: "error",
      message: res.data.msg,
    });
  }
};

const handleResetPassword = async (id) => {
  // const res = await requestUtil.get("sys/user/resetPassword/" + id);
  const res = await resetPassword(id);
  if (res.data.code == 200) {
    ElMessage({
      type: "success",
      message: "执行成功!",
    });
    initUserList();
  } else {
    ElMessage({
      type: "error",
      message: res.data.msg,
    });
  }
};

const statusChangeHandle = async (row) => {
  //let res = await requestUtil.get("sys/user/updateStatus/" + row.id + "/status/" + row.status);
  let res = await updateStatus(row.id, row.status);
  if (res.data.code == 200) {
    ElMessage({
      type: "success",
      message: "执行成功!",
    });
  } else {
    ElMessage({
      type: "error",
      message: res.data.msg,
    });
    initUserList();
  }
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
