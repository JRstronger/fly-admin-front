<template>
  <div class="app-container">
    <el-row class="header">
      <el-button type="success" :icon="DocumentAdd" @click="handleDialogValue()"
        >新增</el-button
      >
    </el-row>

    <el-table
      :data="tableData"
      row-key="deptId"
      stripe
      style="width: 100%; margin-bottom: 20px"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="deptName" label="部门名称" width="200" />
      <el-table-column prop="deptCode" label="部门编码" width="200" />
      <el-table-column prop="deptTel" label="部门电话" width="150" />
      <el-table-column prop="remark" label="描述" />
      <el-table-column prop="deptLeader" label="主管" width="100" />
      <el-table-column
        prop="deptStatus"
        label="状态"
        width="70"
        align="center"
      />
      <el-table-column
        prop="orderNum"
        label="排序"
        width="100"
        align="center"
      />
      <el-table-column
        prop="createdDt"
        label="创建时间"
        align="center"
        width="200"
      />
      <el-table-column
        prop="action"
        label="操作"
        width="200"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.deptId)"
          />
          <el-popconfirm
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.deptId)"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <Dialog
    v-model="dialogVisible"
    :tableData="tableData"
    :dialogVisible="dialogVisible"
    :deptId="deptId"
    :dialogTitle="dialogTitle"
    @initDeptTreeList="initDeptTreeList"
  />
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
import { getDeptTreeList, deleteDeptById } from "@/api/sys/dept";

//======常量定义======================================================================

const tableData = ref([]);

const dialogVisible = ref(false);

const dialogTitle = ref("");

const deptId = ref(-1);

//======组件方法======================================================================

const handleDialogValue = (id) => {
  console.log("handleDialogValue.Id===" + id);
  if (id) {
    deptId.value = id;
    dialogTitle.value = "部门修改";
  } else {
    deptId.value = -1;
    console.log("handleDialogValue部门添加deptId===", deptId.value);
    dialogTitle.value = "部门添加";
  }
  dialogVisible.value = true;
};

//======接口调用======================================================================

const initDeptTreeList = async () => {
  const res = await getDeptTreeList();
  tableData.value = res.data.treeDept;
};

initDeptTreeList();

const handleDelete = async (id) => {
  const res = await deleteDeptById(id);
  if (res.data.code == 200) {
    ElMessage({
      type: "success",
      message: "执行成功!",
    });
    initDeptTreeList();
  } else {
    ElMessage({
      type: "error",
      message: res.data.msg,
    });
  }
};
//================================================================================
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
  height: 20px;
  font-size: 13px;
}

.el-tag--small {
  margin-left: 5px;
}
</style>
