<template>
  <el-dialog :title="dialogTitle" width="30%" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="职位名称" prop="positionName">
        <el-input
          v-model="form.positionName"
          :disabled="form.positionId == -1 ? false : 'disabled'"
        />
      </el-form-item>

      <el-form-item label="职位编码" prop="positionCode">
        <el-input v-model="form.positionCode" max="11" />
      </el-form-item>

      <el-form-item label="状态" prop="positionStatus">
        <el-radio-group v-model="form.positionStatus">
          <el-radio :label="'1'">正常</el-radio>
          <el-radio :label="'0'">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import {
  savePositionById,
  selectPositionById,
  checkValueExist,
} from "@/api/sys/dept";
import store from "@/store";

//当前登录人信息
const currentUser = ref(store.getters.GET_USERINFO);
const props = defineProps({
  positionId: {
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

const form = ref({
  positionId: -1,
  positionName: "",
  positionCode: "",
  positionStatus: "1",
  remark: "",
  updatedBy: currentUser.value.username,
});

//岗位名称和编码唯一性检查
const handleCheckPositionName = async (rule, value, callback) => {
  if (form.value.positionId == -1) {
    const res = await checkValueExist("position_name", form.value.positionName);
    if (res.data.code == 500) {
      callback(new Error("职位名称已存在！"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const handleCheckPositionCode = async (rule, value, callback) => {
  if (form.value.positionId == -1) {
    const res = await checkValueExist("position_code", form.value.positionCode);
    if (res.data.code == 500) {
      callback(new Error("职位编码已存在！"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const rules = ref({
  positionName: [
    { required: true, message: "请输入岗位名" },
    { required: true, validator: handleCheckPositionName, trigger: "blur" },
  ],
  positionCode: [
    {
      required: true,
      validator: handleCheckPositionCode,
      message: "岗位编码不能为空",
      trigger: "blur",
    },
  ],
  remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
});

const formRef = ref(null);

const initFormData = async (id) => {
  const res = await selectPositionById(id);
  form.value = res.data.sysPosition;
};

watch(
  () => props.dialogVisible,
  () => {
    console.log("watch监听props.positionId=" + props.positionId);
    let id = props.positionId;
    console.log("id=" + id);
    if (id != -1) {
      initFormData(id);
    } else {
      form.value = {
        positionId: -1,
        positionName: "",
        positionCode: "",
        positionStatus: "1",
        remark: "",
        updatedBy: currentUser.value.username,
      };
    }
  }
);

const emits = defineEmits(["update:modelValue", "initPositionList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result = await savePositionById(form.value);
      let data = result.data;
      if (data.code == 200) {
        ElMessage.success("执行成功！");
        formRef.value.resetFields();
        emits("initPositionList");
        handleClose();
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
