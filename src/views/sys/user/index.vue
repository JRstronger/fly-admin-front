<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入用户名..."
          v-model="queryForm.query"
          clearable
          @change="initUserList"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initUserList"
        >搜索</el-button
      >
      <el-button type="success" :icon="DocumentAdd" @click="handleDialogValue()"
        >新增</el-button
      >
      <el-popconfirm
        title="您确定批量删除这些记录吗？"
        @confirm="handleDelete(null)"
      >
        <template #reference>
          <el-button type="danger" :disabled="delBtnStatus" :icon="Delete"
            >批量删除</el-button
          >
        </template>
      </el-popconfirm>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" class="deptTreeCol">
        <el-tree
          ref="treeRef"
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          @node-click="HandleCurrentNode"
        />
      </el-col>
      <el-col :span="20">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="avatar" label="头像" width="80" align="center">
            <template v-slot="scope">
              <img
                :src="getServerUrl() + 'image/userAvatar/' + scope.row.avatar"
                width="30"
                height="30"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            width="100"
            align="center"
          />
          <el-table-column
            prop="sysUserDeptPositionRelation"
            label="部门"
            width="100"
            align="center"
          >
            <template v-slot="scope">
              <el-tag
                size="small"
                type="danger"
                v-for="item in scope.row.sysUserDeptPositionRelation"
              >
                {{ item.sysDept.deptName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="sysUserDeptPositionRelation"
            label="职位"
            width="150"
            align="center"
          >
            <template v-slot="scope">
              <el-tag
                size="small"
                type="primary"
                v-for="item1 in scope.row.sysUserDeptPositionRelation"
              >
                {{ item1.sysPosition.positionName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="roles"
            label="拥有角色"
            width="200"
            align="center"
          >
            <template v-slot="scope">
              <el-tag
                size="small"
                type="warning"
                v-for="item2 in scope.row.sysRoleList"
              >
                {{ item2.name }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="200"
            align="center"
          />
          <el-table-column
            prop="phonenumber"
            label="手机号"
            width="120"
            align="center"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="200"
            align="center"
          >
            <template v-slot="{ row }">
              <el-switch
                v-model="row.status"
                @change="statusChangeHandle(row)"
                active-text="正常"
                inactive-text="禁用"
                active-value="0"
                inactive-value="1"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="200"
            align="center"
          />
          <el-table-column
            prop="loginDate"
            label="最后登录时间"
            width="200"
            align="center"
          />
          <el-table-column prop="remark" label="备注" />
          <el-table-column
            prop="action"
            label="操作"
            width="400"
            fixed="right"
            align="center"
          >
            <template v-slot="scope">
              <el-button
                type="primary"
                :icon="Tools"
                @click="
                  handleRoleDialogValue(scope.row.id, scope.row.sysRoleList)
                "
                >分配角色</el-button
              >
              <el-button
                v-if="scope.row.username != 'fly'"
                type="primary"
                :icon="Edit"
                @click="handleDialogValue(scope.row.id)"
              />
              <el-popconfirm
                v-if="scope.row.username != 'fly'"
                title="您确定要删除这条记录吗？"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button type="danger" :icon="Delete" />
                </template>
              </el-popconfirm>
              <el-popconfirm
                v-if="scope.row.username != 'fly'"
                title="您确定要对这个用户重置密码吗？"
                @confirm="handleResetPassword(scope.row.id)"
              >
                <template #reference>
                  <el-button type="warning" :icon="RefreshRight"
                    >重置密码</el-button
                  >
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
      </el-col>
    </el-row>
  </div>
  <Dialog
    v-model="dialogVisible"
    :dialogVisible="dialogVisible"
    :id="id"
    :dialogTitle="dialogTitle"
    @initUserList="initUserList"
  />
  <RoleDialog
    v-model="roleDialogVisible"
    :sysRoleList="sysRoleList"
    :roleDialogVisible="roleDialogVisible"
    :id="id"
    @initUserList="initUserList"
  ></RoleDialog>
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
import { ElMessage, ElTree } from "element-plus";
import RoleDialog from "./components/roleDialog";
import {
  getUserList,
  deleteUserById,
  resetPassword,
  updateStatus,
} from "@/api/sys/user";

import { getDeptTreeList } from "@/api/sys/dept";
const tableData = ref([]);

const total = ref(0);

const queryForm = ref({
  query: "",
  pageNum: 1,
  pageSize: 10,
  id: 0,
});

const dialogVisible = ref(false);

const dialogTitle = ref("");

const id = ref(-1);

const delBtnStatus = ref(true);

const multipleSelection = ref([]);

const sysRoleList = ref([]);

const roleDialogVisible = ref(false);

//======组织树组件======================================================================

const defaultProps = {
  children: "children",
  label: "deptName",
  id: "deptId",
};

const treeData = ref([]);

//======组件方法======================================================================

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
  const res = await getUserList(queryForm.value, 0);
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
  if (userId) {
    id.value = userId;
    dialogTitle.value = "用户修改";
  } else {
    id.value = -1;
    dialogTitle.value = "用户添加";
  }
  dialogVisible.value = true;
};

//====前端方法部分========================================================================

const HandleCurrentNode = async (data) => {
  console.log("当前节点ID：", data.deptId + data.deptName);
  queryForm.value.id = data.deptId;
  console.log("queryForm.value=", queryForm.value);
  const res = await getUserList(queryForm.value);
  tableData.value = res.data.userList;
  total.value = res.data.total;
};

//====后端接口调用部分========================================================================

const initDeptList = async () => {
  const res = await getDeptTreeList();
  treeData.value = res.data.treeDept;
};

initDeptList();

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
.deptTreeCol {
  border: 1px solid #eedede;
  border-radius: 5px;
  height: 550px;
}
</style>
