<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入字典名..."
          v-model="queryForm.query"
          clearable
          @change="initDictParamList"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initDictParamList"
        >搜索</el-button
      >
      <el-button type="success" :icon="DocumentAdd" @click="handleDialogValue()"
        >新增</el-button
      >
    </el-row>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        prop="paramCode"
        label="字典编码"
        width="200"
        align="center"
      />
      <el-table-column
        prop="paramName"
        label="字典名称"
        width="200"
        align="center"
      />

      <el-table-column
        prop="paramValue"
        label="字典值"
        width="200"
        align="center"
      />

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
      >
        <template v-slot="scope">
          <el-button
            v-if="scope.row.username != 'fly'"
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.id)"
          />
          <el-popconfirm
            v-if="scope.row.code != 'admin'"
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" />
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
  <Dialog
    v-model="dialogVisible"
    :tableData="tableData"
    :dialogVisible="dialogVisible"
    :id="id"
    :dialogTitle="dialogTitle"
    @initDictParamList="initDictParamList"
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
import { getDictParamList, deleteDictById } from "@/api/sys/dict";
import Dialog from "./components/dialog";

const total = ref(0);

const queryForm = ref({
  query: "",
  pageNum: 1,
  pageSize: 10,
});

const tableData = ref([]);

const delBtnStatus = ref(true);

const multipleSelection = ref([]);

//======弹出对话框常量定义======================================================================

const dialogVisible = ref(false);

const dialogTitle = ref("");

const id = ref(-1);

//======组件方法======================================================================

const handleDialogValue = (rowId) => {
  if (rowId) {
    id.value = rowId;
    dialogTitle.value = "字典编辑";
  } else {
    id.value = -1;
    dialogTitle.value = "字典添加";
  }
  dialogVisible.value = true;
};

const handleSizeChange = (pageSize) => {
  queryForm.value.pageNum = 1;
  queryForm.value.pageSize = pageSize;
  initDictParamList();
};

const handleCurrentChange = (pageNum) => {
  queryForm.value.pageNum = pageNum;
  initDictParamList();
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
  const res = await deleteDictById(ids);
  if (res.data.code == 200) {
    ElMessage({
      type: "success",
      message: "执行成功!",
    });
    initDictParamList();
  } else {
    ElMessage({
      type: "error",
      message: res.data.msg,
    });
  }
};

//======接口调用======================================================================

const initDictParamList = async () => {
  const res = await getDictParamList(queryForm.value);
  tableData.value = res.data.dictList;
};

initDictParamList();
</script>
