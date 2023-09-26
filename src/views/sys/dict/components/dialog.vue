<template>
  <el-dialog
    model-value="dialogVisible"
    :title="dialogTitle"
    width="60%"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="字典名称" prop="paramName">
        <el-input v-model="form.paramName" />
      </el-form-item>
      <el-form-item label="字典编码" prop="paramCode">
        <el-input v-model="form.paramCode" />
      </el-form-item>

      <el-form-item label="字典值" prop="paramValue">
        <el-input v-model="form.paramValue" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <!-- 添加新字段弹出层 -->
    <el-popover
      placement="right"
      :width="400"
      :visible="addParamPopoverVisible"
    >
      <template #reference>
        <el-button
          type="primary"
          :icon="Plus"
          @click="(addParamPopoverVisible = true), handleAddColumn()"
          >添加新字段</el-button
        >
      </template>

      <el-form
        ref="formRef"
        :model="addPopoverForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="字典名称" prop="paramName">
          <el-input v-model="addPopoverForm.paramName" />
        </el-form-item>
        <el-form-item label="字段编码" prop="paramCode">
          <el-input v-model="addPopoverForm.paramCode" />
        </el-form-item>

        <el-form-item label="字段值" prop="paramValue">
          <el-input v-model="addPopoverForm.paramValue" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="addPopoverForm.remark" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleConfirmAddNewParam"
        >添加</el-button
      >
      <el-button @click="addParamPopoverVisible = false">取消</el-button>
    </el-popover>

    <el-table :data="dictParamChildrenTableData" stripe style="width: 100%">
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
        width="200"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <!-- 【更新】新字段弹出层 -->
          <el-popover
            placement="right"
            :width="400"
            @visible="updateParamPopoverVisible(scope.row.id)"
          >
            <template #reference>
              <el-button
                type="primary"
                :icon="Edit"
                @click="
                  (updateParamPopoverVisible = true),
                    handleAddColumn(scope.row.id)
                "
              />
            </template>

            <el-form
              ref="formRef"
              :model="addPopoverForm"
              :rules="rules"
              label-width="100px"
            >
              <el-form-item label="字典名称" prop="paramName">
                <el-input v-model="addPopoverForm.paramName" />
              </el-form-item>
              <el-form-item label="字段编码" prop="paramCode">
                <el-input v-model="addPopoverForm.paramCode" />
              </el-form-item>

              <el-form-item label="字段值" prop="paramValue">
                <el-input v-model="addPopoverForm.paramValue" />
              </el-form-item>

              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="addPopoverForm.remark"
                  type="textarea"
                  :rows="4"
                />
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="handleConfirmAddNewParam"
              >更新</el-button
            >
            <el-button @click="updateParamPopoverVisible = false"
              >取消</el-button
            >
          </el-popover>

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

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import {
  deleteDictById,
  saveDict,
  queryDictById,
  checkDictCode,
} from "@/api/sys/dict";
import { ElMessage } from "element-plus";
import store from "@/store";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";

//======常量定义======================================================================

//当前登录人信息
const currentUser = ref(store.getters.GET_USERINFO);

//字典对应值
const dictParamChildrenTableData = ref([]);

const form = ref({
  id: -1,
  typeId: null,
  paramCode: "",
  paramName: "",
  paramValue: "",
  remark: "",
  updatedBy: currentUser.value.username,
});

const handleCheckDictCode = async (rule, value, callback) => {
  if (form.value.id == -1) {
    const res = await checkDictCode(form.value.paramCode);
    if (res.data.code == 500) {
      callback(new Error("编码已存在！"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const formRef = ref(null);

//======弹出对话框常量定义======================================================================
const addPopoverForm = ref({
  id: -1,
  typeId: ref(form.value.typeId),
  paramCode: "",
  paramName: "",
  paramValue: "",
  remark: "",
  updatedBy: currentUser.value.username,
});

const typeId = ref(form.value.typeId);
//[添加]弹出层显示
const addParamPopoverVisible = ref(false);
//【修改】弹出层显示
const updateParamPopoverVisible = ref(false);

const handleAddColumn = async (id) => {
  console.log("handleAddColumn.typeId.value==", typeId.value);
  console.log("handleAddColumn.id==", id);
  const res = await queryDictById(id);
  addPopoverForm.value = res.data.sysDictParam;
  addPopoverForm.value.typeId = typeId.value;
};
const rules = ref({
  paramCode: [
    { required: true, message: "请输入字典编码" },
    { required: true, validator: handleCheckDictCode, trigger: "blur" },
  ],
});

//======组件传递属性======================================================================
const props = defineProps({
  id: {
    type: Number,
    default: -1,
    required: true,
  },
  dialogTitle: {
    type: String,
    default: "",
    required: true,
  },
  dialogVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});

watch(
  () => props.dialogVisible,
  () => {
    let id = props.id;
    console.log("id=" + id);
    typeId.value = props.id;
    if (id != -1) {
      initFormData(id);
    } else {
      dictParamChildrenTableData.value = [];
      form.value = {
        id: -1,
        typeId: null,
        paramCode: "",
        paramName: "",
        paramValue: "",
        remark: "",
        updatedBy: currentUser.value.username,
      };
    }
  }
);

const handleClose = () => {
  emits("update:modelValue", false);
  formRef.value.resetFields();
  addParamPopoverVisible.value = false;
};

const emits = defineEmits(["update:modelValue", "initDictParamList"]);

//======接口调用======================================================================

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
    initChildrenFormData(form.value.id);
  } else {
    ElMessage({
      type: "error",
      message: res.data.msg,
    });
  }
};

const initFormData = async (id) => {
  const res = await queryDictById(id);
  form.value = res.data.sysDictParam;
  dictParamChildrenTableData.value = res.data.sysDictParam.children;
};

const initChildrenFormData = async (id) => {
  const res = await queryDictById(id);
  dictParamChildrenTableData.value = res.data.sysDictParam.children;
};
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result = await saveDict(form.value);
      let data = result.data;
      if (data.code == 200) {
        ElMessage.success("执行成功！");
        formRef.value.resetFields();
        emits("initDictParamList");
        handleClose();
      } else {
        ElMessage.error(data.msg);
      }
    } else {
      console.log("fail");
    }
  });
};

//添加新字段确认按钮
const handleConfirmAddNewParam = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result = await saveDict(addPopoverForm.value);
      let data = result.data;
      if (data.code == 200) {
        ElMessage.success("执行成功！");
        formRef.value.resetFields();
        addParamPopoverVisible.value = false;
        initChildrenFormData(addPopoverForm.value.typeId);
      } else {
        ElMessage.error(data.msg);
      }
    } else {
      console.log("fail");
    }
  });
};
</script>

<style lang="scss" scoped>
</style>
