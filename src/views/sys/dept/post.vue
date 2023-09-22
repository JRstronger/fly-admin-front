<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入岗位名..."
          v-model="queryForm.query"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initPositionList"
        >搜索</el-button
      >
      <el-button
        type="success"
        :icon="DocumentAdd"
        @click="handlePostDialogValue()"
        >新增</el-button
      >
    </el-row>

    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        prop="positionName"
        label="职位名称"
        width="100"
        align="center"
      />
      <el-table-column
        prop="positionCode"
        label="职位编码"
        width="200"
        align="center"
      />
      <el-table-column
        prop="createdBy"
        label="创建人"
        width="120"
        align="center"
      />
      <el-table-column
        prop="positionStatus"
        label="职位状态"
        width="200"
        align="center"
      >
        <template v-slot="{ row }">
          <el-switch
            v-model="row.positionStatus"
            @change="statusChangeHandle(row)"
            active-text="正常"
            inactive-text="禁用"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdDt"
        label="创建时间"
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
        v-slot="scope"
      >
        <el-button
          type="primary"
          :icon="Edit"
          @click="handlePostDialogValue(scope.row.positionId)"
        />
        <el-popconfirm
          title="您确定要删除这条记录吗？"
          @confirm="handleDelete(scope.row.positionId)"
        >
          <template #reference>
            <el-button type="danger" :icon="Delete" />
          </template>
        </el-popconfirm>
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
  <PostDialog
    v-model="dialogVisible"
    :dialogVisible="dialogVisible"
    :positionId="positionId"
    :dialogTitle="dialogTitle"
    @initPositionList="initPositionList"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Search,
  Delete,
  DocumentAdd,
  Edit,
  Tools,
  RefreshRight,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import PostDialog from "./components/PostDialog";
import { getUserList } from "@/api/sys/user";

import {
  getPositionList,
  deletePositionById,
  updatePositionStatus,
} from "@/api/sys/dept";

const tableData = ref([]);

const total = ref(0);

const queryForm = ref({
  query: "",
  pageNum: 1,
  pageSize: 10,
});

const dialogVisible = ref(false);

const dialogTitle = ref("");

const positionId = ref(-1);

const delBtnStatus = ref(true);

const multipleSelection = ref([]);

//======组件方法======================================================================

const handleSelectionChange = (selection) => {
  console.log("勾选了");
  console.log(selection);
  multipleSelection.value = selection;
  delBtnStatus.value = selection.length == 0;
};

const initPositionList = async () => {
  const res = await getPositionList(queryForm.value);
  tableData.value = res.data.positionList;
  total.value = res.data.total;
};

initPositionList();

const handleSizeChange = (pageSize) => {
  queryForm.value.pageNum = 1;
  queryForm.value.pageSize = pageSize;
  initPositionList();
};

const handleCurrentChange = (pageNum) => {
  queryForm.value.pageNum = pageNum;
  initPositionList();
};

const handlePostDialogValue = (id) => {
  console.log("handlePostDialogValue.id", id);
  if (id) {
    positionId.value = id;
    dialogTitle.value = "职位修改";
  } else {
    positionId.value = -1;
    dialogTitle.value = "职位添加";
  }
  dialogVisible.value = true;
};

//====后端接口调用部分========================================================================

const handleDelete = async (id) => {
  var ids = [];
  if (id) {
    ids.push(id);
  } else {
    multipleSelection.value.forEach((row) => {
      ids.push(row.id);
    });
  }
  const res = await deletePositionById(ids);
  if (res.data.code == 200) {
    ElMessage({
      type: "success",
      message: "执行成功!",
    });
    initPositionList();
  } else {
    ElMessage({
      type: "error",
      message: res.data.msg,
    });
  }
};

const statusChangeHandle = async (row) => {
  let res = await updatePositionStatus(row.positionId, row.positionStatus);
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
    initPositionList();
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
